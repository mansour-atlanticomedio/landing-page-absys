import Image from "next/image"
import { BookOpen } from "lucide-react"
import { iconMap } from "@/lib/icons"

export function CardsFeaturesSection({ block }: { block: any }) {
  const items: any[] = block?.features?.feature || []
  const title = block?.title || block?.features?.title
  const image = block?.image?.url
  const muted = block?.style === "muted"
  if (items.length === 0 && !image) return null

  const cards = muted ? (
    <div className="space-y-4">
      {items.map((d, i) => {
        const Icon = iconMap[d.icon] || BookOpen
        return (
          <div key={d.id ?? i} className="bg-white/5 rounded-lg p-5">
            <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
              <Icon className="h-4 w-4" /> {d.title}
            </div>
            {d.description && <p className="text-sm text-slate-300">{d.description}</p>}
          </div>
        )
      })}
    </div>
  ) : (
    <div className={`grid grid-cols-1 gap-6 ${image ? "sm:grid-cols-2" : "md:grid-cols-3"}`}>
      {items.map((a, i) => {
        const Icon = iconMap[a.icon] || BookOpen
        return (
          <div key={a.id ?? i} className="border rounded-lg p-6">
            <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{a.title}</h3>
            {a.description && <p className="text-sm text-slate-600">{a.description}</p>}
          </div>
        )
      })}
    </div>
  )

  const heading = title && (
    <h2 className={`font-display text-2xl font-bold mb-8 ${muted ? "text-white" : "text-primary"} ${image ? "" : "text-center"}`}>
      {title}
    </h2>
  )

  return (
    <section className={muted ? "bg-slate-800 text-white" : "bg-white"}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        {image ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src={image} alt={block.image?.alt || ""} fill className="object-cover" />
            </div>
            <div>
              {heading}
              {cards}
            </div>
          </div>
        ) : (
          <>
            {heading}
            {cards}
          </>
        )}
      </div>
    </section>
  )
}
