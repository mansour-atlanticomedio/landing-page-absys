import { ANALYTICS_TIMEZONE } from './config'
import { dayKey } from './visitor'

export const RANGES = [1, 7, 30, 90] as const
export type RangeDays = (typeof RANGES)[number]

export const RANGE_LABELS: Record<RangeDays, string> = {
  1: 'Hoy',
  7: 'Últimos 7 días',
  30: 'Últimos 30 días',
  90: 'Últimos 90 días',
}

export function parseRange(value: unknown): RangeDays {
  const raw = Array.isArray(value) ? value[0] : value
  const n = Number(raw)
  return (RANGES as readonly number[]).includes(n) ? (n as RangeDays) : 7
}

// Suma días a una fecha YYYY-MM-DD sin depender de la zona horaria del servidor
export function addDays(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + delta))
  return date.toISOString().slice(0, 10)
}

export function rangeBounds(days: RangeDays, now: Date = new Date(), timeZone: string = ANALYTICS_TIMEZONE) {
  const to = dayKey(now, timeZone)
  return { from: addDays(to, -(days - 1)), to }
}

export interface DayPoint {
  day: string
  views: number
  visitors: number
}

// Una entrada por día del rango, con ceros donde no hubo visitas
export function fillDailySeries(rows: Array<{ day: string; views: number; visitors: number }>, from: string, to: string): DayPoint[] {
  const byDay = new Map(rows.map((r) => [r.day, r]))
  const out: DayPoint[] = []
  for (let day = from; day <= to; day = addDays(day, 1)) {
    const r = byDay.get(day)
    out.push({ day, views: r?.views ?? 0, visitors: r?.visitors ?? 0 })
  }
  return out
}

export function fillHours(rows: Array<{ hour: number; views: number }>): Array<{ hour: number; views: number }> {
  const byHour = new Map(rows.map((r) => [r.hour, r.views]))
  return Array.from({ length: 24 }, (_, hour) => ({ hour, views: byHour.get(hour) ?? 0 }))
}

export const DIRECT_LABEL = 'Directo'

// Los referrers vacíos son visitas directas; devuelve como mucho `limit` filas ordenadas
export function labelReferrers(rows: Array<{ referrer: string; count: number }>, limit = 10) {
  const merged = new Map<string, number>()
  for (const r of rows) {
    const key = r.referrer ? r.referrer : DIRECT_LABEL
    merged.set(key, (merged.get(key) ?? 0) + r.count)
  }
  return [...merged.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
}

export function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 1000) / 10 : 0
}

export function pagesPerVisitor(views: number, visitors: number): number {
  return visitors > 0 ? Math.round((views / visitors) * 10) / 10 : 0
}
