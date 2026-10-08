import { describe, expect, it } from 'vitest'
import { checkLimits, defaultTier, slidingWindowCount, type RateLimitRule, type RateLimitStore } from '../rate-limit'
import { createMemoryStore } from '../stores/memory'

const W = 60_000
const fakeStore = (current: number, calls: string[]): RateLimitStore => ({
  async increment(key, _w, now) {
    calls.push(`inc:${key}`)
    return { current, previous: 0, windowStart: now }
  },
  async peek(key, _w, now) {
    calls.push(`peek:${key}`)
    return { current, previous: 0, windowStart: now }
  },
  async decrement(key) {
    calls.push(`dec:${key}`)
  },
})

const rule = (over: Partial<RateLimitRule> = {}): RateLimitRule => ({
  dimension: 'ip',
  key: '1.1.1.1',
  limit: 3,
  windowMs: W,
  ...over,
})

describe('slidingWindowCount', () => {
  it('pondera la ventana anterior por lo que queda de ella', () => {
    expect(slidingWindowCount(2, 10, 0, W)).toBe(12)
    expect(slidingWindowCount(2, 10, W / 2, W)).toBe(7)
    expect(slidingWindowCount(2, 10, W, W)).toBe(2)
  })
})

describe('checkLimits', () => {
  it('permite hasta el límite y rechaza el siguiente', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 3; i++) expect((await checkLimits(store, [rule()], t)).allowed).toBe(true)
    const res = await checkLimits(store, [rule()], t)
    expect(res.allowed).toBe(false)
    expect(res.violated[0]).toMatchObject({ dimension: 'ip', key: '1.1.1.1', limit: 3 })
  })

  it('el borde exacto de la ventana nueva arranca con la anterior a peso completo', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 3; i++) await checkLimits(store, [rule()], t + W - 1)
    // En t+W la ventana anterior pesa casi 1: 1 + 3*(1) > 3
    const res = await checkLimits(store, [rule()], t + W)
    expect(res.allowed).toBe(false)
  })

  it('la ventana anterior deja de pesar a mitad de la siguiente', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 3; i++) await checkLimits(store, [rule()], t)
    // current 1 + previous 3 * 0.5 = 2.5 <= 3
    expect((await checkLimits(store, [rule()], t + W + W / 2)).allowed).toBe(true)
  })

  it('caduca tras dos ventanas sin actividad', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 5; i++) await checkLimits(store, [rule()], t)
    expect((await checkLimits(store, [rule()], t + 2 * W)).allowed).toBe(true)
  })

  it('reglas de actor: todas se incrementan aunque una falle (insistir penaliza)', async () => {
    const calls: string[] = []
    const store = fakeStore(100, calls)
    const rules = [rule({ key: 'a' }), rule({ dimension: 'user', key: 'b' }), rule({ dimension: 'apiKey', key: 'c' })]
    const res = await checkLimits(store, rules, 1000)
    expect(calls.filter((c) => c.startsWith('inc:'))).toHaveLength(3)
    expect(res.violated).toHaveLength(3)
  })

  it('actor violado: no se toca ningún contador compartido (ni peek ni increment)', async () => {
    const calls: string[] = []
    const store = fakeStore(100, calls)
    const rules = [
      rule({ key: 'a' }),
      rule({ dimension: 'recipient', key: 'x@y.es' }),
      rule({ dimension: 'domain', key: 'y.es' }),
      rule({ dimension: 'global', key: 'g' }),
    ]
    const res = await checkLimits(store, rules, 1000)
    expect(res.allowed).toBe(false)
    expect(calls.some((c) => c.includes('recipient') || c.includes('domain') || c.includes('global'))).toBe(false)
  })

  it('compartida violada: nadie de las compartidas se incrementa, y los actores sí contaron', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    const shared = [
      rule({ dimension: 'recipient', key: 'v@y.es', limit: 1 }),
      rule({ dimension: 'domain', key: 'y.es', limit: 10 }),
    ]
    expect((await checkLimits(store, shared, t)).allowed).toBe(true)
    const res = await checkLimits(store, [rule({ limit: 5 }), ...shared], t)
    expect(res.violated.map((v) => v.dimension)).toEqual(['recipient'])
    // el dominio solo cuenta 1 (la petición aceptada), no 2
    expect((await store.peek(`domain:y.es:${W}`, W, t)).current).toBe(1)
    expect((await store.peek(`ip:1.1.1.1:${W}`, W, t)).current).toBe(1)
  })

  it('el nivel por defecto depende de la dimensión y tier lo sobreescribe', async () => {
    expect(['ip', 'user', 'apiKey'].map((d) => defaultTier(d as any))).toEqual(['actor', 'actor', 'actor'])
    expect(['recipient', 'domain', 'global'].map((d) => defaultTier(d as any))).toEqual(['shared', 'shared', 'shared'])
    const calls: string[] = []
    const store = fakeStore(100, calls)
    await checkLimits(store, [rule({ dimension: 'ip', tier: 'shared' })], 1000)
    expect(calls[0].startsWith('peek:')).toBe(true)
    const calls2: string[] = []
    await checkLimits(fakeStore(0, calls2), [rule({ dimension: 'domain', tier: 'actor' })], 1000)
    expect(calls2[0].startsWith('inc:')).toBe(true)
  })

  it('ATAQUE: una IP intenta 1000 envíos a alu.atlanticomedio.es y el cupo de dominio ajeno queda intacto', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    const rulesFor = (ip: string, rcpt: string) => [
      rule({ dimension: 'ip', key: ip, limit: 3 }),
      rule({ dimension: 'recipient', key: rcpt, limit: 5 }),
      rule({ dimension: 'domain', key: 'alu.atlanticomedio.es', limit: 500 }),
    ]
    let accepted = 0
    for (let i = 0; i < 1000; i++) {
      if ((await checkLimits(store, rulesFor('6.6.6.6', `v${i}@alu.atlanticomedio.es`), t)).allowed) accepted++
    }
    expect(accepted).toBe(3)
    expect((await store.peek(`domain:alu.atlanticomedio.es:${W}`, W, t)).current).toBe(3)
    // otro usuario legítimo sigue teniendo casi todo el cupo
    expect((await checkLimits(store, rulesFor('2.2.2.2', 'otro@alu.atlanticomedio.es'), t)).allowed).toBe(true)
  })

  it('ATAQUE: quemar el recipient de una víctima desde una IP ya limitada no sirve', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    const rulesFor = (ip: string) => [
      rule({ dimension: 'ip', key: ip, limit: 2 }),
      rule({ dimension: 'recipient', key: 'victima@gmail.com', limit: 3 }),
    ]
    for (let i = 0; i < 500; i++) await checkLimits(store, rulesFor('6.6.6.6'), t)
    expect((await store.peek(`recipient:victima@gmail.com:${W}`, W, t)).current).toBe(2)
    expect((await checkLimits(store, rulesFor('2.2.2.2'), t)).allowed).toBe(true)
  })

  it('el contador de actor se topa a limit+1: el bloqueo no se arrastra dos ventanas', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 1000; i++) await checkLimits(store, [rule({ limit: 3 })], t)
    expect((await store.peek(`ip:1.1.1.1:${W}`, W, t)).current).toBe(4)
    // dos ventanas después la huella ha desaparecido
    expect((await checkLimits(store, [rule({ limit: 3 })], t + 2 * W)).allowed).toBe(true)
    // y a mitad de la siguiente: 1 + 4*0.5 = 3 <= 3
    const s2 = createMemoryStore()
    for (let i = 0; i < 1000; i++) await checkLimits(s2, [rule({ limit: 3 })], t)
    expect((await checkLimits(s2, [rule({ limit: 3 })], t + W + W / 2)).allowed).toBe(true)
  })

  it('insistir tras un rechazo alarga la penalización', async () => {
    const store = createMemoryStore()
    const t = 10 * W
    for (let i = 0; i < 4; i++) await checkLimits(store, [rule()], t)
    const first = (await checkLimits(store, [rule()], t)).violated[0].retryAfterSec
    for (let i = 0; i < 20; i++) await checkLimits(store, [rule()], t)
    const later = (await checkLimits(store, [rule()], t)).violated[0].retryAfterSec
    expect(later).toBeGreaterThanOrEqual(first)
  })

  it('retryAfter: límite superado en ventana nueva sin previa espera al fin de ventana', async () => {
    const store = createMemoryStore()
    const t = 10 * W + 10_000
    for (let i = 0; i < 4; i++) await checkLimits(store, [rule({ limit: 3 })], t)
    const res = await checkLimits(store, [rule({ limit: 3 })], t)
    // quedan 50 s de ventana, más lo que tarde el exceso en decaer en la siguiente
    expect(res.violated[0].retryAfterSec).toBeGreaterThanOrEqual(50)
    expect(res.violated[0].retryAfterSec).toBeLessThanOrEqual(120)
  })

  it('retryAfter: si solo pesa la ventana anterior, espera a que decaiga', async () => {
    const store: RateLimitStore = {
      async increment() {
        return { current: 1, previous: 10, windowStart: 0 }
      },
      async peek() {
        return { current: 1, previous: 10, windowStart: 0 }
      },
      async decrement() {},
    }
    // elapsed 0, limit 5: hace falta previous*(1-e/W) <= 4 -> e = 0.6W = 36 s
    const res = await checkLimits(store, [rule({ limit: 5 })], 0)
    expect(res.violated[0].retryAfterSec).toBe(36)
  })

  it('límite 0 bloquea siempre y no toca el store', async () => {
    let touched = false
    const store: RateLimitStore = {
      async increment(_k, _w, now) {
        touched = true
        return { current: 1, previous: 0, windowStart: now }
      },
      async peek(_k, _w, now) {
        touched = true
        return { current: 0, previous: 0, windowStart: now }
      },
      async decrement() {
        touched = true
      },
    }
    const res = await checkLimits(store, [rule({ limit: 0 })], 0)
    expect(res.allowed).toBe(false)
    expect(res.violated[0].retryAfterSec).toBe(60)
    expect(touched).toBe(false)
  })

  it('límite negativo o NaN se trata como 0', async () => {
    const store = createMemoryStore()
    expect((await checkLimits(store, [rule({ limit: -1 })], 0)).allowed).toBe(false)
    expect((await checkLimits(store, [rule({ limit: NaN })], 0)).allowed).toBe(false)
  })

  it('clave vacía no se salta el límite: comparte un cubo común', async () => {
    const store = createMemoryStore()
    const r = rule({ key: '  ', limit: 1 })
    expect((await checkLimits(store, [r], 0)).allowed).toBe(true)
    const res = await checkLimits(store, [rule({ key: '', limit: 1 })], 0)
    expect(res.allowed).toBe(false)
    expect(res.violated[0].key).toBe('__empty__')
  })

  it('misma clave con distinta ventana no comparte contador', async () => {
    const store = createMemoryStore()
    await checkLimits(store, [rule({ limit: 1, windowMs: W })], 0)
    const res = await checkLimits(store, [rule({ limit: 1, windowMs: 2 * W })], 0)
    expect(res.allowed).toBe(true)
  })

  it('sin reglas permite', async () => {
    expect(await checkLimits(createMemoryStore(), [], 0)).toEqual({ allowed: true, violated: [] })
  })

  it('windowMs 0, NaN, negativo o Infinity bloquea (fail-closed) sin tocar el store', async () => {
    for (const windowMs of [0, NaN, -5, Infinity]) {
      for (const dimension of ['ip', 'domain'] as const) {
        const calls: string[] = []
        const res = await checkLimits(fakeStore(0, calls), [rule({ dimension, windowMs })], 0)
        expect(res.allowed).toBe(false)
        expect(Number.isFinite(res.violated[0].retryAfterSec)).toBe(true)
        expect(calls).toEqual([])
      }
    }
  })

  it('una clave real "__empty__" no comparte contador con el cubo de claves vacías', async () => {
    const store = createMemoryStore()
    expect((await checkLimits(store, [rule({ key: '', limit: 1 })], 0)).allowed).toBe(true)
    expect((await checkLimits(store, [rule({ key: '__empty__', limit: 1 })], 0)).allowed).toBe(true)
    expect((await checkLimits(store, [rule({ key: '__empty__', limit: 1 })], 0)).allowed).toBe(false)
    expect((await checkLimits(store, [rule({ key: ' ', limit: 1 })], 0)).allowed).toBe(false)
  })
})

