import { describe, expect, it } from 'vitest'
import { detectBrowser, detectDevice, isBot } from '@/lib/analytics/agent'
import { parseTrackBody } from '@/lib/analytics/body'
import { isIgnoredPath, normalizePath, normalizeReferrer } from '@/lib/analytics/normalize'
import {
  DIRECT_LABEL,
  addDays,
  fillDailySeries,
  fillHours,
  labelReferrers,
  pagesPerVisitor,
  parseRange,
  rangeBounds,
} from '@/lib/analytics/series'
import { analyticsSecret, dailySalt, dayKey, visitorHash } from '@/lib/analytics/visitor'

const CHROME_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
const EDGE_WIN = `${CHROME_WIN} Edg/126.0.0.0`
const FIREFOX = 'Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0'
const SAFARI_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
const ANDROID_TABLET = 'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

describe('visitorHash', () => {
  const secret = analyticsSecret({ PAYLOAD_SECRET: 'dev' })

  it('es estable dentro del mismo día', () => {
    expect(visitorHash(secret, '1.2.3.4', CHROME_WIN, '2026-10-21')).toBe(visitorHash(secret, '1.2.3.4', CHROME_WIN, '2026-10-21'))
  })

  it('cambia al rotar el día, la IP o el UA', () => {
    const base = visitorHash(secret, '1.2.3.4', CHROME_WIN, '2026-10-21')
    expect(visitorHash(secret, '1.2.3.4', CHROME_WIN, '2026-10-22')).not.toBe(base)
    expect(visitorHash(secret, '1.2.3.5', CHROME_WIN, '2026-10-21')).not.toBe(base)
    expect(visitorHash(secret, '1.2.3.4', FIREFOX, '2026-10-21')).not.toBe(base)
  })

  it('está truncado y no contiene la IP ni el UA', () => {
    const h = visitorHash(secret, '1.2.3.4', CHROME_WIN, '2026-10-21')
    expect(h).toMatch(/^[0-9a-f]{32}$/)
    expect(h).not.toContain('1.2.3.4')
  })

  it('la sal depende del secreto y del día', () => {
    expect(dailySalt(secret, '2026-10-21')).not.toBe(dailySalt(secret, '2026-10-22'))
    expect(dailySalt(secret, '2026-10-21')).not.toBe(dailySalt(analyticsSecret({ PAYLOAD_SECRET: 'otro' }), '2026-10-21'))
  })

  it('lanza sin PAYLOAD_SECRET', () => {
    expect(() => analyticsSecret({})).toThrow()
  })

  it('dayKey usa Europe/Madrid', () => {
    expect(dayKey(new Date('2026-10-21T22:30:00Z'))).toBe('2026-10-22')
    expect(dayKey(new Date('2026-10-21T21:30:00Z'))).toBe('2026-10-21')
  })
})

describe('agente', () => {
  it('detecta bots y UA vacíos', () => {
    expect(isBot('')).toBe(true)
    expect(isBot(null)).toBe(true)
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true)
    expect(isBot('curl/8.5.0')).toBe(true)
    expect(isBot('k6/0.50.0 (https://k6.io/)')).toBe(true)
    expect(isBot('Mozilla/5.0 HeadlessChrome/126.0.0.0')).toBe(true)
    expect(isBot(CHROME_WIN)).toBe(false)
    expect(isBot(IPHONE)).toBe(false)
  })

  it('detecta el dispositivo', () => {
    expect(detectDevice(CHROME_WIN)).toBe('desktop')
    expect(detectDevice(SAFARI_MAC)).toBe('desktop')
    expect(detectDevice(IPHONE)).toBe('mobile')
    expect(detectDevice(ANDROID)).toBe('mobile')
    expect(detectDevice(IPAD)).toBe('tablet')
    expect(detectDevice(ANDROID_TABLET)).toBe('tablet')
    expect(detectDevice('algo raro')).toBe('other')
  })

  it('detecta el navegador', () => {
    expect(detectBrowser(CHROME_WIN)).toBe('chrome')
    expect(detectBrowser(EDGE_WIN)).toBe('edge')
    expect(detectBrowser(FIREFOX)).toBe('firefox')
    expect(detectBrowser(SAFARI_MAC)).toBe('safari')
    expect(detectBrowser(IPHONE)).toBe('safari')
    expect(detectBrowser(ANDROID)).toBe('chrome')
    expect(detectBrowser('Mozilla/5.0 OPR/110.0')).toBe('other')
  })
})

