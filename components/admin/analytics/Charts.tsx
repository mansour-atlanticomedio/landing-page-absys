import type { DayPoint } from '@/lib/analytics/series'
import { percent } from '@/lib/analytics/series'

const nf = new Intl.NumberFormat('es-ES')
export const fmt = (n: number) => nf.format(n)

const shortDay = (day: string) => {
  const [, m, d] = day.split('-')
  return `${d}/${m}`
}

// Gráfico de barras de visitas por día en SVG, con tabla equivalente para lectores de pantalla
export function DailyChart({ data }: { data: DayPoint[] }) {
  const W = 720
  const H = 220
  const pad = { top: 12, right: 8, bottom: 28, left: 40 }
  const max = Math.max(1, ...data.map((d) => d.views))
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const slot = innerW / data.length
  const barW = Math.max(2, Math.min(32, slot * 0.7))
  const labelEvery = Math.ceil(data.length / 8)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t))

  return (
    <figure className="unam-an-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Visitas por día, de ${shortDay(data[0].day)} a ${shortDay(data[data.length - 1].day)}`}>
        {ticks.map((t) => {
          const y = pad.top + innerH - (t / niceMax) * innerH
          return (
            <g key={t}>
              <line x1={pad.left} x2={W - pad.right} y1={y} y2={y} className="unam-an-chart__grid" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" className="unam-an-chart__tick">
                {fmt(t)}
              </text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const h = (d.views / niceMax) * innerH
          const x = pad.left + i * slot + (slot - barW) / 2
          return (
            <g key={d.day}>
              <rect x={x} y={pad.top + innerH - h} width={barW} height={Math.max(h, d.views > 0 ? 1 : 0)} rx={2} className="unam-an-chart__bar">
                <title>{`${shortDay(d.day)}: ${d.views} visitas, ${d.visitors} visitantes`}</title>
              </rect>
              {i % labelEvery === 0 ? (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" className="unam-an-chart__tick">
                  {shortDay(d.day)}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <table className="unam-an-sr-only">
        <caption>Visitas por día</caption>
        <thead>
          <tr>
            <th scope="col">Día</th>
            <th scope="col">Visitas</th>
            <th scope="col">Visitantes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.day}</th>
              <td>{d.views}</td>
              <td>{d.visitors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

// Distribución por hora (0-23), también SVG
export function HoursChart({ data }: { data: Array<{ hour: number; views: number }> }) {
  const W = 720
  const H = 150
  const pad = { top: 8, right: 8, bottom: 24, left: 8 }
  const max = Math.max(1, ...data.map((d) => d.views))
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const slot = innerW / 24
  const barW = slot * 0.7

  return (
    <figure className="unam-an-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Visitas por hora del día">
        {data.map((d) => {
          const h = (d.views / max) * innerH
          const x = pad.left + d.hour * slot + (slot - barW) / 2
          return (
            <g key={d.hour}>
              <rect x={x} y={pad.top + innerH - h} width={barW} height={Math.max(h, d.views > 0 ? 1 : 0)} rx={2} className="unam-an-chart__bar unam-an-chart__bar--alt">
                <title>{`${String(d.hour).padStart(2, '0')}:00 - ${d.views} visitas`}</title>
              </rect>
              {d.hour % 3 === 0 ? (
                <text x={x + barW / 2} y={H - 6} textAnchor="middle" className="unam-an-chart__tick">
                  {String(d.hour).padStart(2, '0')}h
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <table className="unam-an-sr-only">
        <caption>Visitas por hora</caption>
        <thead>
          <tr>
            <th scope="col">Hora</th>
            <th scope="col">Visitas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.hour}>
              <th scope="row">{String(d.hour).padStart(2, '0')}:00</th>
              <td>{d.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

// Lista con barras horizontales proporcionales al total
export function BarList({ items, total, empty }: { items: Array<{ label: string; count: number }>; total?: number; empty?: string }) {
  if (items.length === 0) return <p className="unam-an-empty-inline">{empty ?? 'Sin datos en este periodo.'}</p>
  const base = total ?? Math.max(1, ...items.map((i) => i.count))
  return (
    <ul className="unam-an-bars">
      {items.map((item) => (
        <li key={item.label} className="unam-an-bars__row">
          <div className="unam-an-bars__head">
            <span className="unam-an-bars__label" title={item.label}>
              {item.label}
            </span>
            <span className="unam-an-bars__count">
              {fmt(item.count)}
              {total ? ` (${percent(item.count, total)}%)` : ''}
            </span>
          </div>
          <div className="unam-an-bars__track" aria-hidden="true">
            <div className="unam-an-bars__fill" style={{ width: `${Math.min(100, (item.count / base) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
