import { describe, expect, it } from 'vitest'
import {
  DEFAULT_EMAIL_LIMITS,
  DedupePayloadError,
  buildEmailRules,
  canonicalRecipient,
  dedupeHash,
  extractDomain,
  isInstitutionalDomain,
} from '../email-policy'
import { checkLimits } from '../rate-limit'
import { createMemoryStore } from '../stores/memory'

describe('extractDomain', () => {
  it('pasa a minúsculas y acepta subdominios', () => {
    expect(extractDomain('Ana@Alu.AtlanticoMedio.ES')).toBe('alu.atlanticomedio.es')
  })
  it('rechaza saltos de línea, espacios y cabeceras inyectadas', () => {
    for (const e of [
      'a@b.es\nBcc: x@y.es',
      'a@b.es\r\nBcc: x@y.es',
      'a @b.es',
      ' a@b.es',
      'a@b.es,c@d.es',
      'a@b.es;c@d.es',
      '"a"@b.es',
      'a\u0000@b.es',
    ]) {
      expect(extractDomain(e)).toBeNull()
    }
  })
  it('rechaza múltiples @, partes vacías y dominios raros', () => {
    for (const e of ['a@@b.es', 'a@b@c.es', '@b.es', 'a@', 'a@localhost', 'a@b..es', 'a@-b.es', 'a@b-.es', 'a@b.e', 'a@b.es.', 'a@1.2.3.4', 'a@ñ.es']) {
      expect(extractDomain(e)).toBeNull()
    }
  })
  it('acepta punycode y rechaza longitudes absurdas', () => {
    expect(extractDomain('a@xn--bcher-kva.es')).toBe('xn--bcher-kva.es')
    expect(extractDomain(`${'a'.repeat(65)}@b.es`)).toBeNull()
    expect(extractDomain(`a@${'b'.repeat(64)}.es`)).toBeNull()
  })
})

describe('isInstitutionalDomain', () => {
  it('dominio exacto y subdominios', () => {
    expect(isInstitutionalDomain('atlanticomedio.es')).toBe(true)
    expect(isInstitutionalDomain('pdi.atlanticomedio.es')).toBe(true)
    expect(isInstitutionalDomain('A.B.AtlanticoMedio.es')).toBe(true)
  })
  it('suplantaciones no lo son', () => {
    expect(isInstitutionalDomain('evil-atlanticomedio.es')).toBe(false)
    expect(isInstitutionalDomain('atlanticomedio.es.evil.com')).toBe(false)
    expect(isInstitutionalDomain('xatlanticomedio.es')).toBe(false)
    expect(isInstitutionalDomain('atlanticomedio.com')).toBe(false)
  })
  it('lista configurable', () => {
    expect(isInstitutionalDomain('uni.edu', ['uni.edu'])).toBe(true)
  })
})

