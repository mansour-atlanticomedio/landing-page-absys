import { BASE_PATH } from '@/lib/auth/redirects'

export type CleanHref = { href: string; external: boolean; newTab: boolean }

const EXTERNAL = /^(https?:\/\/|mailto:|tel:)/i

export function cleanHref(raw?: string | null): CleanHref | null {
  const value = (raw ?? '').trim()
  if (!value || value === '#') return null

  if (EXTERNAL.test(value)) {
    return { href: value, external: true, newTab: /^https?:\/\//i.test(value) }
  }

  const withoutBase = value === BASE_PATH ? '/' : value.startsWith(`${BASE_PATH}/`) ? value.slice(BASE_PATH.length) : value
  return { href: withoutBase, external: false, newTab: false }
}
