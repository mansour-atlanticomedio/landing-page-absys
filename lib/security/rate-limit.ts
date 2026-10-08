export type RateLimitDimension = 'ip' | 'user' | 'recipient' | 'domain' | 'apiKey' | 'global'

// actor: quien hace la petición (insistir penaliza). shared: cupo de terceros (no se quema al ser rechazado)
export type RateLimitTier = 'actor' | 'shared'

export interface RateLimitCounters {
  current: number
  previous: number
  windowStart: number
}

/*
 * Una fila por clave+ventana fija; el store cuenta la ventana actual y guarda la anterior.
 * Un store compartido (fase 4, Postgres) debe hacer increment atómico (INSERT ... ON CONFLICT
 * DO UPDATE con LEAST(current+1, cap)) y peek como lectura sin escritura.
 */
export interface RateLimitStore {
  // cap: techo del contador actual; evita que un bloqueo se arrastre a la ventana siguiente
  increment(key: string, windowMs: number, now: number, cap?: number): Promise<RateLimitCounters>
  // Lee sin incrementar; para una clave inexistente devuelve ceros
  peek(key: string, windowMs: number, now: number): Promise<RateLimitCounters>
  // Deshace un increment hecho con ese mismo `now` (compensación); nunca baja de 0 y solo toca
  // la ventana en que se incrementó
  decrement(key: string, windowMs: number, now: number): Promise<void>
}

export interface RateLimitRule {
  dimension: RateLimitDimension
  key: string
  limit: number
  windowMs: number
  tier?: RateLimitTier
}

export interface RateLimitViolation {
  dimension: RateLimitDimension
  key: string
  limit: number
  retryAfterSec: number
}

export interface CheckLimitsResult {
  allowed: boolean
  violated: RateLimitViolation[]
}

// Clave que agrupa las reglas con clave vacía: falla cerrado, comparten un único cubo
export const EMPTY_KEY_BUCKET = '__empty__'
// Una clave real igual al cubo vacío no debe compartir contador con él
const LITERAL_EMPTY_KEY = '__empty__:literal'

const BLOCKED_RETRY_FALLBACK_SEC = 60

// Mismo valor que usa el store para marcar una clave sin sitio
const SATURATED = Number.MAX_SAFE_INTEGER

export function defaultTier(dimension: RateLimitDimension): RateLimitTier {
  return dimension === 'ip' || dimension === 'user' || dimension === 'apiKey' ? 'actor' : 'shared'
}

export function slidingWindowCount(
  current: number,
  previous: number,
  elapsedInWindowMs: number,
  windowMs: number,
): number {
  const ratio = Math.min(Math.max(elapsedInWindowMs / windowMs, 0), 1)
  return current + previous * (1 - ratio)
}

// Segundos hasta que el contador ponderado vuelva a estar dentro del límite (estimación)
function computeRetryAfterSec(
  counters: RateLimitCounters,
  limit: number,
  windowMs: number,
  now: number,
): number {
  const elapsed = Math.min(Math.max(now - counters.windowStart, 0), windowMs)
  const remainingInWindow = windowMs - elapsed
  // Clave saturada: el valor no es un conteo real, solo se puede esperar al fin de la ventana
  if (counters.current >= SATURATED) return Math.max(1, Math.ceil(remainingInWindow / 1000))
  let waitMs: number

  if (counters.current <= limit && counters.previous > 0) {
    const neededElapsed = windowMs * (1 - (limit - counters.current) / counters.previous)
    waitMs = Math.min(Math.max(neededElapsed - elapsed, 0), remainingInWindow)
  } else {
    // Hay que esperar al cambio de ventana, donde "current" pasa a pesar como previous
    const nextElapsed = counters.current > limit ? windowMs * (1 - limit / counters.current) : 0
    waitMs = remainingInWindow + Math.max(nextElapsed, 0)
  }
  return Math.max(1, Math.ceil(waitMs / 1000))
}

interface PreparedRule {
  dimension: RateLimitDimension
  key: string
  limit: number
  windowMs: number
  tier: RateLimitTier
  storeKey: string
  blocked: boolean
}

function prepare(rule: RateLimitRule): PreparedRule {
  const trimmed = typeof rule.key === 'string' ? rule.key.trim() : ''
  const key = trimmed === '' ? EMPTY_KEY_BUCKET : rule.key
  const limit = Number.isFinite(rule.limit) ? Math.max(0, Math.floor(rule.limit)) : 0
  const windowValid = Number.isFinite(rule.windowMs) && rule.windowMs > 0
  const storeKeyPart = key === EMPTY_KEY_BUCKET && trimmed !== '' ? LITERAL_EMPTY_KEY : key
  return {
    dimension: rule.dimension,
    key,
    limit,
    windowMs: rule.windowMs,
    tier: rule.tier ?? defaultTier(rule.dimension),
    // La ventana va en la clave para que dos reglas con la misma clave no se pisen
    storeKey: `${rule.dimension}:${storeKeyPart}:${rule.windowMs}`,
    // Límite 0 o ventana inválida = bloqueado siempre (fail-closed), sin gastar escritura
    blocked: limit === 0 || !windowValid,
  }
}

