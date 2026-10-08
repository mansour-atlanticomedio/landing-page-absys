import { describe, expect, it } from 'vitest'
import {
  HONEYPOT_FIELD,
  SecurityConfigError,
  checkHoneypot,
  signFormToken,
  verifyFormToken,
} from '../honeypot'

const S = 'secreto-de-prueba-de-al-menos-32-caracteres'
const OLD = 'secreto-anterior-de-al-menos-32-caracteres!'
const P = 'contacto'
const T0 = 1_700_000_000_000

describe('verifyFormToken', () => {
  it('acepta un token dentro de la ventana de edad', () => {
    const t = signFormToken(S, T0, P)
    expect(verifyFormToken([S], t, T0 + 5000, P)).toEqual({ ok: true })
  })
  it('límites exactos: 3 s mínimo y 2 h máximo, ambos incluidos', () => {
    const t = signFormToken(S, T0, P)
    expect(verifyFormToken([S], t, T0 + 2999, P)).toEqual({ ok: false, reason: 'too_fast' })
    expect(verifyFormToken([S], t, T0 + 3000, P)).toEqual({ ok: true })
    expect(verifyFormToken([S], t, T0 + 2 * 3600_000, P)).toEqual({ ok: true })
    expect(verifyFormToken([S], t, T0 + 2 * 3600_000 + 1, P)).toEqual({ ok: false, reason: 'expired' })
  })
  it('desfase de reloj: hasta 5 s es too_fast, más es clock_skew (no silenciosa)', () => {
    expect(verifyFormToken([S], signFormToken(S, T0 + 5000, P), T0, P)).toEqual({ ok: false, reason: 'too_fast' })
    expect(verifyFormToken([S], signFormToken(S, T0 + 5001, P), T0, P)).toEqual({ ok: false, reason: 'clock_skew' })
    expect(verifyFormToken([S], signFormToken(S, T0 + 60_000, P), T0, P)).toEqual({ ok: false, reason: 'clock_skew' })
  })
  it('manipular la fecha invalida la firma', () => {
    const [, mac] = signFormToken(S, T0, P).split('.')
    expect(verifyFormToken([S], `${T0 - 100000}.${mac}`, T0 + 5000, P)).toEqual({ ok: false, reason: 'invalid_token' })
  })
  it('firma con otro secreto -> invalid_token', () => {
    expect(verifyFormToken([S], signFormToken(OLD, T0, P), T0 + 5000, P)).toEqual({ ok: false, reason: 'invalid_token' })
  })
  it('el purpose va en el HMAC: un token de un formulario no vale en otro', () => {
    const t = signFormToken(S, T0, 'contacto')
    expect(verifyFormToken([S], t, T0 + 5000, 'sugerencia')).toEqual({ ok: false, reason: 'invalid_token' })
  })
  it('rotación: acepta tokens firmados con el secreto actual o el anterior', () => {
    const viejo = signFormToken(OLD, T0, P)
    const nuevo = signFormToken(S, T0, P)
    expect(verifyFormToken([S, OLD], viejo, T0 + 5000, P)).toEqual({ ok: true })
    expect(verifyFormToken([S, OLD], nuevo, T0 + 5000, P)).toEqual({ ok: true })
    expect(verifyFormToken([S], viejo, T0 + 5000, P)).toEqual({ ok: false, reason: 'invalid_token' })
  })
  it('formato inválido -> invalid_token', () => {
    for (const t of ['basura', '123.abc', 'a.b.c', `${T0}.`, '.x']) {
      expect(verifyFormToken([S], t, T0 + 5000, P)).toEqual({ ok: false, reason: 'invalid_token' })
    }
  })
  it('ausente -> missing_token', () => {
    expect(verifyFormToken([S], undefined, T0, P)).toEqual({ ok: false, reason: 'missing_token' })
    expect(verifyFormToken([S], '', T0, P)).toEqual({ ok: false, reason: 'missing_token' })
  })
  it('opciones de edad configurables', () => {
    const t = signFormToken(S, T0, P)
    expect(verifyFormToken([S], t, T0 + 500, P, { minAgeMs: 100 })).toEqual({ ok: true })
    expect(verifyFormToken([S], t, T0 + 5000, P, { maxAgeMs: 1000 })).toEqual({ ok: false, reason: 'expired' })
  })
  it('replay: el mismo token vale repetidamente durante 2 h (inherente, sin estado); lo frena el rate limit', () => {
    const t = signFormToken(S, T0, P)
    for (let i = 0; i < 5; i++) {
      expect(verifyFormToken([S], t, T0 + 10_000 + i * 60_000, P)).toEqual({ ok: true })
    }
  })
})

describe('secreto inválido (fail-closed)', () => {
  it('firmar con secreto vacío, undefined o corto lanza SecurityConfigError', () => {
    for (const bad of ['', undefined, 'corto', 'x'.repeat(31)]) {
      expect(() => signFormToken(bad as any, T0, P)).toThrow(SecurityConfigError)
    }
    expect(() => signFormToken('abcdefgh'.repeat(4), T0, P)).not.toThrow()
  })
  it('rechaza secretos de baja entropía aunque midan 32 o más', () => {
    for (const bad of ['x'.repeat(32), ' '.repeat(40), 'abababab'.repeat(5), 'abcdefg'.repeat(6)]) {
      expect(() => signFormToken(bad, T0, P)).toThrow(SecurityConfigError)
      expect(() => verifyFormToken([bad], 'x', T0, P)).toThrow(SecurityConfigError)
    }
  })
  it('verificar con secretos inválidos o vacíos lanza SecurityConfigError', () => {
    const t = signFormToken(S, T0, P)
    for (const bad of [[''], [undefined as any], ['corto'], [S, 'corto'], [], undefined as any]) {
      expect(() => verifyFormToken(bad, t, T0 + 5000, P)).toThrow(SecurityConfigError)
    }
  })
})

