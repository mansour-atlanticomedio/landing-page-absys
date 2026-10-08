import { createHash } from 'node:crypto'
import { UNKNOWN_IP, ipRateLimitKey } from './client-ip'
import type { RateLimitRule } from './rate-limit'

export type EmailKind = 'contacto' | 'sugerencia' | 'confirmacion' | 'pin' | 'bienvenida' | 'prestamo'

export interface LimitSpec {
  limit: number
  windowMs: number
}

export interface KindLimits {
  ip: LimitSpec[]
  // IP de usuarios autenticados: holgada por el NAT del campus; el límite real es `user`
  ipAuthenticated: LimitSpec[]
  unknownIp: LimitSpec[]
  user: LimitSpec[]
  recipient: LimitSpec[]
  internalGlobal: LimitSpec[]
  externalDomain: LimitSpec[]
  institutionalDomain: LimitSpec[]
  // Tope único por tipo para TODO *.dominio institucional: inventar subdominios no multiplica el
  // cupo, y contacto/sugerencia no agotan los PIN/avisos de todo el campus. El 1000/día por tipo
  // es un valor inicial: confirmar con el volumen real (matrícula) antes de producción.
  institutionalAggregate: LimitSpec[]
}

export type EmailLimits = Record<EmailKind, KindLimits>

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

const baseLimits = (): KindLimits => ({
  ip: [
    { limit: 3, windowMs: 10 * MIN },
    { limit: 10, windowMs: DAY },
  ],
  ipAuthenticated: [
    { limit: 200, windowMs: HOUR },
    { limit: 1000, windowMs: DAY },
  ],
  // Sin IP fiable todos comparten cubo, así que el tope es mucho más estricto
  unknownIp: [
    { limit: 1, windowMs: 10 * MIN },
    { limit: 3, windowMs: DAY },
  ],
  user: [
    { limit: 5, windowMs: HOUR },
    { limit: 20, windowMs: DAY },
  ],
  recipient: [
    { limit: 5, windowMs: HOUR },
    { limit: 20, windowMs: DAY },
  ],
  internalGlobal: [{ limit: 200, windowMs: DAY }],
  externalDomain: [{ limit: 20, windowMs: HOUR }],
  institutionalDomain: [{ limit: 500, windowMs: DAY }],
  institutionalAggregate: [{ limit: 1000, windowMs: DAY }],
})

export const DEFAULT_EMAIL_LIMITS: EmailLimits = {
  contacto: baseLimits(),
  sugerencia: baseLimits(),
  confirmacion: baseLimits(),
  pin: baseLimits(),
  bienvenida: baseLimits(),
  prestamo: baseLimits(),
}

export const DEFAULT_INSTITUTIONAL_DOMAINS = ['atlanticomedio.es']

const LABEL = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/

