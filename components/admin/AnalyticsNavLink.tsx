'use client'

import Link from 'next/link'
import { useAuth } from '@payloadcms/ui'

export default function AnalyticsNavLink() {
  const { user } = useAuth()
  const u: any = user
  if (!u || u.collection !== 'users' || u.role !== 'admin') return null

  return (
    <Link href="/admin/analiticas" className="unam-an-navlink">
      Estadísticas de la web
    </Link>
  )
}
