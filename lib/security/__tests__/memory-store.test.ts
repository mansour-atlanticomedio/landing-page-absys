import { afterEach, describe, expect, it } from 'vitest'
import { checkLimits } from '../rate-limit'
import { createMemoryStore, getMemoryStore } from '../stores/memory'

const W = 1000

describe('createMemoryStore', () => {
  it('cuenta en la ventana y rota current a previous', async () => {
    const s = createMemoryStore()
    await s.increment('ip:k', W, 5000)
    expect(await s.increment('ip:k', W, 5500)).toEqual({ current: 2, previous: 0, windowStart: 5000 })
    expect(await s.increment('ip:k', W, 6100)).toEqual({ current: 1, previous: 2, windowStart: 6000 })
  })

  it('si salta más de una ventana, previous vuelve a 0', async () => {
    const s = createMemoryStore()
    await s.increment('ip:k', W, 5000)
    expect((await s.increment('ip:k', W, 7000)).previous).toBe(0)
  })

  it('cap topa el contador actual y no se arrastra a previous más allá del tope', async () => {
    const s = createMemoryStore()
    for (let i = 0; i < 50; i++) await s.increment('ip:k', W, 5000, 4)
    expect((await s.increment('ip:k', W, 5000, 4)).current).toBe(4)
    expect(await s.increment('ip:k', W, 6000, 4)).toMatchObject({ current: 1, previous: 4 })
  })

  it('peek no incrementa y refleja la rotación de ventana', async () => {
    const s = createMemoryStore()
    expect(await s.peek('ip:k', W, 5000)).toEqual({ current: 0, previous: 0, windowStart: 5000 })
    await s.increment('ip:k', W, 5000)
    await s.increment('ip:k', W, 5000)
    expect(await s.peek('ip:k', W, 5100)).toEqual({ current: 2, previous: 0, windowStart: 5000 })
    expect(await s.peek('ip:k', W, 6100)).toEqual({ current: 0, previous: 2, windowStart: 6000 })
    expect(await s.peek('ip:k', W, 9000)).toMatchObject({ current: 0, previous: 0 })
    expect(s.size()).toBe(1)
  })

  it('reloj hacia atrás: la ventana más nueva sigue vigente y no se resetea', async () => {
    const s = createMemoryStore()
    for (let i = 0; i < 3; i++) await s.increment('ip:k', W, 10_000)
    const back = await s.increment('ip:k', W, 5000)
    expect(back).toMatchObject({ current: 4, windowStart: 10_000 })
    expect(await s.peek('ip:k', W, 4000)).toMatchObject({ current: 4 })
  })

  it('inundación de claves: la víctima ya limitada NO se resetea y la dimensión no crece', async () => {
    const s = createMemoryStore({ maxKeysPerDimension: 5, maxKeys: 100 })
    const victim = 'ip:victima:1000'
    for (let i = 0; i < 3; i++) await s.increment(victim, W, 0)
    for (let i = 0; i < 200; i++) await s.increment(`ip:atacante-${i}:1000`, W, 0)
    expect(s.size('ip')).toBe(5)
    expect((await s.increment(victim, W, 0)).current).toBe(4)
  })

  it('dimensión llena: las claves nuevas caen en cubos de desbordamiento, no en SATURATED', async () => {
    const s = createMemoryStore({ maxKeysPerDimension: 2, maxKeys: 100, overflowBuckets: 4 })
    await s.increment('ip:a', W, 0)
    await s.increment('ip:b', W, 0)
    const nueva = await s.increment('ip:c', W, 0)
    expect(nueva.current).toBe(1)
    expect((await s.peek('ip:d', W, 0)).current).toBeLessThan(1_000_000)
    expect(s.size('ip')).toBe(2)
    // otra dimensión sigue funcionando; las existentes también
    expect((await s.increment('user:a', W, 0)).current).toBe(1)
    expect((await s.increment('ip:a', W, 0)).current).toBe(2)
  })

  it('el desbordamiento está acotado: nunca más de overflowBuckets entradas extra', async () => {
    const s = createMemoryStore({ maxKeysPerDimension: 2, maxKeys: 100, overflowBuckets: 4 })
    for (let i = 0; i < 500; i++) await s.increment(`ip:k${i}:1000`, W, 0)
    expect(s.size()).toBeLessThanOrEqual(2 + 4)
  })

  it('saturación de dimensión (DoS): 6000 /64 distintos no bloquean a una IP legítima nueva', async () => {
    const s = createMemoryStore()
    const t = 1_000_000
    const win = 10 * 60_000
    const victim = `contacto:1.2.3.4`
    const victimRule = { dimension: 'ip' as const, key: victim, limit: 3, windowMs: win }
    for (let i = 0; i < 3; i++) await checkLimits(s, [victimRule], t)
    expect((await checkLimits(s, [victimRule], t)).allowed).toBe(false)

    for (let i = 0; i < 6000; i++) {
      await checkLimits(s, [{ dimension: 'ip', key: `contacto:2001:db8:${i.toString(16)}::`, limit: 3, windowMs: win }], t)
    }
    expect(s.size('ip')).toBe(5000)
    expect(s.occupancy('ip')).toBe(1)

    // La víctima sigue limitada
    expect((await checkLimits(s, [victimRule], t)).allowed).toBe(false)
    // IPs legítimas nuevas con límites normales: se admiten (colisiones puntuales aparte)
    let allowed = 0
    for (let i = 0; i < 100; i++) {
      const r = await checkLimits(s, [{ dimension: 'ip', key: `contacto:198.51.100.${i}`, limit: 3, windowMs: win }], t)
      if (r.allowed) allowed++
    }
    expect(allowed).toBeGreaterThanOrEqual(98)
    expect(
      (await checkLimits(s, [{ dimension: 'ip', key: 'contacto:203.0.113.7', limit: 3, windowMs: win }], t)).allowed,
    ).toBe(true)
  })

  it('onPressure se dispara una vez por cruce del 80 % y se rearma al bajar', async () => {
    const calls: [string, number][] = []
    const s = createMemoryStore({
      maxKeysPerDimension: 10,
      maxKeys: 100,
      sweepIntervalMs: 0,
      onPressure: (d, r) => calls.push([d, r]),
    })
    for (let i = 0; i < 7; i++) await s.increment(`ip:k${i}`, 100, 0)
    expect(calls).toHaveLength(0)
    expect(s.occupancy('ip')).toBe(0.7)
    for (let i = 7; i < 10; i++) await s.increment(`ip:k${i}`, 100, 0)
    expect(calls).toEqual([['ip', 0.8]])
    // Caducan todas y vuelve a cruzar
    await s.increment('user:x', 100, 1000)
    expect(s.occupancy('ip')).toBe(0)
    for (let i = 0; i < 8; i++) await s.increment(`ip:n${i}`, 100, 1000)
    expect(calls).toHaveLength(2)
  })

  it('decrement: nunca baja de 0 y respeta la ventana en que se incrementó', async () => {
    const s = createMemoryStore()
    await s.increment('ip:k', W, 5000)
    await s.increment('ip:k', W, 5000)
    await s.decrement('ip:k', W, 5000)
    expect((await s.peek('ip:k', W, 5000)).current).toBe(1)
    await s.decrement('ip:k', W, 5000)
    await s.decrement('ip:k', W, 5000)
    expect((await s.peek('ip:k', W, 5000)).current).toBe(0)
    // incremento en ventana vieja no toca la actual
    await s.increment('ip:k', W, 6000)
    await s.decrement('ip:k', W, 5000)
    expect((await s.peek('ip:k', W, 6000)).current).toBe(1)
    // decrement de clave inexistente no crea nada
    await s.decrement('ip:nada', W, 5000)
    expect(s.size()).toBe(1)
  })

  it('último recurso: con el store entero lleno falla cerrado', async () => {
    const s = createMemoryStore({ maxKeys: 2, maxKeysPerDimension: 10, overflowBuckets: 1 })
    await s.increment('ip:a', W, 0)
    await s.increment('user:a', W, 0)
    expect((await s.increment('domain:a', W, 0)).current).toBeGreaterThan(1_000_000)
  })

  it('el barrido de caducadas está limitado por tiempo (como mucho una vez por intervalo)', async () => {
    const s = createMemoryStore({ sweepIntervalMs: 1000 })
    await s.increment('ip:a', 100, 0)
    await s.increment('ip:b', 100, 0)
    // a y b ya caducaron (0 + 200 <= 500) pero el último barrido fue hace 500 ms
    await s.increment('ip:c', 100, 500)
    expect(s.size()).toBe(3)
    await s.increment('ip:d', 100, 1000)
    // c caduca en 700 <= 1000, d es nueva
    expect(s.size()).toBe(1)
  })
})

