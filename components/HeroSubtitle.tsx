import { RichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'
import { isRichTextEmpty, type RichValue } from '@/lib/rich-text'

type Props = { value?: RichValue | null; className?: string }

export default function HeroSubtitle({ value, className }: Props) {
  if (isRichTextEmpty(value)) return null
  return (
    <div className={cn('[&_p+p]:mt-2 [&_a]:underline [&_a]:underline-offset-2', className)}>
      {typeof value === 'string' ? <p>{value}</p> : <RichText data={value as any} />}
    </div>
  )
}