describe('buildEmailRules', () => {
  const find = (rules: ReturnType<typeof buildEmailRules>, dim: string) => rules.filter((r) => r.dimension === dim)

  it('contacto anónimo: ip 3/10min y 10/día + destinatario + dominio externo', () => {
    const rules = buildEmailRules({ kind: 'contacto', ip: '1.2.3.4', recipient: 'Pepe@Gmail.com' })
    expect(find(rules, 'ip').map((r) => [r.limit, r.windowMs])).toEqual([
      [3, 600_000],
      [10, 86_400_000],
    ])
    expect(find(rules, 'recipient')[0].key).toBe('pepe@gmail.com')
    expect(find(rules, 'domain').map((r) => [r.key, r.limit, r.windowMs])).toEqual([['gmail.com', 20, 3_600_000]])
    expect(find(rules, 'user')).toHaveLength(0)
  })
  it('usuario: 5/hora y 20/día', () => {
    const rules = buildEmailRules({ kind: 'sugerencia', ip: '1.2.3.4', userId: 7, recipient: 'a@gmail.com' })
    expect(find(rules, 'user').map((r) => [r.key, r.limit])).toEqual([
      ['sugerencia:7', 5],
      ['sugerencia:7', 20],
    ])
  })
  it('dominio institucional: 500 al día', () => {
    const rules = buildEmailRules({ kind: 'pin', ip: '1.2.3.4', recipient: 'x@alu.atlanticomedio.es' })
    expect(find(rules, 'domain').map((r) => [r.key, r.limit, r.windowMs])).toEqual([
      ['alu.atlanticomedio.es', 500, 86_400_000],
      ['institutional:pin', 1000, 86_400_000],
    ])
  })
  it('evil-atlanticomedio.es usa el límite externo', () => {
    const rules = buildEmailRules({ kind: 'pin', ip: '1.2.3.4', recipient: 'x@evil-atlanticomedio.es' })
    expect(find(rules, 'domain')[0].limit).toBe(20)
  })
  it('buzón interno: tope global 300/día, sin reglas de destinatario ni dominio', () => {
    const rules = buildEmailRules({
      kind: 'contacto',
      ip: '1.2.3.4',
      recipient: 'Biblioteca@AtlanticoMedio.es',
      internalRecipient: 'biblioteca@atlanticomedio.es',
    })
    expect(find(rules, 'global').map((r) => [r.key, r.limit, r.windowMs])).toEqual([
      ['internal-mailbox:contacto', 300, 86_400_000],
    ])
    expect(find(rules, 'recipient')).toHaveLength(0)
    expect(find(rules, 'domain')).toHaveLength(0)
  })
  it('ip unknown usa su límite estricto propio y compartido', () => {
    const rules = buildEmailRules({ kind: 'contacto', ip: 'unknown', recipient: 'a@gmail.com' })
    expect(find(rules, 'ip').map((r) => [r.key, r.limit])).toEqual([
      ['contacto:unknown', 1],
      ['contacto:unknown', 3],
    ])
  })
  it('límites sobrescribibles por parámetro', () => {
    const limits = structuredClone(DEFAULT_EMAIL_LIMITS)
    limits.contacto.ip = [{ limit: 1, windowMs: 1000 }]
    const rules = buildEmailRules({ kind: 'contacto', ip: '1.2.3.4', recipient: 'a@gmail.com', limits })
    expect(find(rules, 'ip')).toHaveLength(1)
  })
  it('destinatario inválido lanza', () => {
    expect(() => buildEmailRules({ kind: 'contacto', ip: '1.2.3.4', recipient: 'a@b.es\nBcc: x@y.es' })).toThrow(
      'invalid_recipient',
    )
  })
  it('integración: la 4ª petición anónima en 10 min se rechaza', async () => {
    const store = createMemoryStore()
    const rules = buildEmailRules({ kind: 'contacto', ip: '9.9.9.9', recipient: 'a@gmail.com' })
    const t = 1_700_000_000_000
    for (let i = 0; i < 3; i++) expect((await checkLimits(store, rules, t)).allowed).toBe(true)
    const res = await checkLimits(store, rules, t)
    expect(res.allowed).toBe(false)
    expect(res.violated[0].dimension).toBe('ip')
  })
})

describe('extractDomain endurecido', () => {
  it('rechaza no ASCII antes de pasar a minúsculas (Kelvin U+212A)', () => {
    expect(extractDomain('a@\u212A.es')).toBeNull()
    expect(extractDomain('a@boo\u212A.es')).toBeNull()
    expect(extractDomain('\u212Aa@b.es')).toBeNull()
  })
  it('rechaza controles, Cf, NEL, %, | y .. en el local-part', () => {
    for (const e of ['a\u200b@b.es', 'a\u0085@b.es', 'a\u202e@b.es', 'a%40@b.es', 'a|b@b.es', 'a..b@b.es', 'a\u007f@b.es']) {
      expect(extractDomain(e)).toBeNull()
    }
  })
})

describe('canonicalRecipient', () => {
  it('quita +tag y pasa a minúsculas', () => {
    expect(canonicalRecipient('Ana+Spam@Dominio.ES')).toBe('ana@dominio.es')
  })
  it('gmail: quita puntos y googlemail pasa a gmail', () => {
    expect(canonicalRecipient('v.ic.tim+x@gmail.com')).toBe('victim@gmail.com')
    expect(canonicalRecipient('v.ictim@googlemail.com')).toBe('victim@gmail.com')
  })
  it('en otros dominios los puntos se respetan', () => {
    expect(canonicalRecipient('a.b@atlanticomedio.es')).toBe('a.b@atlanticomedio.es')
  })
  it('inválidos o con local vacío tras quitar el tag -> null', () => {
    expect(canonicalRecipient('+x@b.es')).toBeNull()
    expect(canonicalRecipient('a@b.es\nBcc: x@y.es')).toBeNull()
    expect(canonicalRecipient('')).toBeNull()
  })
})

