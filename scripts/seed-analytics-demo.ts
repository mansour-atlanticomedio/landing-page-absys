// Datos de demostración para el panel de estadísticas: npx tsx scripts/seed-analytics-demo.ts
// Para borrarlos: npx tsx scripts/seed-analytics-demo.ts --clean
// Los visitantes de demo llevan el prefijo "demo" y se identifican solo por eso; los datos reales no se tocan
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import config from '@payload-config'

const payload = await getPayload({ config })
const db = (payload.db as any).drizzle

try {
  await db.execute(sql`DELETE FROM analytics_events WHERE visitor LIKE 'demo%'`)
  await db.execute(sql`DELETE FROM analytics_presence WHERE visitor LIKE 'demo%'`)

  if (process.argv.includes('--clean')) {
    console.log('Datos de demo de analítica eliminados')
  } else {
    const paths = ['/', '/', '/', '/servicios', '/recursos/catalogo', '/recursos/catalogo/busqueda', '/investigacion', '/formacion', '/contacto', '/conocenos/quienes-somos', '/recursos/recursos-electronicos']
    const referrers = ['', '', '', 'google.com', 'google.com', 'campus.atlanticomedio.es', 'bing.com', 'duckduckgo.com']
    const devices = ['desktop', 'desktop', 'mobile', 'mobile', 'tablet', 'other']
    const browsers = ['chrome', 'chrome', 'safari', 'edge', 'firefox', 'other']
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    const rows: any[] = []

    for (let d = 59; d >= 0; d--) {
      const visitors = 5 + Math.floor(Math.random() * 30)
      for (let v = 0; v < visitors; v++) {
        const visitor = `demo${d}x${v}`.padEnd(32, '-')
        const device = pick(devices)
        const browser = pick(browsers)
        const reader = Math.random() < 0.3
        const hour = Math.min(23, Math.max(0, Math.round(11 + (Math.random() + Math.random() + Math.random() - 1.5) * 7)))
        const pages = 1 + Math.floor(Math.random() * 4)
        const ref = pick(referrers)
        for (let p = 0; p < pages; p++) {
          rows.push({ path: pick(paths), referrer: p === 0 ? ref : '', visitor, device, browser, reader, entry: p === 0, ago: d, hour, minute: Math.floor(Math.random() * 59) + p })
        }
      }
    }

    for (const r of rows) {
      await db.execute(sql`
        INSERT INTO analytics_events (path, referrer, visitor, device, browser, is_reader, is_entry, updated_at, created_at)
        VALUES (${r.path}, ${r.referrer}, ${r.visitor}, ${r.device}, ${r.browser}, ${r.reader}, ${r.entry},
          ((((now() AT TIME ZONE 'Europe/Madrid')::date - ${r.ago}::int)::timestamp + make_interval(hours => ${r.hour}, mins => ${Math.min(r.minute, 59)})) AT TIME ZONE 'Europe/Madrid'),
          ((((now() AT TIME ZONE 'Europe/Madrid')::date - ${r.ago}::int)::timestamp + make_interval(hours => ${r.hour}, mins => ${Math.min(r.minute, 59)})) AT TIME ZONE 'Europe/Madrid'))`)
    }
    for (let i = 0; i < 4; i++) {
      await db.execute(sql`
        INSERT INTO analytics_presence (visitor, path, last_seen, updated_at, created_at)
        VALUES (${`demo-online-${i}`.padEnd(32, '-')}, ${pick(paths)}, now(), now(), now())`)
    }
    console.log(`Sembrados ${rows.length} eventos de demo y 4 conectados`)
  }
} catch (err: any) {
  console.error(JSON.stringify(err.data?.errors ?? err, null, 2))
}
process.exit(0)
