import { normalizePath } from './normalize'

export interface TrackBody {
  type: 'view' | 'ping'
  path: string
  referrer: string
  entry: boolean
}

// Valida y acota el cuerpo; null si no es utilizable (el endpoint responde 204 igualmente)
export function parseTrackBody(input: unknown): TrackBody | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const raw = input as Record<string, unknown>
  if (raw.type !== 'view' && raw.type !== 'ping') return null
  const path = normalizePath(raw.path)
  if (!path) return null
  return {
    type: raw.type,
    path,
    referrer: typeof raw.referrer === 'string' ? raw.referrer.slice(0, 2048) : '',
    entry: raw.entry === true,
  }
}
