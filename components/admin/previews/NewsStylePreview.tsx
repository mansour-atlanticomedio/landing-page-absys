import { C, Img, Line, Stack, ThumbFrame, displayFont, pick, previewFont, type PreviewProps, type ThumbProps } from './shared'

const SAMPLES = [
  { tag: 'EXPOSICIÓN', title: 'Cien años de soledad: la muestra del aniversario', description: 'Ediciones históricas y manuscritos en la sala de lectura.' },
  { tag: 'EVENTO', title: 'Taller de búsqueda en bases de datos', description: 'Aprende a localizar artículos científicos en 45 minutos.' },
  { tag: 'NOVEDAD', title: 'Nuevos ebooks de Derecho y Economía', description: 'Más de 300 títulos disponibles desde el campus.' },
]

export function NewsStyleThumb({ value }: ThumbProps) {
  const cell = (inner: React.ReactNode, i: number) => (
    <div key={i} style={{ flex: 1, minWidth: 0 }}>{inner}</div>
  )
  const cards = [0, 1, 2].map((i) => {
    if (value === '0')
      return cell(
        <Stack gap={0} style={{ border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden', height: '100%' }}>
          <Img style={{ height: 26, borderRadius: 0 }} />
          <Stack gap={2} style={{ padding: 3 }}>
            <Line w="40%" h={3} color={C.navy} />
            <Line h={3} />
            <Line w="70%" h={3} />
          </Stack>
        </Stack>,
        i,
      )
    if (value === '1')
      return cell(
        <Stack gap={3} style={{ border: `1px solid ${C.border}`, borderRadius: 3, padding: 4, height: '100%', boxSizing: 'border-box' }}>
          <Img tone="b" style={{ height: 22 }} />
          <Line h={3} color={C.navy} />
          <Line w="70%" h={3} />
        </Stack>,
        i,
      )
    return cell(
      <div style={{ position: 'relative', height: 48, borderRadius: 4, overflow: 'hidden' }}>
        <Img tone="dark" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '35%', background: 'rgba(51,51,51,0.8)', padding: 3, boxSizing: 'border-box' }}>
          <Line h={3} color={C.white} />
        </div>
      </div>,
      i,
    )
  })

  if (value === '2')
    return (
      <ThumbFrame>
        <Stack gap={4} style={{ height: '100%', justifyContent: 'center' }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: 'flex', gap: 5, border: `1px solid ${C.border}`, borderRadius: 4, padding: 4, alignItems: 'center' }}>
              <Img style={{ width: 28, height: 22, flexShrink: 0 }} />
              <Stack gap={2} style={{ flex: 1 }}>
                <Line w="30%" h={3} color={C.teal} />
                <Line h={3} color={C.navy} />
                <Line w="70%" h={3} />
              </Stack>
            </div>
          ))}
        </Stack>
      </ThumbFrame>
    )

  return (
    <ThumbFrame>
      <div style={{ display: 'flex', gap: 4, height: '100%', alignItems: value === '3' ? 'center' : 'stretch' }}>{cards}</div>
    </ThumbFrame>
  )
}

function Card({ value, item, image }: { value: string; item: (typeof SAMPLES)[number]; image: number }) {
  const tone = image % 2 === 0 ? 'a' : 'b'
  if (value === '0')
    return (
      <article style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', background: C.white, minWidth: 0 }}>
        <Img tone={tone} style={{ height: 110, borderRadius: 0 }} />
        <div style={{ padding: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.navy }}>{item.tag}</span>
          <h3 style={{ ...displayFont, margin: '6px 0 0', fontSize: 15, fontWeight: 700, color: C.text }}>{item.title}</h3>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{item.description}</p>
        </div>
      </article>
    )
  if (value === '1')
    return (
      <article style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, background: C.white, minWidth: 0 }}>
        <Img tone={tone} style={{ height: 100, borderRadius: 8, marginBottom: 12 }} />
        <h3 style={{ ...displayFont, margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>{item.title}</h3>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{item.description}</p>
      </article>
    )
  if (value === '2')
    return (
      <article style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, background: C.white, display: 'flex', gap: 14, alignItems: 'center', minWidth: 0 }}>
        <Img tone={tone} style={{ width: 120, height: 90, borderRadius: 8, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <span style={{ display: 'inline-block', borderRadius: 999, background: 'rgba(45,62,80,0.1)', padding: '2px 10px', fontSize: 10, fontWeight: 700, color: C.navy }}>{item.tag}</span>
          <h3 style={{ ...displayFont, margin: '8px 0 0', fontSize: 15, fontWeight: 700, color: C.text }}>{item.title}</h3>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{item.description}</p>
        </div>
      </article>
    )
  return (
    <article style={{ position: 'relative', height: 190, borderRadius: 12, overflow: 'hidden', background: '#1e2a38', minWidth: 0 }}>
      <Img tone="dark" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%', background: 'rgba(51,51,51,0.85)', padding: '8px 14px', boxSizing: 'border-box' }}>
        <h3 style={{ ...displayFont, margin: 0, fontSize: 14, fontWeight: 700, color: C.white, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
      </div>
    </article>
  )
}

export function NewsStylePreview({ value, content }: PreviewProps) {
  const requested = parseInt(content.visible_cards ?? '', 10)
  const visible = Number.isFinite(requested) ? Math.min(3, Math.max(1, requested)) : 3
  const columns = value === '2' ? Math.min(visible, 2) : visible
  const items = SAMPLES.slice(0, Math.max(columns, 1)).map((s, i) =>
    i === 0 ? { ...s, tag: pick(content, 'tag', s.tag).toUpperCase(), title: pick(content, 'itemTitle', s.title), description: pick(content, 'description', s.description) } : s,
  )
  return (
    <div style={{ ...previewFont, background: C.white, padding: 16 }}>
      <h2 style={{ ...displayFont, margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: C.navy }}>{pick(content, 'title', 'Noticias de la biblioteca')}</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {items.map((item, i) => (
          <Card key={i} value={value} item={item} image={i} />
        ))}
      </div>
    </div>
  )
}
