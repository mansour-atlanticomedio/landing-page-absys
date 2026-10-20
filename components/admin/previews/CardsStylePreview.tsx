import { C, Img, Line, Stack, ThumbFrame, displayFont, pick, previewFont, type PreviewProps, type ThumbProps } from './shared'

const CARDS = [
  { title: 'Préstamo de libros', description: 'Hasta 6 ejemplares durante 15 días.' },
  { title: 'Salas de estudio', description: 'Reserva online, grupos de 2 a 8 personas.' },
  { title: 'Formación de usuarios', description: 'Talleres de búsqueda y citación.' },
]

export function CardsStyleThumb({ value }: ThumbProps) {
  if (value === 'muted')
    return (
      <ThumbFrame bg={C.navyDark}>
        <Stack gap={3} style={{ flex: 1, justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 3, padding: 4 }}>
              <Line w="40%" h={3} color={C.teal} style={{ marginBottom: 3 }} />
              <Line h={3} color="rgba(255,255,255,0.5)" />
            </div>
          ))}
        </Stack>
      </ThumbFrame>
    )
  return (
    <ThumbFrame>
      <Line w="40%" h={4} color={C.navy} style={{ margin: '3px auto 6px' }} />
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 3, padding: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(59,172,189,0.35)', marginBottom: 3 }} />
            <Line h={3} color={C.navy} style={{ marginBottom: 2 }} />
            <Line w="70%" h={3} />
          </div>
        ))}
      </div>
    </ThumbFrame>
  )
}

export function CardsStylePreview({ value, content }: PreviewProps) {
  const title = pick(content, 'title', 'Cómo te ayudamos')
  if (value === 'muted')
    return (
      <div style={{ ...previewFont, background: C.navyDark, color: C.white, padding: '24px 20px' }}>
        <h2 style={{ ...displayFont, margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: C.white }}>{title}</h2>
        <Stack gap={10}>
          {CARDS.map((c) => (
            <div key={c.title} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 14 }}>
              <div style={{ color: C.teal, fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{c.description}</p>
            </div>
          ))}
        </Stack>
      </div>
    )
  return (
    <div style={{ ...previewFont, background: C.white, padding: '24px 20px' }}>
      <h2 style={{ ...displayFont, margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: C.navy, textAlign: 'center' }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        {CARDS.map((c) => (
          <div key={c.title} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <Img tone="b" style={{ width: 32, height: 32, borderRadius: 6, marginBottom: 10 }} />
            <h3 style={{ ...displayFont, margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: C.navy }}>{c.title}</h3>
            <p style={{ margin: 0, fontSize: 12, color: C.sub }}>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
