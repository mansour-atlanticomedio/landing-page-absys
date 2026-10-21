'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { BASE_PATH } from '@/lib/auth/redirects'

const ENDPOINT = `${BASE_PATH}/api/analytics/track`
const PING_INTERVAL_MS = 30_000

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload)
    if (typeof navigator.sendBeacon === 'function') {
      if (navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))) return
    }
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' } }).catch(() => {})
  } catch {
    // La analítica nunca debe romper la web
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const pathRef = useRef(pathname)
  const firstView = useRef(true)

  useEffect(() => {
    pathRef.current = pathname
    const entry = firstView.current
    firstView.current = false
    send({ type: 'view', path: pathname, entry, referrer: entry ? document.referrer : '' })
  }, [pathname])

  useEffect(() => {
    const ping = () => {
      if (document.visibilityState === 'visible') send({ type: 'ping', path: pathRef.current })
    }
    const timer = window.setInterval(ping, PING_INTERVAL_MS)
    document.addEventListener('visibilitychange', ping)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', ping)
    }
  }, [])

  return null
}
