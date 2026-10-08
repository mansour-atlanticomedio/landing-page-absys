import { isIPv4, isIPv6 } from 'node:net'

export const UNKNOWN_IP = 'unknown'

export interface ClientIpOptions {
  trustedHeader?: string
  // Solo para x-forwarded-for: 1 = último elemento (el que añadió nuestro proxy)
  trustedHopFromRight?: number
}

function normalizeIpv4(ip: string): string | null {
  const parts = ip.split('.')
  if (parts.length !== 4) return null
  // Se rechazan ceros a la izquierda: algunas librerías los leen como octal
  if (parts.some((p) => !/^(0|[1-9]\d{0,2})$/.test(p) || Number(p) > 255)) return null
  return parts.join('.')
}

function expandIpv6(ip: string): number[] | null {
  let tail: number[] = []
  let body = ip
  const lastColon = ip.lastIndexOf(':')
  const maybeV4 = ip.slice(lastColon + 1)
  if (maybeV4.includes('.')) {
    const v4 = normalizeIpv4(maybeV4)
    if (!v4) return null
    const [a, b, c, d] = v4.split('.').map(Number)
    tail = [(a << 8) | b, (c << 8) | d]
    body = ip.slice(0, lastColon + 1) + '0:0'
  }

  const halves = body.split('::')
  if (halves.length > 2) return null
  const toGroups = (s: string) => (s === '' ? [] : s.split(':').map((g) => parseInt(g, 16)))
  const head = toGroups(halves[0])
  const rest = halves.length === 2 ? toGroups(halves[1]) : []
  const groups =
    halves.length === 2 ? [...head, ...new Array(8 - head.length - rest.length).fill(0), ...rest] : head
  if (groups.length !== 8 || groups.some((g) => Number.isNaN(g) || g < 0 || g > 0xffff)) return null
  if (tail.length) {
    groups[6] = tail[0]
    groups[7] = tail[1]
  }
  return groups
}

function compressIpv6(groups: number[]): string {
  let bestStart = -1
  let bestLen = 0
  for (let i = 0; i < 8; ) {
    if (groups[i] !== 0) {
      i++
      continue
    }
    let j = i
    while (j < 8 && groups[j] === 0) j++
    if (j - i > bestLen) {
      bestStart = i
      bestLen = j - i
    }
    i = j
  }
  const hex = groups.map((g) => g.toString(16))
  if (bestLen < 2) return hex.join(':')
  return `${hex.slice(0, bestStart).join(':')}::${hex.slice(bestStart + bestLen).join(':')}`
}

// Devuelve la IP canónica (IPv4 punteada o IPv6 comprimida en minúsculas) o null si es basura
export function normalizeIp(raw: string): string | null {
  const ip = raw.trim()
  if (!ip || ip.length > 45) return null
  if (isIPv4(ip)) return normalizeIpv4(ip)
  if (isIPv6(ip) && !ip.includes('%')) {
    const groups = expandIpv6(ip)
    if (!groups) return null
    const isMapped = groups.slice(0, 5).every((g) => g === 0) && groups[5] === 0xffff
    if (isMapped) {
      return `${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`
    }
    return compressIpv6(groups)
  }
  return null
}

/*
 * Clave para el rate limit: IPv4 tal cual; IPv6 agrupada por /64 (un usuario recibe un /64 entero
 * y rotar dentro de él sería evadir el límite). Lo no parseable cae en el cubo "unknown".
 */
export function ipRateLimitKey(ip: string): string {
  if (ip === UNKNOWN_IP) return UNKNOWN_IP
  const norm = normalizeIp(ip)
  if (!norm) return UNKNOWN_IP
  if (isIPv4(norm)) return norm
  const groups = expandIpv6(norm)
  if (!groups) return UNKNOWN_IP
  return `${groups.slice(0, 4).map((g) => g.toString(16).padStart(4, '0')).join(':')}::/64`
}

/*
 * x-forwarded-for: trustedHopFromRight debe ser EXACTAMENTE el número de proxies de confianza.
 * Si es mayor que los proxies reales, el elemento elegido lo escribió el cliente (spoofeable):
 * con "6.6.6.6, 1.1.1.1" y hop 2 devuelve 6.6.6.6 aunque nadie lo haya verificado.
 * Valores con puerto o corchetes ("1.2.3.4:80", "[::1]") no se interpretan: caen en unknown.
 */
export function getClientIp(headers: Headers, opts: ClientIpOptions = {}): string {
  const name = opts.trustedHeader?.trim().toLowerCase()
  if (!name) return UNKNOWN_IP

  const value = headers.get(name)
  if (!value) return UNKNOWN_IP

  if (name === 'x-forwarded-for') {
    const hop = opts.trustedHopFromRight ?? 1
    if (!Number.isInteger(hop) || hop < 1) return UNKNOWN_IP
    const items = value.split(',')
    const picked = items[items.length - hop]
    if (picked === undefined) return UNKNOWN_IP
    return normalizeIp(picked) ?? UNKNOWN_IP
  }

  // Cualquier otra cabecera debe traer una única IP, sin listas
  if (value.includes(',')) return UNKNOWN_IP
  return normalizeIp(value) ?? UNKNOWN_IP
}
