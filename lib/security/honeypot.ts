import { createHmac, timingSafeEqual } from 'node:crypto'

export const DEFAULT_MIN_AGE_MS = 3000
export const DEFAULT_MAX_AGE_MS = 2 * 60 * 60 * 1000
// Desfase de reloj entre réplicas que se tolera como too_fast; más allá es clock_skew
export const CLOCK_SKEW_TOLERANCE_MS = 5000
export const MIN_SECRET_LENGTH = 32
/*
 * No lleva "email" en el nombre: los navegadores autorrellenan esos campos y un humano
 * quedaría marcado como bot. El frontend (fase 2) lo pinta con autocomplete="off",
 * tabindex="-1" y aria-hidden, fuera de pantalla.
 */
export const HONEYPOT_FIELD = 'website_url'
export const FORM_TOKEN_FIELD = 'form_token'

export type HoneypotFailure =
  | 'honeypot'
  | 'too_fast'
  | 'expired'
  | 'invalid_token'
  | 'missing_token'
  | 'clock_skew'
export type HoneypotResult = { ok: true } | { ok: false; reason: HoneypotFailure }

export interface TokenAgeOptions {
  minAgeMs?: number
  maxAgeMs?: number
}

// Secreto ausente o débil: el handler debe tratarlo como 500 controlado y registrarlo en log
export class SecurityConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SecurityConfigError'
  }
}

export const MIN_SECRET_DISTINCT_CHARS = 8

function assertSecret(secret: unknown): asserts secret is string {
  if (typeof secret !== 'string' || secret.length < MIN_SECRET_LENGTH) {
    throw new SecurityConfigError(`form_token_secret_invalid (min ${MIN_SECRET_LENGTH} chars)`)
  }
  // Rechaza secretos tipo "xxxx..." o solo espacios: longitud sin entropía
  if (secret.trim() === '' || new Set(secret).size < MIN_SECRET_DISTINCT_CHARS) {
    throw new SecurityConfigError('form_token_secret_invalid (low entropy)')
  }
}

function assertPurpose(purpose: unknown): asserts purpose is string {
  if (typeof purpose !== 'string' || purpose === '') {
    throw new SecurityConfigError('form_token_purpose_invalid')
  }
}

function assertAgeOption(name: string, value: unknown) {
  if (value !== undefined && (typeof value !== 'number' || !Number.isFinite(value))) {
    throw new SecurityConfigError(`form_token_option_invalid (${name})`)
  }
}

// El purpose va dentro del HMAC: un token de un formulario no vale en otro
const sign = (secret: string, purpose: string, issuedAt: string) =>
  createHmac('sha256', secret).update(JSON.stringify([purpose, issuedAt])).digest('base64url')

export function signFormToken(secret: string, now: number, purpose: string): string {
  assertSecret(secret)
  assertPurpose(purpose)
  if (typeof now !== 'number' || !Number.isFinite(now)) throw new SecurityConfigError('form_token_now_invalid')
  const issuedAt = String(Math.floor(now))
  return `${issuedAt}.${sign(secret, purpose, issuedAt)}`
}

/*
 * secrets: el actual y, durante una rotación, el anterior.
 * El token no tiene estado, así que el replay durante maxAgeMs (2 h) es inherente: lo que lo
 * compensa es el rate limit. Cada descarte silencioso debe registrarse en log con su `reason`.
 */
export function verifyFormToken(
  secrets: string[],
  token: string | null | undefined,
  now: number,
  purpose: string,
  opts: TokenAgeOptions = {},
): HoneypotResult {
  if (!Array.isArray(secrets) || secrets.length === 0) {
    throw new SecurityConfigError('form_token_secret_invalid (none configured)')
  }
  secrets.forEach(assertSecret)
  assertPurpose(purpose)
  assertAgeOption('minAgeMs', opts.minAgeMs)
  assertAgeOption('maxAgeMs', opts.maxAgeMs)

  const minAgeMs = opts.minAgeMs ?? DEFAULT_MIN_AGE_MS
  const maxAgeMs = opts.maxAgeMs ?? DEFAULT_MAX_AGE_MS

  if (typeof token !== 'string' || token === '') return { ok: false, reason: 'missing_token' }
  // Reloj roto: con NaN todas las comparaciones de edad darían false y el token pasaría
  if (typeof now !== 'number' || !Number.isFinite(now)) return { ok: false, reason: 'invalid_token' }

  const match = /^(\d{1,15})\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return { ok: false, reason: 'invalid_token' }
  const [, issuedAt, mac] = match

  const given = Buffer.from(mac)
  let valid = false
  // Se recorren todos (sin cortocircuito) para no filtrar cuál de los secretos acertó
  for (const secret of secrets) {
    const expected = Buffer.from(sign(secret, purpose, issuedAt))
    if (expected.length === given.length && timingSafeEqual(expected, given)) valid = true
  }
  if (!valid) return { ok: false, reason: 'invalid_token' }

  const age = now - Number(issuedAt)
  if (!Number.isFinite(age)) return { ok: false, reason: 'invalid_token' }
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return { ok: false, reason: 'clock_skew' }
  if (age < minAgeMs) return { ok: false, reason: 'too_fast' }
  if (age > maxAgeMs) return { ok: false, reason: 'expired' }
  return { ok: true }
}

export interface HoneypotOptions extends TokenAgeOptions {
  secrets: string[]
  purpose: string
  now: number
  honeypotField?: string
  tokenField?: string
}

/*
 * Contrato para quien lo use: solo en 'honeypot' y 'too_fast' responder un éxito falso (el bot
 * no debe saber que lo hemos detectado) y no enviar nada. 'invalid_token' se trata como 'expired':
 * un humano puede llegar con un token inválido (secreto rotado, despliegue, formulario cacheado)
 * y un éxito falso le haría perder el mensaje sin enterarse; recibe "recarga la página".
 * 'expired', 'invalid_token', 'missing_token' y 'clock_skew' -> pedir recargar la página.
 * Todo descarte (silencioso o no) se registra en log con su `reason`.
 */
export function checkHoneypot(
  fields: Record<string, unknown>,
  opts: HoneypotOptions,
): HoneypotResult {
  // Config rota = fallo ruidoso aunque el campo trampa venga relleno
  if (!Array.isArray(opts.secrets) || opts.secrets.length === 0) {
    throw new SecurityConfigError('form_token_secret_invalid (none configured)')
  }
  opts.secrets.forEach(assertSecret)
  assertPurpose(opts.purpose)
  assertAgeOption('minAgeMs', opts.minAgeMs)
  assertAgeOption('maxAgeMs', opts.maxAgeMs)

  const trap = fields[opts.honeypotField ?? HONEYPOT_FIELD]
  if (trap !== undefined && trap !== null && String(trap).trim() !== '') {
    return { ok: false, reason: 'honeypot' }
  }
  const token = fields[opts.tokenField ?? FORM_TOKEN_FIELD]
  return verifyFormToken(opts.secrets, typeof token === 'string' ? token : null, opts.now, opts.purpose, opts)
}
