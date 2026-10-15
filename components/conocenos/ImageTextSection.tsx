import Image from "next/image"
import { RichText } from "@payloadcms/richtext-lexical/react"

export function ImageTextSection({ block }: { block: any }) {
  const image = block?.image?.url
  if (!image && !block?.title && !block?.text) return null
  const right = block?.image_position === "right"
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className={`grid grid-cols-1 gap-12 items-center ${image ? "md:grid-cols-2" : ""}`}>
        {image && (
          <div className={`relative h-80 rounded-lg overflow-hidden ${right ? "md:order-2" : ""}`}>
            <Image src={image} alt={block.image?.alt || ""} fill className="object-cover" />
          </div>
        )}
        <div>
          {block.title && <h2 className="font-display text-2xl font-bold text-primary mb-4">{block.title}</h2>}
          {block.text && (
            <div className="text-slate-600">
              <RichText data={block.text} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
