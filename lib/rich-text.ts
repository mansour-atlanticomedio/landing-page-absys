export type RichValue = string | Record<string, any>

const textNode = (text: string) => ({ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 })

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: text ? [textNode(text)] : [],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  textFormat: 0,
})

export function lexicalFromText(text: string) {
  const lines = text.split(/\r?\n/)
  return {
    root: { type: 'root', children: lines.map(paragraph), direction: 'ltr', format: '', indent: 0, version: 1 },
  }
}

function collectText(node: any, out: string[]) {
  if (!node || typeof node !== 'object') return
  if (typeof node.text === 'string') out.push(node.text)
  if (node.type === 'linebreak') out.push(' ')
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectText(child, out)
    if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listitem') out.push(' ')
  }
}

export function lexicalToPlainText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  const out: string[] = []
  collectText((value as any)?.root, out)
  return out.join('').replace(/\s+/g, ' ').trim()
}

export function isRichTextEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  const root = (value as any)?.root
  if (!root) return true
  return lexicalToPlainText(value) === '' && !JSON.stringify(root).match(/"type":"(upload|relationship|block|horizontalrule)"/)
}

export function normalizeSubtitle(value: unknown, fallback?: string): RichValue | undefined {
  if (!isRichTextEmpty(value)) return value as RichValue
  return fallback || undefined
}
