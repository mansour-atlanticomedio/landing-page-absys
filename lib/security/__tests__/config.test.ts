import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { getFormTokenSecrets, getTrustedIpOptions } from '../config'
import { SecurityConfigError } from '../honeypot'

const S1 = 'abcdefghijklmnopqrstuvwxyz012345'
const S2 = 'zyxwvutsrqponmlkjihgfedcba987654'

describe('getFormTokenSecrets', () => {
  it('usa FORM_TOKEN_SECRET si es válido', () => {
    expect(getFormTokenSecrets({ FORM_TOKEN_SECRET: S1, PAYLOAD_SECRET: S2 })).toEqual([S1])
  })
  it('un FORM_TOKEN_SECRET corto lanza en vez de ignorarse', () => {
    expect(() => getFormTokenSecrets({ FORM_TOKEN_SECRET: 'corto', PAYLOAD_SECRET: S2 })).toThrow(SecurityConfigError)
    expect(() => getFormTokenSecrets({ FORM_TOKEN_SECRET: 'corto' })).toThrow(SecurityConfigError)
  })
  it('deriva de PAYLOAD_SECRET con HMAC si FORM_TOKEN_SECRET falta o está vacío', () => {
    const derived = createHmac('sha256', S2).update('form-token-v1').digest('hex')
    expect(getFormTokenSecrets({ PAYLOAD_SECRET: S2 })).toEqual([derived])
    expect(getFormTokenSecrets({ FORM_TOKEN_SECRET: '', PAYLOAD_SECRET: S2 })).toEqual([derived])
    const corto = createHmac('sha256', 'secreto-dev-corto').update('form-token-v1').digest('hex')
    expect(getFormTokenSecrets({ PAYLOAD_SECRET: 'secreto-dev-corto' })).toEqual([corto])
  })
  it('añade el anterior para rotación', () => {
    expect(getFormTokenSecrets({ FORM_TOKEN_SECRET: S1, FORM_TOKEN_SECRET_PREVIOUS: S2 })).toEqual([S1, S2])
  })
  it('ignora un anterior inválido', () => {
    expect(getFormTokenSecrets({ FORM_TOKEN_SECRET: S1, FORM_TOKEN_SECRET_PREVIOUS: 'x' })).toEqual([S1])
  })
  it('lanza SecurityConfigError sin ninguna fuente válida', () => {
    expect(() => getFormTokenSecrets({})).toThrow(SecurityConfigError)
    expect(() => getFormTokenSecrets({ PAYLOAD_SECRET: '' })).toThrow(SecurityConfigError)
  })
})

describe('getTrustedIpOptions', () => {
  it('sin cabecera no confía en ninguna', () => {
    expect(getTrustedIpOptions({})).toEqual({ trustedHeader: undefined, trustedHopFromRight: 1 })
  })
  it('lee cabecera y hop', () => {
    expect(getTrustedIpOptions({ TRUSTED_IP_HEADER: ' X-Real-IP ', TRUSTED_IP_HOP: '2' })).toEqual({
      trustedHeader: 'X-Real-IP',
      trustedHopFromRight: 2,
    })
  })
  it('hop inválido vuelve a 1', () => {
    for (const hop of ['0', '-1', 'a', '1.5']) {
      expect(getTrustedIpOptions({ TRUSTED_IP_HOP: hop }).trustedHopFromRight).toBe(1)
    }
  })
})
