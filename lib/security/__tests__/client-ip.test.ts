import { describe, expect, it } from 'vitest'
import { UNKNOWN_IP, getClientIp, ipRateLimitKey, normalizeIp } from '../client-ip'

const h = (o: Record<string, string>) => new Headers(o)

describe('getClientIp', () => {
  it('sin cabecera configurada ignora todo lo que mande el cliente', () => {
    expect(getClientIp(h({ 'x-forwarded-for': '1.2.3.4', 'x-real-ip': '1.2.3.4' }), {})).toBe('unknown')
  })

  it('cabecera configurada ausente -> unknown', () => {
    expect(getClientIp(h({}), { trustedHeader: 'x-real-ip' })).toBe('unknown')
  })

  it('lee IPv4 de x-real-ip y es insensible a mayúsculas del nombre', () => {
    expect(getClientIp(h({ 'x-real-ip': ' 203.0.113.9 ' }), { trustedHeader: 'X-Real-IP' })).toBe('203.0.113.9')
  })

  it('cf-connecting-ip con IPv6 se normaliza', () => {
    expect(
      getClientIp(h({ 'cf-connecting-ip': '2001:0DB8:0000:0000:0000:0000:0000:0001' }), {
        trustedHeader: 'cf-connecting-ip',
      }),
    ).toBe('2001:db8::1')
  })

  it('una cabecera que no es xff y trae comas es basura', () => {
    expect(getClientIp(h({ 'x-real-ip': '1.2.3.4, 5.6.7.8' }), { trustedHeader: 'x-real-ip' })).toBe('unknown')
  })

  it('basura -> unknown', () => {
    for (const v of ['hola', '999.1.1.1', '1.2.3', '1.2.3.4:80', '01.2.3.4', '<script>', 'fe80::1%eth0', '1::2::3']) {
      expect(getClientIp(h({ 'x-real-ip': v }), { trustedHeader: 'x-real-ip' })).toBe('unknown')
    }
  })

  it('xff toma el último salto por defecto (el que añadió nuestro proxy)', () => {
    const headers = h({ 'x-forwarded-for': '6.6.6.6, 10.0.0.1, 203.0.113.7' })
    expect(getClientIp(headers, { trustedHeader: 'x-forwarded-for' })).toBe('203.0.113.7')
  })

  it('xff con trustedHopFromRight=2 salta un proxy de confianza', () => {
    const headers = h({ 'x-forwarded-for': '6.6.6.6, 203.0.113.7, 10.0.0.1' })
    expect(getClientIp(headers, { trustedHeader: 'x-forwarded-for', trustedHopFromRight: 2 })).toBe('203.0.113.7')
  })

  it('xff con menos saltos de los esperados -> unknown', () => {
    expect(
      getClientIp(h({ 'x-forwarded-for': '1.2.3.4' }), { trustedHeader: 'x-forwarded-for', trustedHopFromRight: 2 }),
    ).toBe('unknown')
  })

  it('xff con el elemento fiable inválido no retrocede a uno spoofeable', () => {
    expect(getClientIp(h({ 'x-forwarded-for': '1.2.3.4, basura' }), { trustedHeader: 'x-forwarded-for' })).toBe(
      'unknown',
    )
  })

  it('trustedHopFromRight inválido -> unknown', () => {
    expect(
      getClientIp(h({ 'x-forwarded-for': '1.2.3.4' }), { trustedHeader: 'x-forwarded-for', trustedHopFromRight: 0 }),
    ).toBe('unknown')
  })
})

describe('normalizeIp', () => {
  it('::ffff:a.b.c.d se reduce a IPv4', () => {
    expect(normalizeIp('::ffff:1.2.3.4')).toBe('1.2.3.4')
    expect(normalizeIp('::FFFF:0102:0304')).toBe('1.2.3.4')
  })
  it('comprime el tramo de ceros más largo', () => {
    expect(normalizeIp('2001:db8:0:0:1:0:0:1')).toBe('2001:db8::1:0:0:1')
    expect(normalizeIp('0:0:0:0:0:0:0:1')).toBe('::1')
    expect(normalizeIp('::')).toBe('::')
  })
  it('no comprime un único grupo de ceros', () => {
    expect(normalizeIp('2001:db8:0:1:1:1:1:1')).toBe('2001:db8:0:1:1:1:1:1')
  })
  it('rechaza vacío y demasiado largo', () => {
    expect(normalizeIp('')).toBeNull()
    expect(normalizeIp('1'.repeat(60))).toBeNull()
  })
})

describe('ipRateLimitKey', () => {
  it('IPv4 tal cual y unknown tal cual', () => {
    expect(ipRateLimitKey('203.0.113.9')).toBe('203.0.113.9')
    expect(ipRateLimitKey(UNKNOWN_IP)).toBe('unknown')
  })
  it('IPv6 se agrupa por /64: rotar dentro del prefijo da la misma clave', () => {
    const a = ipRateLimitKey('2001:db8:1:2:aaaa:bbbb:cccc:dddd')
    expect(a).toBe('2001:0db8:0001:0002::/64')
    expect(ipRateLimitKey('2001:db8:1:2::1')).toBe(a)
    expect(ipRateLimitKey('2001:db8:1:3::1')).not.toBe(a)
  })
  it('IPv4 mapeada en IPv6 se trata como IPv4 y la basura cae en unknown', () => {
    expect(ipRateLimitKey('::ffff:1.2.3.4')).toBe('1.2.3.4')
    expect(ipRateLimitKey('basura')).toBe('unknown')
    expect(ipRateLimitKey('')).toBe('unknown')
  })
})

describe('riesgo de configuración del proxy', () => {
  it('trustedHopFromRight mayor que los proxies reales devuelve una IP spoofeable', () => {
    // Con un solo proxy real, hop 2 coge el valor que escribió el cliente
    const headers = h({ 'x-forwarded-for': '6.6.6.6, 1.1.1.1' })
    expect(getClientIp(headers, { trustedHeader: 'x-forwarded-for', trustedHopFromRight: 2 })).toBe('6.6.6.6')
    expect(getClientIp(headers, { trustedHeader: 'x-forwarded-for', trustedHopFromRight: 1 })).toBe('1.1.1.1')
  })
  it('valores con puerto o corchetes caen en unknown', () => {
    for (const v of ['1.2.3.4:443', '[2001:db8::1]', '[2001:db8::1]:443']) {
      expect(getClientIp(h({ 'x-real-ip': v }), { trustedHeader: 'x-real-ip' })).toBe('unknown')
      expect(getClientIp(h({ 'x-forwarded-for': `9.9.9.9, ${v}` }), { trustedHeader: 'x-forwarded-for' })).toBe('unknown')
    }
  })
})
