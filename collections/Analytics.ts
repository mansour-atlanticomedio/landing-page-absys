import type { CollectionConfig, Endpoint, PayloadHandler } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import { adminOnly, isAdmin } from '@/lib/access'
import { checkLimits, getClientIp, getMemoryStore, getTrustedIpOptions, ipRateLimitKey, UNKNOWN_IP } from '@/lib/security'
import { parseTrackBody } from '@/lib/analytics/body'
import { detectBrowser, detectDevice, isBot } from '@/lib/analytics/agent'
import { isIgnoredPath, normalizeReferrer } from '@/lib/analytics/normalize'
import { analyticsSecret, dayKey, visitorHash } from '@/lib/analytics/visitor'
import {
  BROWSERS,
  DEVICES,
  PRUNE_PROBABILITY,
  TRACK_RATE_LIMIT_PER_MIN,
  TRACK_RATE_LIMIT_UNKNOWN_IP_PER_MIN,
} from '@/lib/analytics/config'
import { getTodaySummary, pruneAnalytics } from '@/lib/analytics/queries'

const noContent = (reason?: string) => {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' }
  if (reason && process.env.NODE_ENV !== 'production') headers['X-Analytics-Skipped'] = reason
  return new Response(null, { status: 204, headers })
}

const ownHosts = (req: Parameters<PayloadHandler>[0]): string[] => {
  const hosts = [req.headers.get('host'), req.headers.get('x-forwarded-host')]
  try {
    if (process.env.NEXT_PUBLIC_SERVER_URL) hosts.push(new URL(process.env.NEXT_PUBLIC_SERVER_URL).host)
  } catch {
    // URL de entorno mal formada: se ignora
  }
  return hosts.filter((h): h is string => !!h)
}

// Registra una visita o un latido. Responde siempre 204 y no guarda IP ni user-agent: solo un hash que rota cada día
export const handleTrack: PayloadHandler = async (req) => {
  const res = await trackInner(req)
  const skipped = res.headers.get('X-Analytics-Skipped')
  if (process.env.NODE_ENV !== 'production') {
    console.log(`analytics.track ${skipped ? `descartada: ${skipped}` : 'registrada'} dnt=${req.headers.get('dnt')} gpc=${req.headers.get('sec-gpc')} ua=${(req.headers.get('user-agent') ?? '').slice(0, 60)}`)
  }
  return res
}

const trackInner: PayloadHandler = async (req) => {
  try {
    const headers = req.headers
    if (process.env.ANALYTICS_IGNORE_DNT !== 'true' && (headers.get('dnt') === '1' || headers.get('sec-gpc') === '1')) return noContent('dnt-o-gpc')

    const userAgent = headers.get('user-agent') ?? ''
    if (isBot(userAgent)) return noContent('bot')

    // El personal del panel (collection users) y la vista previa no cuentan
    if ((req.user as any)?.collection === 'users') return noContent('usuario-del-panel')
    if ((headers.get('cookie') ?? '').includes('__prerender_bypass')) return noContent('vista-previa')

    const ip = getClientIp(headers, getTrustedIpOptions())
    const limit = ip === UNKNOWN_IP ? TRACK_RATE_LIMIT_UNKNOWN_IP_PER_MIN : TRACK_RATE_LIMIT_PER_MIN
    const limits = await checkLimits(
      getMemoryStore(),
      [{ dimension: 'ip', key: ipRateLimitKey(ip), limit, windowMs: 60_000 }],
      Date.now(),
    )
    if (!limits.allowed) return noContent('rate-limit')

    const body = parseTrackBody(await (req as any).json?.().catch(() => null))
    if (!body || isIgnoredPath(body.path)) return noContent('cuerpo-o-ruta-ignorada')

    const visitor = visitorHash(analyticsSecret(), ip, userAgent, dayKey(new Date()))
    const db = (req.payload.db as any).drizzle

    if (body.type === 'view') {
      const referrer = body.entry ? normalizeReferrer(body.referrer, ownHosts(req)) : ''
      const isReader = (req.user as any)?.collection === 'loginCampus_service'
      await db.execute(sql`
        INSERT INTO analytics_events (path, referrer, visitor, device, browser, is_reader, is_entry, updated_at, created_at)
        VALUES (${body.path}, ${referrer}, ${visitor}, ${detectDevice(userAgent)}, ${detectBrowser(userAgent)}, ${isReader}, ${body.entry}, now(), now())`)
    }

    await db.execute(sql`
      INSERT INTO analytics_presence (visitor, path, last_seen, updated_at, created_at)
      VALUES (${visitor}, ${body.path}, now(), now(), now())
      ON CONFLICT (visitor) DO UPDATE SET path = EXCLUDED.path, last_seen = now(), updated_at = now()`)

    if (Math.random() < PRUNE_PROBABILITY) void pruneAnalytics(req.payload)
  } catch (err) {
    req.payload.logger.warn({ err }, 'analytics.track_failed')
  }
  return noContent()
}

// Resumen para el refresco en vivo del panel; solo administradores
export const handleSummary: PayloadHandler = async (req) => {
  const allowed = await isAdmin({ req } as any)
  if (!allowed) return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
  try {
    const summary = await getTodaySummary(req.payload)
    return Response.json(summary, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    req.payload.logger.error({ err }, 'analytics.summary_failed')
    return Response.json({ error: 'Error' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}

export const analyticsEndpoints: Endpoint[] = [
  { path: '/analytics/track', method: 'post', handler: handleTrack },
  { path: '/analytics/summary', method: 'get', handler: handleSummary },
]

// Las filas se escriben por SQL directo desde el endpoint (sin hooks ni Local API) para que registrar una visita sea barato
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics_events',
  labels: { singular: 'Evento de analítica', plural: 'Eventos de analítica' },
  admin: {
    group: 'Servicios internos',
    description: 'Visitas anónimas a la web. No guarda IP, user-agent ni datos personales.',
    hidden: true,
  },
  access: adminOnly,
  fields: [
    { name: 'path', label: 'Ruta', type: 'text', required: true, maxLength: 200, index: true },
    { name: 'referrer', label: 'Procedencia', type: 'text', maxLength: 100 },
    { name: 'visitor', label: 'Visitante (hash diario)', type: 'text', required: true, index: true },
    {
      name: 'device',
      label: 'Dispositivo',
      type: 'select',
      options: DEVICES.map((v) => ({ label: v, value: v })),
    },
    {
      name: 'browser',
      label: 'Navegador',
      type: 'select',
      options: BROWSERS.map((v) => ({ label: v, value: v })),
    },
    { name: 'is_reader', label: 'Lector del campus', type: 'checkbox', defaultValue: false },
    { name: 'is_entry', label: 'Primera página de la visita', type: 'checkbox', defaultValue: false },
  ],
}

export const AnalyticsPresence: CollectionConfig = {
  slug: 'analytics_presence',
  labels: { singular: 'Presencia', plural: 'Presencia' },
  admin: {
    group: 'Servicios internos',
    description: 'Visitantes activos en los últimos minutos (hash diario, sin datos personales).',
    hidden: true,
  },
  access: adminOnly,
  fields: [
    { name: 'visitor', label: 'Visitante (hash diario)', type: 'text', required: true, unique: true },
    { name: 'path', label: 'Ruta', type: 'text', maxLength: 200 },
    { name: 'last_seen', label: 'Último latido', type: 'date', required: true, index: true },
  ],
}