describe('checkLimits: saturación, cap y compensación', () => {
  it('retryAfter con clave saturada: fin de la ventana actual, no ~2 ventanas', async () => {
    const SAT = Number.MAX_SAFE_INTEGER
    const store: RateLimitStore = {
      async increment(_k, _w, now) {
        return { current: SAT, previous: 0, windowStart: Math.floor(now / W) * W }
      },
      async peek(_k, _w, now) {
        return { current: SAT, previous: 0, windowStart: Math.floor(now / W) * W }
      },
      async decrement() {},
    }
    const now = 10 * W + 15_000
    for (const dimension of ['ip', 'recipient'] as const) {
      const res = await checkLimits(store, [rule({ dimension })], now)
      expect(res.violated[0].retryAfterSec).toBe(45)
    }
  })

  it('el increment de reglas compartidas lleva cap = limit + 1', async () => {
    const caps: (number | undefined)[] = []
    const store: RateLimitStore = {
      async increment(_k, _w, now, cap) {
        caps.push(cap)
        return { current: 1, previous: 0, windowStart: now }
      },
      async peek(_k, _w, now) {
        return { current: 0, previous: 0, windowStart: now }
      },
      async decrement() {},
    }
    await checkLimits(store, [rule({ dimension: 'recipient', limit: 3 })], 0)
    expect(caps).toEqual([4])
  })

  it('concurrencia: 20 checkLimits con recipient 3 y domain 100 dejan domain en 3, no en 20', async () => {
    const store = createMemoryStore()
    const rules: RateLimitRule[] = [
      { dimension: 'recipient', key: 'v@gmail.com', limit: 3, windowMs: W },
      { dimension: 'domain', key: 'gmail.com', limit: 100, windowMs: W },
    ]
    const t = 10 * W
    const res = await Promise.all(Array.from({ length: 20 }, () => checkLimits(store, rules, t)))
    expect(res.filter((r) => r.allowed)).toHaveLength(3)
    expect((await store.peek(`domain:gmail.com:${W}`, W, t)).current).toBe(3)
  })

  it('la compensación no baja el contador por debajo de lo admitido en la regla que sí cuenta', async () => {
    const store = createMemoryStore()
    const rules: RateLimitRule[] = [
      { dimension: 'recipient', key: 'v@gmail.com', limit: 3, windowMs: W },
      { dimension: 'domain', key: 'gmail.com', limit: 100, windowMs: W },
    ]
    const t = 10 * W
    await Promise.all(Array.from({ length: 20 }, () => checkLimits(store, rules, t)))
    expect((await store.peek(`recipient:v@gmail.com:${W}`, W, t)).current).toBeGreaterThanOrEqual(3)
    expect((await checkLimits(store, rules, t)).allowed).toBe(false)
  })
})