// Solo ASCII: los dominios IDN deben llegar ya en punycode
export function extractDomain(email: string): string | null {
  if (typeof email !== 'string' || email.length > 254) return null
  // Antes de pasar a minúsculas: el signo Kelvin (U+212A) se convierte en "k" con toLowerCase
  if (/[^\x21-\x7e]/.test(email)) return null
  if (/[<>,;"'()\\%|]/.test(email)) return null
  const parts = email.split('@')
  if (parts.length !== 2 || parts[0] === '' || parts[0].length > 64) return null
  if (parts[0].includes('..')) return null

  const domain = parts[1].toLowerCase()
  const labels = domain.split('.')
  if (labels.length < 2 || !labels.every((l) => LABEL.test(l))) return null
  if (!/^[a-z]{2,}$|^xn--[a-z0-9-]+$/.test(labels[labels.length - 1])) return null
  return domain
}

/*
 * Forma canónica para contar cuota: minúsculas, sin "+tag" y, en Gmail, sin puntos. Solo sirve
 * para las claves; el destino real del envío lo decide el llamador con la dirección validada.
 * Devuelve null si la dirección no es válida.
 */
export function canonicalRecipient(email: string): string | null {
  if (typeof email !== 'string') return null
  const trimmed = email.trim()
  if (!extractDomain(trimmed)) return null
  const at = trimmed.lastIndexOf('@')
  let local = trimmed.slice(0, at).toLowerCase()
  let domain = trimmed.slice(at + 1).toLowerCase()
  const plus = local.indexOf('+')
  if (plus !== -1) local = local.slice(0, plus)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    domain = 'gmail.com'
    local = local.replace(/\./g, '')
  }
  if (local === '') return null
  return `${local}@${domain}`
}

export function isInstitutionalDomain(
  domain: string,
  institutional: string[] = DEFAULT_INSTITUTIONAL_DOMAINS,
): boolean {
  const d = domain.toLowerCase()
  return institutional.some((inst) => {
    const i = inst.toLowerCase()
    return d === i || d.endsWith(`.${i}`)
  })
}

export interface BuildEmailRulesInput {
  kind: EmailKind
  ip: string
  userId?: string | number | null
  recipient: string
  internalRecipient?: string
  institutionalDomains?: string[]
  limits?: EmailLimits
  // Por defecto true en sugerencia y confirmacion: sin usuario identificado no se envía
  requireUser?: boolean
}

const USER_REQUIRED_KINDS: EmailKind[] = ['sugerencia', 'confirmacion']

const toRules = (
  dimension: RateLimitRule['dimension'],
  key: string,
  specs: LimitSpec[],
): RateLimitRule[] => specs.map((s) => ({ dimension, key, limit: s.limit, windowMs: s.windowMs }))

// Lanza si el destinatario no es válido o falta el usuario exigido: validar antes de gastar cuota
export function buildEmailRules(input: BuildEmailRulesInput): RateLimitRule[] {
  const cfg = (input.limits ?? DEFAULT_EMAIL_LIMITS)[input.kind]
  const recipient = canonicalRecipient(input.recipient)
  const domain = recipient ? extractDomain(recipient) : null
  if (!recipient || !domain) throw new Error('invalid_recipient')

  const hasUser = input.userId !== undefined && input.userId !== null && String(input.userId) !== ''
  const requireUser = input.requireUser ?? USER_REQUIRED_KINDS.includes(input.kind)
  if (requireUser && !hasUser) throw new Error('user_required')

  const rules: RateLimitRule[] = []

  // IP inválida o no fiable cae en el cubo estricto compartido
  const ipKey = ipRateLimitKey(input.ip)
  if (hasUser) {
    // Detrás del NAT del campus muchos usuarios comparten IP: la regla estricta es la de `user`
    rules.push(...toRules('ip', `${input.kind}:${ipKey}:auth`, cfg.ipAuthenticated))
  } else if (ipKey === UNKNOWN_IP) {
    rules.push(...toRules('ip', `${input.kind}:${UNKNOWN_IP}`, cfg.unknownIp))
  } else {
    rules.push(...toRules('ip', `${input.kind}:${ipKey}`, cfg.ip))
  }

  if (hasUser) {
    rules.push(...toRules('user', `${input.kind}:${input.userId}`, cfg.user))
  }

  // Destinatario y dominio no llevan el tipo: el cupo se comparte entre todos los correos a esa víctima
  const internalRaw = input.internalRecipient?.trim()
  const internal = internalRaw ? canonicalRecipient(internalRaw) : null
  if (internal && recipient === internal) {
    rules.push(...toRules('global', 'internal-mailbox', cfg.internalGlobal))
  } else {
    rules.push(...toRules('recipient', recipient, cfg.recipient))
    if (isInstitutionalDomain(domain, input.institutionalDomains)) {
      rules.push(...toRules('domain', domain, cfg.institutionalDomain))
      rules.push(...toRules('domain', `institutional:${input.kind}`, cfg.institutionalAggregate))
    } else {
      rules.push(...toRules('domain', domain, cfg.externalDomain))
    }
  }

  return rules
}

// El llamador debe tratarlo como 4xx (payload no válido) o 503, nunca como un 500 silencioso
export class DedupePayloadError extends Error {
  constructor(code: string) {
    super(code)
    this.name = 'DedupePayloadError'
  }
}

// 20: el richText Lexical anidado (listas dentro de listas) gasta ~2 niveles por nodo
const MAX_DEPTH = 20
const MAX_NODES = 5_000
const MAX_CHARS = 200_000

const normalizeText = (s: string) =>
  s.normalize('NFKC').replace(/\p{Cf}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()

// Solo JSON plano: Date/Map/Set/BigInt/circulares lanzan en vez de colapsar a "{}"
function canonicalize(value: unknown): unknown {
  let nodes = 0
  let chars = 0
  const ancestors = new Set<object>()

  const walk = (v: unknown, depth: number): unknown => {
    if (++nodes > MAX_NODES) throw new DedupePayloadError('dedupe_payload_too_large')
    if (typeof v === 'string') {
      chars += v.length
      if (chars > MAX_CHARS) throw new DedupePayloadError('dedupe_payload_too_large')
      return normalizeText(v)
    }
    if (typeof v === 'number') {
      if (!Number.isFinite(v)) throw new DedupePayloadError('dedupe_payload_unsupported_type')
      return v
    }
    if (typeof v === 'boolean' || v === null) return v
    if (typeof v !== 'object') throw new DedupePayloadError('dedupe_payload_unsupported_type')

    if (ancestors.has(v)) throw new DedupePayloadError('dedupe_payload_circular')
    if (depth >= MAX_DEPTH) throw new DedupePayloadError('dedupe_payload_too_deep')
    ancestors.add(v)
    try {
      if (Array.isArray(v)) return v.map((x) => walk(x, depth + 1))
      const proto = Object.getPrototypeOf(v)
      if (proto !== Object.prototype && proto !== null) {
        throw new DedupePayloadError('dedupe_payload_unsupported_type')
      }
      const obj = v as Record<string, unknown>
      return Object.fromEntries(
        Object.keys(obj)
          .filter((k) => obj[k] !== undefined)
          .sort()
          .map((k) => [k, walk(obj[k], depth + 1)]),
      )
    } finally {
      ancestors.delete(v)
    }
  }

  return walk(value, 0)
}

export function dedupeHash(input: {
  kind: EmailKind
  actor: string
  recipient?: string
  payload: unknown
}): string {
  const recipient =
    input.recipient === undefined
      ? null
      : (canonicalRecipient(input.recipient) ?? normalizeText(input.recipient))
  const canonical = JSON.stringify([input.kind, input.actor, recipient, canonicalize(input.payload)])
  return createHash('sha256').update(canonical).digest('hex')
}