function blockedViolation(p: PreparedRule): RateLimitViolation {
  const windowValid = Number.isFinite(p.windowMs) && p.windowMs > 0
  return {
    dimension: p.dimension,
    key: p.key,
    limit: p.limit,
    retryAfterSec: windowValid ? Math.max(1, Math.ceil(p.windowMs / 1000)) : BLOCKED_RETRY_FALLBACK_SEC,
  }
}

/*
 * Contrato para el llamador (fase 2):
 * - Si el store o dedupeHash lanzan, responder 503 SIN enviar el correo (fail-closed).
 * - SecurityConfigError (secreto débil, opciones inválidas) -> 500 controlado + log; nunca enviar.
 * - DedupePayloadError -> 4xx (payload no válido) o 503, nunca un 500 silencioso.
 *
 * Dos niveles para que una petición rechazada no queme cuota ajena:
 * 1) reglas de actor: se incrementan siempre (insistir penaliza); si alguna se viola, se rechaza
 *    sin tocar los contadores compartidos.
 * 2) reglas compartidas: peek de todas; solo si todas pasan se incrementan todas. Si tras
 *    incrementar el post-check detecta violación (carrera entre peek e increment), se deshacen
 *    los incrementos ya hechos para no quemar cuota ajena bajo concurrencia.
 */
export async function checkLimits(
  store: RateLimitStore,
  rules: RateLimitRule[],
  now: number,
): Promise<CheckLimitsResult> {
  const prepared = rules.map(prepare)
  const violated: RateLimitViolation[] = []

  for (const p of prepared.filter((r) => r.tier === 'actor')) {
    if (p.blocked) {
      violated.push(blockedViolation(p))
      continue
    }
    const counters = await store.increment(p.storeKey, p.windowMs, now, p.limit + 1)
    const weighted = slidingWindowCount(counters.current, counters.previous, now - counters.windowStart, p.windowMs)
    if (weighted > p.limit) {
      violated.push({
        dimension: p.dimension,
        key: p.key,
        limit: p.limit,
        retryAfterSec: computeRetryAfterSec(counters, p.limit, p.windowMs, now),
      })
    }
  }
  if (violated.length > 0) return { allowed: false, violated }

  const shared = prepared.filter((r) => r.tier === 'shared')
  const live: PreparedRule[] = []
  for (const p of shared) {
    if (p.blocked) {
      violated.push(blockedViolation(p))
      continue
    }
    live.push(p)
    const counters = await store.peek(p.storeKey, p.windowMs, now)
    // +1: la petición actual entraría en la cuenta si se acepta
    const weighted = slidingWindowCount(counters.current + 1, counters.previous, now - counters.windowStart, p.windowMs)
    if (weighted > p.limit) {
      violated.push({
        dimension: p.dimension,
        key: p.key,
        limit: p.limit,
        retryAfterSec: computeRetryAfterSec({ ...counters, current: counters.current + 1 }, p.limit, p.windowMs, now),
      })
    }
  }
  if (violated.length > 0) return { allowed: false, violated }

  const incremented: { p: PreparedRule; undo: boolean }[] = []
  for (const p of live) {
    // cap = limit + 1, igual que en actor: un bloqueo no se arrastra a la ventana siguiente
    const counters = await store.increment(p.storeKey, p.windowMs, now, p.limit + 1)
    const weighted = slidingWindowCount(counters.current, counters.previous, now - counters.windowStart, p.windowMs)
    // Solo ocurre si otra petición se coló entre el peek y el increment (o el store saturó la clave)
    const bad = weighted > p.limit
    if (bad) {
      violated.push({
        dimension: p.dimension,
        key: p.key,
        limit: p.limit,
        retryAfterSec: computeRetryAfterSec(counters, p.limit, p.windowMs, now),
      })
    }
    // En el tope (cap) no se sabe si este increment sumó o quedó absorbido: no se deshace
    incremented.push({ p, undo: !bad || (counters.current < p.limit + 1 && counters.current < SATURATED) })
  }

  if (violated.length > 0) {
    for (const { p, undo } of incremented) {
      if (undo) await store.decrement(p.storeKey, p.windowMs, now)
    }
  }

  return { allowed: violated.length === 0, violated }
}

/*
 * Devuelve la cuota gastada por un checkLimits que SÍ permitió la petición (el envío falló después,
 * p. ej. el SMTP cayó). Mismo `rules` y mismo `now`. Best-effort: nunca lanza. Si checkLimits
 * rechazó, no debe llamarse (ya deshizo lo suyo y las reglas de actor no se reembolsan).
 */
export async function refundLimits(store: RateLimitStore, rules: RateLimitRule[], now: number): Promise<void> {
  for (const rule of rules) {
    try {
      const p = prepare(rule)
      if (p.blocked) continue
      await store.decrement(p.storeKey, p.windowMs, now)
    } catch {
      // Un fallo del store al reembolsar no debe tapar el error original del envío
    }
  }
}
