import { describe, expect, it } from 'vitest'
import { cloneFields } from '../clone-fields'

describe('cloneFields', () => {
  it('copia en profundidad sin compartir objetos', () => {
    const original = [{ name: 'a', admin: { components: { RowLabel: { path: 'x' } } }, fields: [{ name: 'b' }] }]
    const copy = cloneFields(original)
    expect(copy).toEqual(original)
    expect(copy[0]).not.toBe(original[0])
    expect(copy[0].fields[0]).not.toBe(original[0].fields[0])
  })
  it('conserva las funciones y los valores primitivos', () => {
    const validate = () => true
    const copy = cloneFields({ validate, n: 1, s: 'x', b: false, u: undefined })
    expect(copy.validate).toBe(validate)
    expect(copy.n).toBe(1)
  })
})
