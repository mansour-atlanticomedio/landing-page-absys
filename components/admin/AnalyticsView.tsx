import type { AdminViewServerProps } from 'payload'
import { Banner, Button, Gutter } from '@payloadcms/ui'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { getAnalytics, pruneAnalytics, type AnalyticsData } from '@/lib/analytics/queries'
import { pagesPerVisitor, parseRange, RANGE_LABELS, RANGES } from '@/lib/analytics/series'
import { ANALYTICS_RETENTION_DAYS } from '@/lib/analytics/config'
import OnlineNow from './analytics/OnlineNow'
import { BarList, DailyChart, HoursChart, fmt } from './analytics/Charts'

const DEVICE_LABELS: Record<string, string> = { desktop: 'Ordenador', mobile: 'Móvil', tablet: 'Tablet', other: 'Otro' }
const BROWSER_LABELS: Record<string, string> = { chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', other: 'Otro' }

export default async function AnalyticsView(props: AdminViewServerProps) {
  const { initPageResult, searchParams } = props
  const { req, visibleEntities } = initPageResult
  const user: any = req.user

  const template = (children: React.ReactNode) => (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={props.params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={req.user ?? undefined}
      viewType="analiticas"
      visibleEntities={{ collections: visibleEntities?.collections, globals: visibleEntities?.globals }}
    >
      <Gutter className="unam-an">{children}</Gutter>
    </DefaultTemplate>
  )

  if (user?.collection !== 'users' || user?.role !== 'admin') {
    return template(
      <>
        <h1 className="unam-an__title">Estadísticas de la web</h1>
        <Banner type="error">No tienes permiso para ver las estadísticas de la web. Pide acceso a un administrador.</Banner>
      </>,
    )
  }

  const range = parseRange((searchParams as any)?.rango)
  let data: AnalyticsData | null = null
  try {
    data = await getAnalytics(req.payload, range)
    void pruneAnalytics(req.payload)
  } catch (err) {
    req.payload.logger.error({ err }, 'analytics.view_failed')
  }

  if (!data) {
    return template(
      <>
        <h1 className="unam-an__title">Estadísticas de la web</h1>
        <Banner type="error">No se han podido cargar las estadísticas. Inténtalo de nuevo en unos minutos.</Banner>
      </>,
    )
  }

  const empty = data.totalViews === 0
  const devices = data.devices.map((d) => ({ label: DEVICE_LABELS[d.key] ?? d.key, count: d.count }))
  const browsers = data.browsers.map((d) => ({ label: BROWSER_LABELS[d.key] ?? d.key, count: d.count }))
  const readerTotal = data.readers.reader + data.readers.anonymous

  return template(
    <>
      <div className="unam-an__header">
        <div>
          <h1 className="unam-an__title">Estadísticas de la web</h1>
          <p className="unam-an__subtitle">
            {RANGE_LABELS[data.range]} ({data.from === data.to ? data.from : `${data.from} a ${data.to}`}). Hora de Madrid.
          </p>
        </div>
        <nav className="unam-an__ranges" aria-label="Periodo">
          {RANGES.map((r) => (
            <Button
              key={r}
              el="link"
              to={`/admin/analiticas?rango=${r}`}
              buttonStyle={r === data.range ? 'primary' : 'secondary'}
              size="small"
              aria-current={r === data.range ? 'true' : undefined}
            >
              {r === 1 ? 'Hoy' : `${r} días`}
            </Button>
          ))}
        </nav>
      </div>

      <ul className="unam-an__cards">
        <li className="unam-an-card">
          <span className="unam-an-card__label">Visitantes</span>
          <span className="unam-an-card__value">{fmt(data.totalVisitors)}</span>
          <span className="unam-an-card__hint">Un mismo visitante en días distintos cuenta una vez por día</span>
        </li>
        <li className="unam-an-card">
          <span className="unam-an-card__label">Páginas vistas</span>
          <span className="unam-an-card__value">{fmt(data.totalViews)}</span>
        </li>
        <li className="unam-an-card">
          <span className="unam-an-card__label">Páginas por visitante</span>
          <span className="unam-an-card__value">{String(pagesPerVisitor(data.totalViews, data.totalVisitors)).replace('.', ',')}</span>
        </li>
        <li className="unam-an-card unam-an-card--live">
          <span className="unam-an-card__label">Conectados ahora</span>
          <OnlineNow online={data.online} compact />
        </li>
      </ul>

      {empty ? (
        <div className="unam-an-empty">
          <h2>Aún no hay datos</h2>
          <p>
            Todavía no se han registrado visitas en este periodo. Las visitas aparecerán aquí a medida que las personas
            naveguen por la web. No se cuentan las visitas de quien tenga activado «No rastrear», ni las del panel ni las
            de bots.
          </p>
        </div>
      ) : (
        <>
          <section className="unam-an-panel" aria-labelledby="an-daily">
            <h2 id="an-daily">Visitas por día</h2>
            <DailyChart data={data.daily} />
          </section>

          <div className="unam-an__grid">
            <section className="unam-an-panel" aria-labelledby="an-pages">
              <h2 id="an-pages">Páginas más vistas</h2>
              <BarList items={data.topPaths.map((p) => ({ label: p.path, count: p.views }))} />
            </section>

            <section className="unam-an-panel" aria-labelledby="an-ref">
              <h2 id="an-ref">Procedencia</h2>
              <BarList items={data.referrers} total={data.referrers.reduce((a, r) => a + r.count, 0)} />
              <p className="unam-an-panel__note">Solo se guarda el dominio de la web de origen, nunca la dirección completa.</p>
            </section>

            <section className="unam-an-panel" aria-labelledby="an-dev">
              <h2 id="an-dev">Dispositivos</h2>
              <BarList items={devices} total={devices.reduce((a, r) => a + r.count, 0)} />
            </section>

            <section className="unam-an-panel" aria-labelledby="an-br">
              <h2 id="an-br">Navegadores</h2>
              <BarList items={browsers} total={browsers.reduce((a, r) => a + r.count, 0)} />
            </section>

            <section className="unam-an-panel" aria-labelledby="an-rd">
              <h2 id="an-rd">Lectores del campus y anónimos</h2>
              <BarList
                items={[
                  { label: 'Lectores con sesión del campus', count: data.readers.reader },
                  { label: 'Visitantes anónimos', count: data.readers.anonymous },
                ]}
                total={readerTotal}
              />
              <p className="unam-an-panel__note">No se guarda quién es cada lector.</p>
            </section>
          </div>

          <section className="unam-an-panel" aria-labelledby="an-hours">
            <h2 id="an-hours">Visitas por hora del día</h2>
            <HoursChart data={data.hours} />
          </section>
        </>
      )}

      <p className="unam-an__privacy">
        Analítica propia y anónima: sin cookies, sin guardar direcciones IP ni datos del navegador. El visitante es un código que
        cambia cada día y no permite seguir a nadie. Los eventos se conservan {ANALYTICS_RETENTION_DAYS} días.
      </p>
    </>,
  )
}