describe('validación numérica y purpose (fail-closed)', () => {
  const t = signFormToken(S, T0, P)
  it('now no finito -> invalid_token', () => {
    for (const now of [NaN, Infinity, -Infinity, undefined as any]) {
      expect(verifyFormToken([S], t, now, P)).toEqual({ ok: false, reason: 'invalid_token' })
    }
  })
  it('opciones de edad no finitas lanzan SecurityConfigError', () => {
    for (const o of [{ minAgeMs: NaN }, { maxAgeMs: Infinity }, { maxAgeMs: '5' as any }]) {
      expect(() => verifyFormToken([S], t, T0 + 5000, P, o)).toThrow(SecurityConfigError)
    }
  })
  it('signFormToken con now no finito lanza', () => {
    for (const now of [NaN, Infinity, undefined as any]) {
      expect(() => signFormToken(S, now, P)).toThrow(SecurityConfigError)
    }
  })
  it('purpose vacío o indefinido lanza al firmar, verificar y en checkHoneypot', () => {
    for (const bad of ['', undefined as any]) {
      expect(() => signFormToken(S, T0, bad)).toThrow(SecurityConfigError)
      expect(() => verifyFormToken([S], t, T0 + 5000, bad)).toThrow(SecurityConfigError)
      expect(() => checkHoneypot({ website_url: 'x' }, { secrets: [S], purpose: bad, now: T0 })).toThrow(
        SecurityConfigError,
      )
    }
  })
  it('checkHoneypot con now NaN no deja pasar el token', () => {
    expect(checkHoneypot({ form_token: t }, { secrets: [S], purpose: P, now: NaN })).toEqual({
      ok: false,
      reason: 'invalid_token',
    })
  })
})

/*
 * Contrato para el consumidor: solo honeypot y too_fast -> éxito falso sin enviar nada (con log
 * de la razón); invalid_token se trata como expired: un humano con el formulario cacheado o tras
 * rotar el secreto debe recibir "recarga la página", no un éxito falso. expired, invalid_token,
 * missing_token y clock_skew -> error legible pidiendo recargar.
 */
describe('checkHoneypot', () => {
  const base = { secrets: [S], purpose: P, now: T0 + 5000 }
  const token = signFormToken(S, T0, P)

  it('el campo trampa por defecto no lleva "email" (los navegadores lo autorrellenan)', () => {
    expect(HONEYPOT_FIELD).toBe('website_url')
  })
  it('formulario legítimo pasa (campo trampa vacío)', () => {
    expect(checkHoneypot({ website_url: '', form_token: token }, base)).toEqual({ ok: true })
  })
  it('campo trampa relleno -> honeypot, antes que cualquier otra comprobación', () => {
    expect(checkHoneypot({ website_url: 'http://spam.es' }, base)).toEqual({ ok: false, reason: 'honeypot' })
  })
  it('campo trampa con solo espacios no cuenta como relleno', () => {
    expect(checkHoneypot({ website_url: '   ', form_token: token }, base)).toEqual({ ok: true })
  })
  it('sin token -> missing_token', () => {
    expect(checkHoneypot({}, base)).toEqual({ ok: false, reason: 'missing_token' })
  })
  it('token no string -> missing_token', () => {
    expect(checkHoneypot({ form_token: 42 }, base)).toEqual({ ok: false, reason: 'missing_token' })
  })
  it('nombres de campo personalizados', () => {
    expect(checkHoneypot({ trampa: 'x' }, { ...base, honeypotField: 'trampa' })).toEqual({
      ok: false,
      reason: 'honeypot',
    })
    expect(checkHoneypot({ t: token }, { ...base, tokenField: 't' })).toEqual({ ok: true })
  })
  it('propaga too_fast, expired y clock_skew', () => {
    expect(checkHoneypot({ form_token: token }, { ...base, now: T0 + 10 })).toEqual({ ok: false, reason: 'too_fast' })
    expect(checkHoneypot({ form_token: token }, { ...base, now: T0 + 3 * 3600_000 })).toEqual({
      ok: false,
      reason: 'expired',
    })
    expect(checkHoneypot({ form_token: token }, { ...base, now: T0 - 60_000 })).toEqual({
      ok: false,
      reason: 'clock_skew',
    })
  })
  it('secreto mal configurado lanza incluso con el campo trampa relleno', () => {
    expect(() => checkHoneypot({ website_url: 'x' }, { ...base, secrets: [''] })).toThrow(SecurityConfigError)
  })
  it('token de otro formulario -> invalid_token', () => {
    expect(checkHoneypot({ form_token: token }, { ...base, purpose: 'sugerencia' })).toEqual({
      ok: false,
      reason: 'invalid_token',
    })
  })
})
