'use client'

import { OPEN_COOKIE_SETTINGS_EVENT } from '@/lib/consent'

export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}>
      Configurar cookies
    </button>
  )
}