describe('buildEmailRules: canonicalización, agregado, ip y usuario', () => {
  const find = (rules: ReturnType<typeof buildEmailRules>, dim: string) => rules.filter((r) => r.dimension === dim)

  it('variantes de gmail cuentan como el mismo destinatario', () => {
    const a = buildEmailRules({ kind: 'pin', ip: '1.2.3.4', recipient: 'v.ic.tim+x@gmail.com' })
    const b = buildEmailRules({ kind: 'pin', ip: '1.2.3.4', recipient: 'victim@googlemail.com' })
    expect(find(a, 'recipient')[0].key).toBe('victim@gmail.com')
    expect(find(b, 'recipient')[0].key).toBe('victim@gmail.com')
    expect(find(b, 'domain')[0].key).toBe('gmail.com')
  })
  it('internal+a@dominio cuenta como el buzón interno', () => {
    const rules = buildEmailRules({
      kind: 'contacto',
      ip: '1.2.3.4',
      recipient: 'internal+a@atlanticomedio.es',
      internalRecipient: 'Internal@atlanticomedio.es',
    })
    expect(find(rules, 'global')).toHaveLength(1)
    expect(find(rules, 'recipient')).toHaveLength(0)
  })
  it('subdominios inventados suman al agregado institucional único', () => {
    const k = (r: string) =>
      find(buildEmailRules({ kind: 'pin', ip: '1.2.3.4', recipient: r }), 'domain').map((x) => x.key)
    expect(k('x@cualquier.atlanticomedio.es')).toEqual(['cualquier.atlanticomedio.es', 'institutional:pin'])
    expect(k('x@otro.atlanticomedio.es')).toEqual(['otro.atlanticomedio.es', 'institutional:pin'])
    expect(k('x@gmail.com')).toEqual(['gmail.com'])
  })
  it('el agregado limita a toda la familia de subdominios aunque cada cubo esté libre', async () => {
    const limits = structuredClone(DEFAULT_EMAIL_LIMITS)
    limits.pin.institutionalAggregate = [{ limit: 2, windowMs: 86_400_000 }]
    const store = createMemoryStore()
    const t = 1_700_000_000_000
    const go = (sub: string, ip: string) =>
      checkLimits(store, buildEmailRules({ kind: 'pin', ip, recipient: `u@${sub}.atlanticomedio.es`, limits }), t)
    expect((await go('a', '1.1.1.1')).allowed).toBe(true)
    expect((await go('b', '1.1.1.2')).allowed).toBe(true)
    expect((await go('c', '1.1.1.3')).allowed).toBe(false)
  })
  it('ip: IPv6 se agrupa por /64 y una ip inválida cae en el cubo unknown', () => {
    const r = (ip: string) => find(buildEmailRules({ kind: 'pin', ip, recipient: 'a@gmail.com' }), 'ip')[0]
    expect(r('2001:db8:1:2:aaaa::1').key).toBe(r('2001:db8:1:2:bbbb::9').key)
    expect(r('2001:db8:1:2::1').key).toBe('pin:2001:0db8:0001:0002::/64')
    expect(r('basura').key).toBe('pin:unknown')
    expect(r('unknown').limit).toBe(1)
  })
  it('requireUser: por defecto true en sugerencia y confirmacion', () => {
    for (const kind of ['sugerencia', 'confirmacion'] as const) {
      expect(() => buildEmailRules({ kind, ip: '1.2.3.4', recipient: 'a@gmail.com' })).toThrow('user_required')
      expect(() => buildEmailRules({ kind, ip: '1.2.3.4', recipient: 'a@gmail.com', userId: '' })).toThrow('user_required')
      expect(() => buildEmailRules({ kind, ip: '1.2.3.4', recipient: 'a@gmail.com', userId: 3 })).not.toThrow()
      expect(() =>
        buildEmailRules({ kind, ip: '1.2.3.4', recipient: 'a@gmail.com', requireUser: false }),
      ).not.toThrow()
    }
    expect(() => buildEmailRules({ kind: 'contacto', ip: '1.2.3.4', recipient: 'a@gmail.com' })).not.toThrow()
    expect(() =>
      buildEmailRules({ kind: 'contacto', ip: '1.2.3.4', recipient: 'a@gmail.com', requireUser: true }),
    ).toThrow('user_required')
  })
})

