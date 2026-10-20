import { C, ThumbFrame, displayFont, pick, previewFont, type PreviewProps, type ThumbProps } from './shared'

const TYPE_COLORS: Record<string, string> = {
  regular: C.sub,
  closed: '#dc2626',
  extended: '#0f766e',
  holiday: '#b45309',
}

const SAMPLE_HOURS: Record<string, string> = {
  regular: '8:00 - 21:00',
  closed: 'Cerrado',
  extended: '8:00 - 24:00',
  holiday: 'Cerrado por vacaciones',
}

export function ScheduleTypeThumb({ value }: ThumbProps) {
  return (
    <ThumbFrame bg={C.white}>
      <div style={{ ...previewFont, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: value === 'regular' ? 400 : 600, color: TYPE_COLORS[value] ?? C.sub, textAlign: 'center' }}>
          {SAMPLE_HOURS[value]}
        </span>
      </div>
    </ThumbFrame>
  )
}

export function ScheduleTypePreview({ value, content }: PreviewProps) {
  const rows = [
    { day: 'Lunes a jueves', hours: '8:00 - 21:00', type: 'regular', current: false },
    { day: pick(content, 'day', 'Viernes'), hours: pick(content, 'hours', SAMPLE_HOURS[value] ?? ''), type: value, current: true },
    { day: 'Sábados', hours: '9:00 - 14:00', type: 'regular', current: false },
  ]
  return (
    <div style={{ ...previewFont, background: C.white, padding: 16 }}>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, maxWidth: 360 }}>
        <h2 style={{ ...displayFont, margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: C.navy }}>Horario de apertura</h2>
        {rows.map((r) => (
          <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '2px 4px', borderRadius: 4, background: r.current ? C.muted : 'transparent' }}>
            <span style={{ color: C.sub }}>{r.day}</span>
            <span style={{ color: TYPE_COLORS[r.type] ?? C.sub, fontWeight: r.type === 'regular' ? 400 : 600 }}>{r.hours}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
