import { describe, expect, it } from 'vitest'
import { isRichTextEmpty, lexicalFromText, lexicalToPlainText, normalizeSubtitle } from '../rich-text'

describe('rich text', () => {
  it('ida y vuelta de texto plano con párrafos', () => {
    const v = lexicalFromText('Hola\nMundo')
    expect(v.root.children).toHaveLength(2)
    expect(lexicalToPlainText(v)).toBe('Hola Mundo')
  })
  it('detecta vacío', () => {
    for (const v of [null, undefined, '', '  ', {}, lexicalFromText(''), lexicalFromText('   ')]) expect(isRichTextEmpty(v)).toBe(true)
    expect(isRichTextEmpty(lexicalFromText('x'))).toBe(false)
    expect(isRichTextEmpty('x')).toBe(false)
  })
  it('normalizeSubtitle cae al texto de respaldo si está vacío', () => {
    expect(normalizeSubtitle(lexicalFromText(''), 'respaldo')).toBe('respaldo')
    expect(normalizeSubtitle(null)).toBeUndefined()
    const v = lexicalFromText('algo')
    expect(normalizeSubtitle(v, 'respaldo')).toBe(v)
  })
})