describe('dedupeHash', () => {
  const base = { kind: 'contacto' as const, actor: '1.2.3.4', payload: { name: 'Ana', message: 'Hola mundo' } }
  it('estable ante orden de claves y espacios', () => {
    const b = { ...base, payload: { message: '  Hola   mundo \n', name: 'Ana' } }
    expect(dedupeHash(b)).toBe(dedupeHash(base))
    expect(dedupeHash(base)).toMatch(/^[0-9a-f]{64}$/)
  })
  it('cambia con contenido, actor o tipo', () => {
    const h = dedupeHash(base)
    expect(dedupeHash({ ...base, payload: { ...base.payload, message: 'Adiós' } })).not.toBe(h)
    expect(dedupeHash({ ...base, actor: '5.6.7.8' })).not.toBe(h)
    expect(dedupeHash({ ...base, kind: 'sugerencia' })).not.toBe(h)
  })
  it('claves anidadas y arrays también se normalizan', () => {
    const a = dedupeHash({ ...base, payload: { x: { b: 1, a: [' q ', 2] } } })
    const b = dedupeHash({ ...base, payload: { x: { a: ['q', 2], b: 1 } } })
    expect(a).toBe(b)
  })
  it('normaliza NFKC, caracteres de ancho cero y mayúsculas', () => {
    const a = dedupeHash({ ...base, payload: { name: 'Ana', message: 'Hola mundo' } })
    const b = dedupeHash({ ...base, payload: { name: 'ANA', message: 'Ho\u200bla\u00a0mundo' } })
    const c = dedupeHash({ ...base, payload: { name: 'Ana', message: '\uff28ola mundo' } })
    expect(b).toBe(a)
    expect(c).toBe(a)
  })
  it('incluye el destinatario canónico cuando se pasa', () => {
    const a = dedupeHash({ ...base, recipient: 'v.ic.tim+x@gmail.com' })
    expect(dedupeHash({ ...base, recipient: 'victim@gmail.com' })).toBe(a)
    expect(dedupeHash({ ...base, recipient: 'otro@gmail.com' })).not.toBe(a)
    expect(dedupeHash(base)).not.toBe(a)
  })
  it('lanza un error claro con tipos no JSON en vez de colapsarlos a {}', () => {
    const circular: any = { a: 1 }
    circular.self = circular
    const bad = [new Date(), new Map(), new Set(), BigInt(10), circular, NaN, () => 1, new (class X {})()]
    for (const payload of bad) {
      expect(() => dedupeHash({ ...base, payload: { x: payload } })).toThrow(DedupePayloadError)
    }
    expect(() => dedupeHash({ ...base, payload: circular })).toThrow('dedupe_payload_circular')
  })
  it('límite de profundidad y de tamaño', () => {
    let deep: any = 'x'
    for (let i = 0; i < 25; i++) deep = { n: deep }
    expect(() => dedupeHash({ ...base, payload: deep })).toThrow('dedupe_payload_too_deep')
    expect(() => dedupeHash({ ...base, payload: 'a'.repeat(300_000) })).toThrow('dedupe_payload_too_large')
    expect(() => dedupeHash({ ...base, payload: new Array(6000).fill(1) })).toThrow('dedupe_payload_too_large')
  })
  it('richText Lexical con lista dentro de lista pasa', () => {
    const text = { type: 'text', text: 'hola', version: 1 }
    const item = (children: unknown[]) => ({ type: 'listitem', children, version: 1 })
    const list = (children: unknown[]) => ({ type: 'list', children, version: 1 })
    const payload = { root: { type: 'root', children: [list([item([text]), item([list([item([list([item([text])])])])])])] } }
    expect(() => dedupeHash({ ...base, payload })).not.toThrow()
  })
  it('acepta JSON plano, objetos sin prototipo e ignora propiedades undefined', () => {
    const np = Object.assign(Object.create(null), { a: 1 })
    expect(dedupeHash({ ...base, payload: { a: 1, b: undefined } })).toBe(dedupeHash({ ...base, payload: np }))
    expect(() => dedupeHash({ ...base, payload: { a: [1, 'x', true, null, { b: 2 }] } })).not.toThrow()
  })
})

