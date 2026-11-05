export const CONSENT_COOKIE = 'unam_cookie_consent'
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
export const OPEN_COOKIE_SETTINGS_EVENT = 'unam:open-cookie-settings'
export const CONSENT_CHANGED_EVENT = 'unam:consent-changed'

export const OPTIONAL_CATEGORIES = ['preferencias', 'analiticas', 'marketing'] as const
export type OptionalCategory = (typeof OPTIONAL_CATEGORIES)[number]
export type ConsentCategories = Record<OptionalCategory, boolean>

export type ConsentRecord = {
  version: number
  fecha: string
  categorias: ConsentCategories
}

export const ACCEPT_ALL: ConsentCategories = { preferencias: true, analiticas: true, marketing: true }
export const REJECT_ALL: ConsentCategories = { preferencias: false, analiticas: false, marketing: false }

export function buildConsent(categorias: ConsentCategories, now: Date = new Date()): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    fecha: now.toISOString(),
    categorias: {
      preferencias: categorias.preferencias === true,
      analiticas: categorias.analiticas === true,
      marketing: categorias.marketing === true,
    },
  }
}

export function serializeConsent(record: ConsentRecord): string {
  return encodeURIComponent(JSON.stringify(record))
}

export function parseConsent(raw: string | null | undefined): ConsentRecord | null {
  if (!raw) return null
  try {
    const data = JSON.parse(decodeURIComponent(raw))
    if (!data || data.version !== CONSENT_VERSION || typeof data.fecha !== 'string') return null
    const c = data.categorias
    if (!c || typeof c !== 'object') return null
    if (OPTIONAL_CATEGORIES.some((k) => typeof c[k] !== 'boolean')) return null
    return buildConsent(c, new Date(data.fecha))
  } catch {
    return null
  }
}

export function readConsentFromCookieString(cookies: string): ConsentRecord | null {
  const part = cookies.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${CONSENT_COOKIE}=`))
  return part ? parseConsent(part.slice(CONSENT_COOKIE.length + 1)) : null
}

export function consentCookieString(record: ConsentRecord, basePath: string, secure: boolean): string {
  const parts = [
    `${CONSENT_COOKIE}=${serializeConsent(record)}`,
    `Path=${basePath || '/'}`,
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}