describe('normalizePath', () => {
  it('quita querystring, hash, basePath y barra final', () => {
    expect(normalizePath('/biblioteca/recursos/catalogo/?q=quijote#x')).toBe('/recursos/catalogo')
    expect(normalizePath('/biblioteca')).toBe('/')
    expect(normalizePath('/')).toBe('/')
    expect(normalizePath('/a//b///')).toBe('/a/b')
  })

  it('rechaza lo que no es una ruta', () => {
    expect(normalizePath('https://evil.com/x')).toBeNull()
    expect(normalizePath('//evil.com')).toBeNull()
    expect(normalizePath('sin-barra')).toBeNull()
    expect(normalizePath(42)).toBeNull()
    expect(normalizePath('/a\nb')).toBeNull()
    expect(normalizePath(`/${'a'.repeat(250)}`)).toBeNull()
  })

  it('ignora admin, api, _next y auth', () => {
    for (const p of ['/admin', '/admin/collections/pages', '/api/x', '/_next/static', '/auth/campus']) {
      expect(isIgnoredPath(p)).toBe(true)
    }
    expect(isIgnoredPath('/administracion')).toBe(false)
    expect(isIgnoredPath('/recursos')).toBe(false)
  })
})

describe('normalizeReferrer', () => {
  it('deja solo el hostname externo', () => {
    expect(normalizeReferrer('https://www.google.com/search?q=secreto')).toBe('google.com')
    expect(normalizeReferrer('http://campus.atlanticomedio.es/ruta/x')).toBe('campus.atlanticomedio.es')
  })

  it('vacío para la propia web, basura o esquemas raros', () => {
    expect(normalizeReferrer('https://www.atlanticomedio.es/biblioteca', ['atlanticomedio.es'])).toBe('')
    expect(normalizeReferrer('http://localhost:8085/x', ['localhost:8085'])).toBe('')
    expect(normalizeReferrer('javascript:alert(1)')).toBe('')
    expect(normalizeReferrer('no es url')).toBe('')
    expect(normalizeReferrer('')).toBe('')
    expect(normalizeReferrer(undefined)).toBe('')
  })
})

describe('parseTrackBody', () => {
  it('acepta view y ping válidos', () => {
    expect(parseTrackBody({ type: 'view', path: '/x?y=1', entry: true, referrer: 'https://a.com' })).toEqual({
      type: 'view',
      path: '/x',
      referrer: 'https://a.com',
      entry: true,
    })
    expect(parseTrackBody({ type: 'ping', path: '/' })).toMatchObject({ type: 'ping', entry: false, referrer: '' })
  })

  it('rechaza cuerpos inválidos', () => {
    expect(parseTrackBody(null)).toBeNull()
    expect(parseTrackBody([])).toBeNull()
    expect(parseTrackBody({ type: 'click', path: '/' })).toBeNull()
    expect(parseTrackBody({ type: 'view' })).toBeNull()
    expect(parseTrackBody({ type: 'view', path: 'http://x' })).toBeNull()
  })
})

describe('series', () => {
  it('addDays cruza meses y años', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('rellena días vacíos', () => {
    const out = fillDailySeries([{ day: '2026-10-20', views: 5, visitors: 3 }], '2026-10-19', '2026-10-21')
    expect(out).toEqual([
      { day: '2026-10-19', views: 0, visitors: 0 },
      { day: '2026-10-20', views: 5, visitors: 3 },
      { day: '2026-10-21', views: 0, visitors: 0 },
    ])
  })

  it('rellena las 24 horas', () => {
    const out = fillHours([{ hour: 9, views: 4 }])
    expect(out).toHaveLength(24)
    expect(out[9].views).toBe(4)
    expect(out[10].views).toBe(0)
  })

  it('rangos', () => {
    expect(parseRange('30')).toBe(30)
    expect(parseRange('13')).toBe(7)
    expect(parseRange(undefined)).toBe(7)
    expect(parseRange(['90'])).toBe(90)
    expect(rangeBounds(1, new Date('2026-10-21T10:00:00Z'))).toEqual({ from: '2026-10-21', to: '2026-10-21' })
    expect(rangeBounds(7, new Date('2026-10-21T10:00:00Z'))).toEqual({ from: '2026-10-15', to: '2026-10-21' })
  })

  it('referrers: vacío es Directo, ordenado y acotado', () => {
    const out = labelReferrers(
      [
        { referrer: '', count: 3 },
        { referrer: 'google.com', count: 5 },
        { referrer: 'bing.com', count: 1 },
      ],
      2,
    )
    expect(out).toEqual([
      { label: 'google.com', count: 5 },
      { label: DIRECT_LABEL, count: 3 },
    ])
  })

  it('páginas por visitante sin dividir por cero', () => {
    expect(pagesPerVisitor(10, 4)).toBe(2.5)
    expect(pagesPerVisitor(0, 0)).toBe(0)
  })
})
