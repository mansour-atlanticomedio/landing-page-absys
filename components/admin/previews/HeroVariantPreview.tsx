import { C, Img, Line, Stack, ThumbFrame, displayFont, pick, previewFont, type PreviewProps, type ThumbProps } from './shared'

export function HeroVariantThumb({ value }: ThumbProps) {
  if (value === 'split')
    return (
      <ThumbFrame bg={C.muted}>
        <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
          <Stack gap={3} style={{ flex: 1 }}>
            <Line w="80%" h={5} color={C.navy} />
            <Line h={3} />
            <Line w="70%" h={3} />
          </Stack>
          <Img style={{ flex: 1, height: '70%' }} />
        </div>
      </ThumbFrame>
    )
  return (
    <ThumbFrame>
      <Stack gap={3} style={{ paddingTop: 6 }}>
        <Line w="55%" h={5} color={C.navy} />
        <Line w="75%" h={3} />
        <Line w="60%" h={3} />
      </Stack>
    </ThumbFrame>
  )
}

export function HeroVariantPreview({ value, content }: PreviewProps) {
  const title = pick(content, 'title', 'Quiénes somos')
  const subtitle = 'Conoce los servicios, espacios y recursos de la Biblioteca de la Universidad Atlántico Medio.'
  if (value === 'split')
    return (
      <div style={{ ...previewFont, background: `linear-gradient(to bottom, ${C.muted}, ${C.white})`, padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, alignItems: 'center' }}>
        <div>
          <h1 style={{ ...displayFont, margin: 0, fontSize: 24, fontWeight: 800, color: C.navy }}>{title}</h1>
          <p style={{ margin: '10px 0 0', color: C.sub }}>{subtitle}</p>
        </div>
        <Img style={{ height: 150, borderRadius: 8 }} />
      </div>
    )
  return (
    <div style={{ ...previewFont, background: C.white, padding: '28px 24px 12px' }}>
      <h1 style={{ ...displayFont, margin: 0, fontSize: 24, fontWeight: 800, color: C.navy }}>{title}</h1>
      <p style={{ margin: '8px 0 0', color: C.sub, maxWidth: 480 }}>{subtitle}</p>
    </div>
  )
}
