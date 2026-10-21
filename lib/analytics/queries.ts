import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'
import { ANALYTICS_RETENTION_DAYS, ANALYTICS_TIMEZONE, PRESENCE_RETENTION_DAYS, PRESENCE_WINDOW_SECONDS } from './config'
import {
  fillDailySeries,
  fillHours,
  labelReferrers,
  pagesPerVisitor,
  rangeBounds,
  type DayPoint,
  type RangeDays,
} from './series'
import type { Browser, Device } from './config'

const TZ = ANALYTICS_TIMEZONE

const run = async (payload: Payload, query: ReturnType<typeof sql>): Promise<any[]> => {
  const res: any = await (payload.db as any).drizzle.execute(query)
  return res.rows ?? res
}

export async function countOnline(payload: Payload): Promise<number> {
  const rows = await run(
    payload,
    sql`SELECT count(*)::int AS n FROM analytics_presence WHERE last_seen > now() - make_interval(secs => ${PRESENCE_WINDOW_SECONDS})`,
  )
  return rows[0]?.n ?? 0
}

export interface TodaySummary {
  online: number
  views: number
  visitors: number
}

export async function getTodaySummary(payload: Payload): Promise<TodaySummary> {
  const [online, rows] = await Promise.all([
    countOnline(payload),
    run(
      payload,
      sql`SELECT count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
          FROM analytics_events
          WHERE created_at >= (((now() AT TIME ZONE ${TZ})::date)::timestamp AT TIME ZONE ${TZ})`,
    ),
  ])
  return { online, views: rows[0]?.views ?? 0, visitors: rows[0]?.visitors ?? 0 }
}

export interface Slice {
  key: string
  count: number
}

export interface AnalyticsData {
  range: RangeDays
  from: string
  to: string
  online: number
  totalViews: number
  // Suma de visitantes distintos de cada día: el hash rota a diario, así que no se puede saber si un mismo visitante volvió otro día
  totalVisitors: number
  perVisitor: number
  daily: DayPoint[]
  topPaths: Array<{ path: string; views: number }>
  referrers: Array<{ label: string; count: number }>
  devices: Slice[]
  browsers: Slice[]
  readers: { reader: number; anonymous: number }
  hours: Array<{ hour: number; views: number }>
}

export async function getAnalytics(payload: Payload, range: RangeDays): Promise<AnalyticsData> {
  const { from, to } = rangeBounds(range)
  const start = sql`(${from}::date)::timestamp AT TIME ZONE ${TZ}`
  const end = sql`((${to}::date + 1)::timestamp AT TIME ZONE ${TZ})`
  const where = sql`created_at >= ${start} AND created_at < ${end}`
  const local = sql`(created_at AT TIME ZONE ${TZ})`
  const dayVisitor = sql`concat(${local}::date::text, visitor)`

  const [online, daily, topPaths, referrers, devices, browsers, readers, hours] = await Promise.all([
    countOnline(payload),
    run(
      payload,
      sql`SELECT ${local}::date::text AS day, count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
          FROM analytics_events WHERE ${where} GROUP BY 1`,
    ),
    run(
      payload,
      sql`SELECT path, count(*)::int AS views FROM analytics_events WHERE ${where}
          GROUP BY path ORDER BY views DESC, path LIMIT 10`,
    ),
    run(
      payload,
      sql`SELECT coalesce(referrer, '') AS referrer, count(*)::int AS count FROM analytics_events
          WHERE ${where} AND is_entry GROUP BY 1`,
    ),
    run(
      payload,
      sql`SELECT device AS key, count(DISTINCT ${dayVisitor})::int AS count FROM analytics_events
          WHERE ${where} GROUP BY 1 ORDER BY 2 DESC`,
    ),
    run(
      payload,
      sql`SELECT browser AS key, count(DISTINCT ${dayVisitor})::int AS count FROM analytics_events
          WHERE ${where} GROUP BY 1 ORDER BY 2 DESC`,
    ),
    run(
      payload,
      sql`SELECT coalesce(is_reader, false) AS reader, count(DISTINCT ${dayVisitor})::int AS count FROM analytics_events
          WHERE ${where} GROUP BY 1`,
    ),
    run(
      payload,
      sql`SELECT extract(hour FROM ${local})::int AS hour, count(*)::int AS views FROM analytics_events
          WHERE ${where} GROUP BY 1`,
    ),
  ])

  const series = fillDailySeries(daily, from, to)
  const totalViews = series.reduce((a, d) => a + d.views, 0)
  const totalVisitors = series.reduce((a, d) => a + d.visitors, 0)

  return {
    range,
    from,
    to,
    online,
    totalViews,
    totalVisitors,
    perVisitor: pagesPerVisitor(totalViews, totalVisitors),
    daily: series,
    topPaths,
    referrers: labelReferrers(referrers),
    devices: devices.map((r) => ({ key: r.key as Device, count: r.count })),
    browsers: browsers.map((r) => ({ key: r.key as Browser, count: r.count })),
    readers: {
      reader: readers.find((r) => r.reader === true)?.count ?? 0,
      anonymous: readers.find((r) => r.reader === false)?.count ?? 0,
    },
    hours: fillHours(hours),
  }
}

// Poda perezosa: eventos pasada la retención y presencia vieja. Nunca debe romper quien la llama
export async function pruneAnalytics(payload: Payload): Promise<void> {
  try {
    await run(payload, sql`DELETE FROM analytics_events WHERE created_at < now() - make_interval(days => ${ANALYTICS_RETENTION_DAYS})`)
    await run(payload, sql`DELETE FROM analytics_presence WHERE last_seen < now() - make_interval(days => ${PRESENCE_RETENTION_DAYS})`)
  } catch (err) {
    payload.logger.warn({ err }, 'analytics.prune_failed')
  }
}
