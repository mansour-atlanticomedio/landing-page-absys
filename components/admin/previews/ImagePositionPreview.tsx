import { C, Img, Line, Stack, ThumbFrame, displayFont, pick, previewFont, type PreviewProps, type ThumbProps } from './shared'

export function ImagePositionThumb({ value }: ThumbProps) {
  const image = <Img style={{ flex: 1, height: '75%' }} />
  const text = (
    <Stack gap={3} style={{ flex: 1 }}>
      <Line w="70%" h={5} color={C.navy} />
      <Line h={3} />
      <Line h={3} />
      <Line w="60%" h={3} />
    </Stack>
  )
  return (
    <ThumbFrame>
      <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
        {value === 'right' ? <>{text}{image}</> : <>{image}{text}</>}
      </div>
    </ThumbFrame>
  )
}

export function ImagePositionPreview({ value, content }: PreviewProps) {
  const image = <Img style={{ height: 150, borderRadius: 8 }} />
  const text = (
    <div>
      <h2 style={{ ...displayFont, margin: 0, fontSize: 18, fontWeight: 700, color: C.navy }}>{pick(content, 'title', 'Nuestras instalaciones')}</h2>
      <p style={{ margin: '8px 0 0', color: C.sub }}>
        Tres plantas con salas de estudio, zona de trabajo en grupo y fondo bibliográfico en libre acceso.
      </p>
    </div>
  )
  return (
    <div style={{ ...previewFont, background: C.white, padding: 20, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, alignItems: 'center' }}>
      {value === 'right' ? <>{text}{image}</> : <>{image}{text}</>}
    </div>
  )
}
