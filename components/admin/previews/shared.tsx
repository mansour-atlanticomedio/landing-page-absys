import type { CSSProperties, ReactNode } from 'react'

export const C = {
  navy: '#2d3e50',
  navyDark: '#243243',
  teal: '#3bacbd',
  muted: '#f2f4f7',
  border: '#cccccc',
  text: '#333333',
  sub: '#595959',
  white: '#ffffff',
}

export type PreviewContent = Record<string, string>

export type PreviewProps = { value: string; content: PreviewContent }
export type ThumbProps = { value: string }

export function Img({ style, tone = 'a' }: { style?: CSSProperties; tone?: 'a' | 'b' | 'dark' }) {
  const background =
    tone === 'dark'
      ? `linear-gradient(135deg, ${C.navy}, ${C.navyDark})`
      : tone === 'b'
        ? 'linear-gradient(135deg, rgba(59,172,189,0.35), rgba(45,62,80,0.2))'
        : 'linear-gradient(135deg, rgba(45,62,80,0.3), rgba(59,172,189,0.2))'
  return <div style={{ background, borderRadius: 4, ...style }} />
}

export function Line({ w = '100%', h = 4, color = C.border, style }: { w?: number | string; h?: number; color?: string; style?: CSSProperties }) {
  return <div style={{ width: w, height: h, background: color, borderRadius: 2, ...style }} />
}

export function Stack({ gap = 3, children, style }: { gap?: number; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>{children}</div>
}

export function ThumbFrame({ children, bg = C.white, pad = 6 }: { children: ReactNode; bg?: string; pad?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        aspectRatio: '4 / 3',
        background: bg,
        border: `1px solid ${C.border}`,
        borderRadius: 4,
        padding: pad,
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  )
}

export const previewFont: CSSProperties = {
  fontFamily: "'Open Sans', system-ui, sans-serif",
  color: C.text,
  fontSize: 13,
  lineHeight: 1.45,
}

export const displayFont: CSSProperties = {
  fontFamily: "'Montserrat', system-ui, sans-serif",
}

export function pick(content: PreviewContent, key: string, fallback: string) {
  const v = content[key]
  return typeof v === 'string' && v.trim() !== '' ? v : fallback
}
