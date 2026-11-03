import { describe, expect, it } from 'vitest'
import { DEFAULT_COOKIE_TEXTS, formatActiveCount, resolveCookieTexts } from '../cookie-texts'

describe('textos de cookies', () => {
  it('sin datos devuelve los textos por defecto', () => {
    expect(resolveCookieTexts(null)).toEqual(DEFAULT_COOKIE_TEXTS)
    expect(resolveCookieTexts({})).toEqual(DEFAULT_COOKIE_TEXTS)
  })
  it('usa el valor editado y cae al defecto si está vacío o no es texto', () => {
    const t = resolveCookieTexts({ banner: { title: 'Cookies', tagline: '   ', text: 5 }, messages: { saved: 'Hecho' } })
    expect(t.banner.title).toBe('Cookies')
    expect(t.banner.tagline).toBe(DEFAULT_COOKIE_TEXTS.banner.tagline)
    expect(t.banner.text).toBe(DEFAULT_COOKIE_TEXTS.banner.text)
    expect(t.messages.saved).toBe('Hecho')
    expect(t.messages.accepted).toBe(DEFAULT_COOKIE_TEXTS.messages.accepted)
  })
  it('sustituye {n} en el contador', () => {
    expect(formatActiveCount('{n} de 3 opcionales activas', 2)).toBe('2 de 3 opcionales activas')
  })
})
