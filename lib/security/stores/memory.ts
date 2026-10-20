import type { RateLimitCounters, RateLimitStore } from '../rate-limit'

/*
 * SOLO para desarrollo o una única réplica: el estado vive en el proceso, se pierde al reiniciar
 * y no se comparte entre réplicas. Producción necesita un store compartido y atómico (fase 4).
 * Nunca expulsa contadores con ventana vigente por presión de memoria (permitiría resetear a una
 * víctima inundando claves nuevas). Si una dimensión se llena, las claves nuevas NO fallan cerrado
 * (un atacante bloquearía a todo el campus llenando "ip"): se reparten por hash en un número fijo
 * de cubos de desbordamiento, con memoria acotada y degradación gradual por colisión. SATURATED
 * queda solo como último recurso cuando el store entero está lleno.
 */

interface Entry {
  windowStart: number
  windowMs: number
  current: number
  previous: number
  overflow?: boolean
}

export interface MemoryStoreOptions {
  maxKeys?: number
  maxKeysPerDimension?: number
  sweepIntervalMs?: number
  // Cubos de desbordamiento por dimensión y ventana
  overflowBuckets?: number
  // Se dispara al cruzar el 80 % de ocupación de una dimensión (una vez por cruce)
  onPressure?: (dimension: string, ratio: number) => void
}

export type MemoryStore = RateLimitStore & {
  size(dimension?: string): number
  occupancy(dimension: string): number
}

const PRESSURE_THRESHOLD = 0.8

// Contador saturado: lo ve como bloqueado cualquier límite razonable
const SATURATED = Number.MAX_SAFE_INTEGER

// La dimensión es el prefijo de la clave ("ip:...")
const dimensionOf = (key: string) => {
  const i = key.indexOf(':')
  return i === -1 ? key : key.slice(0, i)
}

// FNV-1a de 32 bits: reparto uniforme barato, no necesita ser criptográfico
const fnv1a = (s: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function createMemoryStore(opts: MemoryStoreOptions = {}): MemoryStore {
  // Debe cubrir (nº de dimensiones x maxPerDim) más los cubos de desbordamiento
  const maxKeys = opts.maxKeys ?? 50_000
  const maxPerDim = opts.maxKeysPerDimension ?? 5_000
  const overflowBuckets = Math.max(1, opts.overflowBuckets ?? 1024)
  const sweepIntervalMs = opts.sweepIntervalMs ?? 1000
  const entries = new Map<string, Entry>()
  const perDim = new Map<string, number>()
  let lastSweep = -Infinity

  const pressured = new Set<string>()

  const occupancy = (dim: string) => Math.min(1, (perDim.get(dim) ?? 0) / maxPerDim)

  const updatePressure = (dim: string) => {
    const ratio = occupancy(dim)
    if (ratio >= PRESSURE_THRESHOLD) {
      if (!pressured.has(dim)) {
        pressured.add(dim)
        // Un hook roto no debe tumbar el rate limit
        try {
          opts.onPressure?.(dim, ratio)
        } catch {}
      }
    } else {
      pressured.delete(dim)
    }
  }

  const addDim = (dim: string, delta: number) => {
    perDim.set(dim, (perDim.get(dim) ?? 0) + delta)
    updatePressure(dim)
  }

  // Una entrada ya no aporta nada cuando su ventana anterior también ha caducado
  const sweep = (now: number) => {
    for (const [key, e] of entries) {
      if (now >= e.windowStart + 2 * e.windowMs) {
        entries.delete(key)
        if (!e.overflow) addDim(dimensionOf(key), -1)
      }
    }
  }

  // Throttle: con el store lleno un barrido O(n) por petición sería un vector de DoS
  const maybeSweep = (now: number) => {
    if (now < lastSweep) lastSweep = now
    if (now - lastSweep >= sweepIntervalMs) {
      sweep(now)
      lastSweep = now
    }
  }

  const hasRoomFor = (dim: string) => entries.size < maxKeys && (perDim.get(dim) ?? 0) < maxPerDim

  // Clave efectiva: la propia, o su cubo de desbordamiento si la dimensión está llena; null = store lleno
  const resolve = (key: string, windowMs: number): { key: string; overflow: boolean } | null => {
    if (entries.has(key)) return { key, overflow: entries.get(key)!.overflow === true }
    const dim = dimensionOf(key)
    if (hasRoomFor(dim)) return { key, overflow: false }
    const ovf = `${dim}:\u0000ovf:${fnv1a(key) % overflowBuckets}:${windowMs}`
    if (entries.has(ovf) || entries.size < maxKeys) return { key: ovf, overflow: true }
    return null
  }

  const view = (existing: Entry | undefined, windowStart: number, windowMs: number): RateLimitCounters => {
    // Reloj hacia atrás: una ventana más nueva que la actual sigue siendo la vigente
    if (existing && existing.windowStart >= windowStart) {
      return { current: existing.current, previous: existing.previous, windowStart: existing.windowStart }
    }
    if (existing && existing.windowStart === windowStart - windowMs) {
      return { current: 0, previous: existing.current, windowStart }
    }
    return { current: 0, previous: 0, windowStart }
  }

  return {
    size: (dimension) => (dimension === undefined ? entries.size : (perDim.get(dimension) ?? 0)),
    occupancy,

    async peek(key, windowMs, now): Promise<RateLimitCounters> {
      const windowStart = Math.floor(now / windowMs) * windowMs
      const target = resolve(key, windowMs)
      if (!target) return { current: SATURATED, previous: 0, windowStart }
      return view(entries.get(target.key), windowStart, windowMs)
    },

    async increment(key, windowMs, now, cap): Promise<RateLimitCounters> {
      maybeSweep(now)

      const windowStart = Math.floor(now / windowMs) * windowMs
      const target = resolve(key, windowMs)
      if (!target) return { current: SATURATED, previous: 0, windowStart }

      const existing = entries.get(target.key)
      const limitCap = cap ?? Infinity
      let entry: Entry
      if (existing && existing.windowStart >= windowStart) {
        entry = { ...existing, current: Math.min(existing.current + 1, limitCap) }
      } else if (existing && existing.windowStart === windowStart - windowMs) {
        entry = { windowStart, windowMs, current: Math.min(1, limitCap), previous: existing.current }
      } else {
        entry = { windowStart, windowMs, current: Math.min(1, limitCap), previous: 0 }
      }
      if (target.overflow) entry.overflow = true

      entries.set(target.key, entry)
      if (!existing && !target.overflow) addDim(dimensionOf(key), 1)

      return { current: entry.current, previous: entry.previous, windowStart: entry.windowStart }
    },

    async decrement(key, windowMs, now): Promise<void> {
      const windowStart = Math.floor(now / windowMs) * windowMs
      const target = resolve(key, windowMs)
      const existing = target ? entries.get(target.key) : undefined
      if (!target || !existing) return
      // Solo se deshace en la ventana en que se incrementó: si ya rotó, ese conteo es "previous"
      if (existing.windowStart === windowStart) {
        entries.set(target.key, { ...existing, current: Math.max(0, existing.current - 1) })
      } else if (existing.windowStart === windowStart + windowMs) {
        entries.set(target.key, { ...existing, previous: Math.max(0, existing.previous - 1) })
      }
    },
  }
}

const SINGLETON_KEY = Symbol.for('biblioteca.security.memoryStore')

// Next puede cargar el módulo varias veces (rutas, HMR): el singleton vive en globalThis
export function getMemoryStore(): MemoryStore {
  const g = globalThis as unknown as Record<symbol, MemoryStore | undefined>
  return (g[SINGLETON_KEY] ??= createMemoryStore())
}
