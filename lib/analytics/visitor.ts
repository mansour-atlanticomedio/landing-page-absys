import { createHmac } from 'node:crypto'
import { ANALYTICS_TIMEZONE } from './config'

// Día natural (YYYY-MM-DD) en la zona de la biblioteca; la sal rota a medianoche local
export function dayKey(date: Date, timeZone: string = ANALYTICS_TIMEZONE): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

export function analyticsSecret(env: Record<string, string | undefined> = process.env): string {
  if (!env.PAYLOAD_SECRET) throw new Error('analytics_secret_missing')
  return createHmac('sha256', env.PAYLOAD_SECRET).update('analytics-v1').digest('hex')
}

export function dailySalt(secret: string, day: string): string {
  return createHmac('sha256', secret).update(`salt:${day}`).digest('hex')
}

// Hash truncado (128 bits) de IP+UA con la sal del día: no es reversible y no enlaza días distintos
export function visitorHash(secret: string, ip: string, userAgent: string, day: string): string {
  return createHmac('sha256', dailySalt(secret, day)).update(`${ip}\u0000${userAgent}`).digest('hex').slice(0, 32)
}
