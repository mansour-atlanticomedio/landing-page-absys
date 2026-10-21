import { IGNORED_PATH_PREFIXES, MAX_PATH_LENGTH, MAX_REFERRER_LENGTH } from './config'

const BASE_PATH = '/biblioteca'

// Ruta sin querystring ni hash, sin basePath ni barra final. null si no es una ruta válida
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  let p = raw.trim()
  if (!p.startsWith('/') || p.startsWith('//')) return null
  if (/[\u0000-\u001f\u007f\\]/.test(p)) return null
  p = p.split('#')[0].split('?')[0]
  if (p === BASE_PATH || p.startsWith(`${BASE_PATH}/`)) p = p.slice(BASE_PATH.length) || '/'
  p = p.replace(/\/{2,}/g, '/')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  if (p.length === 0 || p.length > MAX_PATH_LENGTH) return null
  return p
}

export function isIgnoredPath(path: string): boolean {
  return IGNORED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

// Solo el hostname de un referrer externo; vacío si es la propia web, no es http(s) o no se entiende
export function normalizeReferrer(raw: unknown, ownHosts: string[] = []): string {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 2048) return ''
  let host: string
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return ''
    host = url.hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return ''
  }
  if (!host || host.length > MAX_REFERRER_LENGTH) return ''
  const own = ownHosts.map((h) => h.toLowerCase().replace(/^www\./, '').split(':')[0])
  return own.includes(host) ? '' : host
}