describe('buildEmailRules: NAT del campus y agregado por tipo', () => {
  const t = 1_700_000_000_000
  const ip = '10.0.0.1'

  it('30 usuarios autenticados desde la misma IP envían su correo propio y todos se aceptan', async () => {
    const store = createMemoryStore()
    for (let i = 0; i < 30; i++) {
      const rules = buildEmailRules({
        kind: 'confirmacion',
        ip,
        userId: `u${i}`,
        recipient: `u${i}@alu.atlanticomedio.es`,
      })
      expect((await checkLimits(store, rules, t)).allowed).toBe(true)
    }
  })

  it('un anónimo desde esa misma IP sigue con la regla estricta', async () => {
    const store = createMemoryStore()
    for (let i = 0; i < 30; i++) {
      await checkLimits(
        store,
        buildEmailRules({ kind: 'contacto', ip, userId: `u${i}`, recipient: `u${i}@alu.atlanticomedio.es` }),
        t,
      )
    }
    const anon = (i: number) =>
      checkLimits(store, buildEmailRules({ kind: 'contacto', ip, recipient: `a${i}@alu.atlanticomedio.es` }), t)
    for (let i = 0; i < 3; i++) expect((await anon(i)).allowed).toBe(true)
    const res = await anon(3)
    expect(res.allowed).toBe(false)
    expect(res.violated[0].dimension).toBe('ip')
  })

  it('un usuario no supera su cupo user (5/hora) aunque la IP sea holgada', async () => {
    const store = createMemoryStore()
    const go = (i: number) =>
      checkLimits(
        store,
        buildEmailRules({ kind: 'confirmacion', ip, userId: 'solo', recipient: `x${i}@alu.atlanticomedio.es` }),
        t,
      )
    for (let i = 0; i < 5; i++) expect((await go(i)).allowed).toBe(true)
    const res = await go(5)
    expect(res.allowed).toBe(false)
    expect(res.violated.map((v) => v.dimension)).toEqual(['user'])
  })

  it('autenticado usa la regla ipAuthenticated con clave propia', () => {
    const rules = buildEmailRules({ kind: 'pin', ip, userId: 1, recipient: 'a@gmail.com' })
    const ipRules = rules.filter((r) => r.dimension === 'ip')
    expect(ipRules.map((r) => [r.key, r.limit, r.windowMs])).toEqual([
      ['pin:10.0.0.1:auth', 200, 3_600_000],
      ['pin:10.0.0.1:auth', 1000, 86_400_000],
    ])
    expect(ipRules.every((r) => r.tier === 'shared')).toBe(true)
  })

  it('el buzón interno tiene un cupo por tipo: contacto no bloquea sugerencias', async () => {
    const limits = structuredClone(DEFAULT_EMAIL_LIMITS)
    limits.contacto.internalGlobal = [{ limit: 1, windowMs: 86_400_000 }]
    const store = createMemoryStore()
    const go = (kind: 'contacto' | 'sugerencia', userId: string) =>
      checkLimits(
        store,
        buildEmailRules({
          kind,
          ip,
          userId,
          recipient: 'biblioteca@atlanticomedio.es',
          internalRecipient: 'biblioteca@atlanticomedio.es',
          limits,
        }),
        t,
      )
    expect((await go('contacto', 'a')).allowed).toBe(true)
    expect((await go('contacto', 'b')).allowed).toBe(false)
    expect((await go('sugerencia', 'b')).allowed).toBe(true)
  })

  it('una cuenta que supera su cupo de usuario no consume el cupo de IP de los demás', async () => {
    const limits = structuredClone(DEFAULT_EMAIL_LIMITS)
    limits.contacto.ipAuthenticated = [{ limit: 6, windowMs: 3_600_000 }]
    const store = createMemoryStore()
    const go = (userId: string, i: number) =>
      checkLimits(
        store,
        buildEmailRules({ kind: 'contacto', ip, userId, recipient: `x${userId}${i}@alu.atlanticomedio.es`, limits }),
        t,
      )
    let aceptadas = 0
    for (let i = 0; i < 20; i++) if ((await go('abusona', i)).allowed) aceptadas++
    expect(aceptadas).toBe(5)
    const ipCounter = await store.peek(`ip:contacto:${ip}:auth:3600000`, 3_600_000, t)
    expect(ipCounter.current).toBe(5)
    expect((await go('otra', 0)).allowed).toBe(true)
    expect((await go('otra', 1)).allowed).toBe(false)
  })

  it('autenticado con IP desconocida: sin regla de IP, solo manda user', () => {
    const rules = buildEmailRules({ kind: 'contacto', ip: 'unknown', userId: 1, recipient: 'a@gmail.com' })
    expect(rules.filter((r) => r.dimension === 'ip')).toHaveLength(0)
    expect(rules.filter((r) => r.dimension === 'user').length).toBeGreaterThan(0)
  })

  it('el agregado institucional es por tipo: agotar contacto no afecta a pin', async () => {
    const limits = structuredClone(DEFAULT_EMAIL_LIMITS)
    limits.contacto.institutionalAggregate = [{ limit: 1, windowMs: 86_400_000 }]
    const store = createMemoryStore()
    const go = (kind: 'contacto' | 'pin', ipn: string) =>
      checkLimits(store, buildEmailRules({ kind, ip: ipn, recipient: 'u@alu.atlanticomedio.es', limits }), t)
    expect((await go('contacto', '1.1.1.1')).allowed).toBe(true)
    expect((await go('contacto', '1.1.1.2')).allowed).toBe(false)
    expect((await go('pin', '1.1.1.3')).allowed).toBe(true)
  })
})
