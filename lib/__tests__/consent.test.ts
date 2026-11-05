import { describe, expect, it } from 'vitest'
import {
  ACCEPT_ALL,
  CONSENT_COOKIE,
  REJECT_ALL,
  buildConsent,
  consentCookieString,
  parseConsent,
  readConsentFromCookieString,
  serializeConsent,
} from '../consent'

const now = new Date('2026-11-03T10:00:00Z')

describe('consentimiento de cookies', () => {
  it('ida y vuelta de la cookie', () => {
    const r = buildConsent({ preferencias: true, analiticas: false, marketing: false }, now)
    expect(parseConsent(serializeConsent(r))).toEqual(r)
  })
  it('rechazar todas deja todo en false y aceptar todas en true', () => {
    expect(buildConsent(REJECT_ALL, now).categorias).toEqual({ preferencias: false, analiticas: false, marketing: false })
    expect(buildConsent(ACCEPT_ALL, now).categorias).toEqual({ preferencias: true, analiticas: true, marketing: true })
  })
  it('un valor ausente o corrupto se trata como sin decisión', () => {
    for (const raw of [undefined, null, '', 'x', '%7B%7D', encodeURIComponent('{"version":99}')]) {
      expect(parseConsent(raw)).toBeNull()
    }
  })
  it('categorías no booleanas invalidan la cookie', () => {
    const raw = encodeURIComponent(JSON.stringify({ version: 1, fecha: now.toISOString(), categorias: { preferencias: 'si', analiticas: true, marketing: true } }))
    expect(parseConsent(raw)).toBeNull()
  })
  it('lee la cookie entre otras', () => {
    const r = buildConsent(ACCEPT_ALL, now)
    expect(readConsentFromCookieString(`a=1; ${CONSENT_COOKIE}=${serializeConsent(r)}; b=2`)).toEqual(r)
    expect(readConsentFromCookieString('a=1; b=2')).toBeNull()
  })
  it('atributos de la cookie', () => {
    const s = consentCookieString(buildConsent(REJECT_ALL, now), '/biblioteca', true)
    expect(s).toContain('Path=/biblioteca')
    expect(s).toContain('SameSite=Lax')
    expect(s).toContain('Secure')
    expect(consentCookieString(buildConsent(REJECT_ALL, now), '/biblioteca', false)).not.toContain('Secure')
  })
})
