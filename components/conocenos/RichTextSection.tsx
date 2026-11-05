import { RichText } from "@payloadcms/richtext-lexical/react"
import { isRichTextEmpty } from "@/lib/rich-text"

export function RichTextSection({ block }: { block: any }) {
  if (isRichTextEmpty(block?.content)) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      {block.title && <h2 className="font-display text-2xl font-bold text-primary mb-4">{block.title}</h2>}
      <div className="prose max-w-none text-slate-700">
        <RichText data={block.content} />
      </div>
    </section>
  )
}
