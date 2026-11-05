import { describe, expect, it } from 'vitest'
import { cleanHref } from '../href'

describe('cleanHref', () => {
  it('vacío o # no es un enlace', () => {
    for (const v of [undefined, null, '', '  ', '#']) expect(cleanHref(v)).toBeNull()
  })
  it('quita el basePath duplicado de las rutas internas', () => {
    expect(cleanHref('/biblioteca/conocenos/horarios')).toEqual({ href: '/conocenos/horarios', external: false, newTab: false })
    expect(cleanHref('/biblioteca')).toEqual({ href: '/', external: false, newTab: false })
    expect(cleanHref('/recursos/catalogo')?.href).toBe('/recursos/catalogo')
    expect(cleanHref('/bibliotecas')?.href).toBe('/bibliotecas')
  })
  it('reconoce externos, correo y teléfono', () => {
    expect(cleanHref('https://example.org/x')).toEqual({ href: 'https://example.org/x', external: true, newTab: true })
    expect(cleanHref('mailto:biblioteca@atlanticomedio.es')).toEqual({ href: 'mailto:biblioteca@atlanticomedio.es', external: true, newTab: false })
    expect(cleanHref('tel:+34828019019')?.external).toBe(true)
  })
  it('conserva anclas de la misma página', () => {
    expect(cleanHref('#tarjeta-1')?.href).toBe('#tarjeta-1')
  })
})
