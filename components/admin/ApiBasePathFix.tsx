'use client'

import type { ReactNode } from 'react'

const BASE_PATH = process.env.NEXT_BASE_PATH ?? ''
const PLUGIN_PREVIEW_URL = /^\/api\/(exports|imports)\//

type FixedWindow = Window & { __unamApiBasePathFix?: boolean }

if (typeof window !== 'undefined' && BASE_PATH && !(window as FixedWindow).__unamApiBasePathFix) {
  ;(window as FixedWindow).__unamApiBasePathFix = true
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init) => {
    if (typeof input === 'string' && PLUGIN_PREVIEW_URL.test(input)) {
      return originalFetch(`${BASE_PATH}${input}`, init)
    }
    return originalFetch(input, init)
  }
}

export default function ApiBasePathFix({ children }: { children?: ReactNode }) {
  return <>{children}</>
}
