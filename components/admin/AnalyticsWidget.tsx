import type { AdminViewServerProps } from 'payload'
import { Button, Gutter } from '@payloadcms/ui'
import { getTodaySummary } from '@/lib/analytics/queries'
import OnlineNow from './analytics/OnlineNow'

export default async function AnalyticsWidget({ payload, user }: { payload?: AdminViewServerProps['payload']; user?: any }) {
  if (!payload || user?.collection !== 'users' || user?.role !== 'admin') return null

  let summary = { online: 0, views: 0, visitors: 0 }
  try {
    summary = await getTodaySummary(payload)
  } catch {
    // Si la BD aún no tiene las tablas, el widget se muestra con ceros
  }

  return (
    <Gutter className="unam-an-widget">
      <div className="unam-an-widget__box">
        <div>
          <h3 className="unam-an-widget__title">Visitas a la web</h3>
          <OnlineNow online={summary.online} views={summary.views} visitors={summary.visitors} />
        </div>
        <Button el="link" to="/admin/analiticas" buttonStyle="secondary" size="medium">
          Ver estadísticas completas
        </Button>
      </div>
    </Gutter>
  )
}
