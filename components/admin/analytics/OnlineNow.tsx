'use client'

import { useEffect, useState } from 'react'
import { BASE_PATH } from '@/lib/auth/redirects'

interface Props {
  online: number
  views?: number
  visitors?: number
  compact?: boolean
}

const REFRESH_MS = 30_000

// Muestra los conectados ahora y se refresca solo cada 30 s mientras la pestaña del panel está visible
export default function OnlineNow({ online, views, visitors, compact }: Props) {
  const [data, setData] = useState({ online, views, visitors })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch(`${BASE_PATH}/api/analytics/summary`, { credentials: 'same-origin', cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled) setData({ online: json.online, views: json.views, visitors: json.visitors })
      } catch {
        // Si falla se conserva la última cifra
      }
    }
    const timer = window.setInterval(load, REFRESH_MS)
    document.addEventListener('visibilitychange', load)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', load)
    }
  }, [])

  return (
    <div className={compact ? 'unam-an-online unam-an-online--compact' : 'unam-an-online'}>
      <span className="unam-an-online__dot" aria-hidden="true" />
      <span className="unam-an-online__value" role="status" aria-live="off" aria-label={`${data.online} personas conectadas ahora`}>
        {data.online}
      </span>
      <span className="unam-an-online__label">{data.online === 1 ? 'persona conectada ahora' : 'personas conectadas ahora'}</span>
      {data.views !== undefined && data.visitors !== undefined ? (
        <span className="unam-an-online__today">
          Hoy: {data.views} {data.views === 1 ? 'visita' : 'visitas'} · {data.visitors}{' '}
          {data.visitors === 1 ? 'visitante' : 'visitantes'}
        </span>
      ) : null}
    </div>
  )
}