describe('concurrencia', () => {
  it('increments concurrentes sobre el mismo store no pierden cuentas', async () => {
    const s = createMemoryStore()
    await Promise.all(Array.from({ length: 100 }, () => s.increment('ip:k', 60_000, 1000)))
    expect((await s.peek('ip:k', 60_000, 1000)).current).toBe(100)
  })

  it('checkLimits concurrentes: se admiten exactamente `limit`', async () => {
    const s = createMemoryStore()
    const rule = { dimension: 'ip' as const, key: 'x', limit: 3, windowMs: 60_000 }
    const res = await Promise.all(Array.from({ length: 10 }, () => checkLimits(s, [rule], 1000)))
    expect(res.filter((r) => r.allowed)).toHaveLength(3)
  })
})

describe('getMemoryStore', () => {
  afterEach(() => {
    delete (globalThis as any)[Symbol.for('biblioteca.security.memoryStore')]
  })
  it('devuelve siempre la misma instancia (vive en globalThis)', () => {
    expect(getMemoryStore()).toBe(getMemoryStore())
  })
  it('sobrevive a una segunda carga del módulo', async () => {
    const a = getMemoryStore()
    const { vi } = await import('vitest')
    vi.resetModules()
    const again = await import('../stores/memory')
    expect(again.getMemoryStore()).toBe(a)
  })
})
