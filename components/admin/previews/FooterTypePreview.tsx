import { C, Line, Stack, ThumbFrame, displayFont, previewFont, type PreviewProps, type ThumbProps } from './shared'

const COLUMNS = [
  { title: 'Contacto', rows: ['Av. de la Universidad, 1', '928 000 000', 'biblioteca@atlanticomedio.es'] },
  { title: 'Horario', rows: ['Lunes a viernes: 8:00 - 21:00', 'Sábados: 9:00 - 14:00'] },
]
const POLICIES = ['Aviso Legal', 'Política de privacidad', 'Política de cookies']

export function FooterTypeThumb({ value }: ThumbProps) {
  if (value === '1')
    return (
      <ThumbFrame bg={C.navy} pad={4}>
        <Stack gap={4} style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Line w={26} h={8} color={C.white} />
          <Line w="50%" h={3} color="rgba(255,255,255,0.6)" />
          <Line w="40%" h={3} color="rgba(255,255,255,0.6)" />
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 999, border: '1px solid rgba(255,255,255,0.6)' }} />
            ))}
          </div>
        </Stack>
      </ThumbFrame>
    )
  return (
    <ThumbFrame bg={C.navy} pad={0}>
      <div style={{ flex: 1, display: 'flex', gap: 6, padding: 6 }}>
        <Stack gap={3} style={{ flex: 1 }}>
          <Line w={22} h={8} color={C.white} />
          <div style={{ display: 'flex', gap: 2 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: 999, border: '1px solid rgba(255,255,255,0.6)' }} />
            ))}
          </div>
        </Stack>
        {[0, 1].map((i) => (
          <Stack key={i} gap={3} style={{ flex: 1 }}>
            <Line w="60%" h={3} color={C.white} />
            <Line h={3} color="rgba(255,255,255,0.5)" />
            <Line w="80%" h={3} color="rgba(255,255,255,0.5)" />
          </Stack>
        ))}
      </div>
      <div style={{ height: 9, background: C.teal }} />
    </ThumbFrame>
  )
}

function Social() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ width: 24, height: 24, borderRadius: 999, border: '1px solid rgba(255,255,255,0.4)' }} />
      ))}
    </div>
  )
}

function Policies({ spread }: { spread?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: spread ? 'space-around' : 'center', flexWrap: 'wrap', fontSize: 11 }}>
      {POLICIES.map((p, i) => (
        <span key={p}>{p}{i < POLICIES.length - 1 ? ' -' : ''}</span>
      ))}
    </div>
  )
}

export function FooterTypePreview({ value }: PreviewProps) {
  const logo = <div style={{ ...displayFont, fontWeight: 700, fontSize: 14, color: C.white, border: '1px solid rgba(255,255,255,0.4)', borderRadius: 4, padding: '6px 12px', display: 'inline-block' }}>UNAM Biblioteca</div>
  if (value === '1')
    return (
      <div style={{ ...previewFont, background: C.navy, color: C.white, textAlign: 'center' }}>
        <div style={{ padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {logo}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 style={{ ...displayFont, margin: '0 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.white }}>{col.title}</h4>
              {col.rows.map((r) => (
                <div key={r} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{r}</div>
              ))}
            </div>
          ))}
          <Social />
        </div>
        <div style={{ paddingBottom: 12 }}><Policies /></div>
      </div>
    )
  return (
    <div style={{ ...previewFont, background: C.navy, color: C.white }}>
      <div style={{ padding: '24px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
        <div>
          {logo}
          <p style={{ margin: '10px 0 10px', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Puedes encontrarnos en:</p>
          <Social />
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 style={{ ...displayFont, margin: '0 0 8px', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.white }}>{col.title}</h4>
            {col.rows.map((r) => (
              <div key={r} style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>{r}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: C.teal, color: C.navyDark, padding: '8px 12px' }}>
        <Policies spread />
      </div>
    </div>
  )
}
