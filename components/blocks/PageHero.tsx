import Image from "next/image"
import type { PayloadImage } from "@/types/common.type"

interface PageHeroProps {
  variant?: "simple" | "split" | null
  hero?: {
    title?: string | null
    subtitle?: string | null
    background_image?: PayloadImage | null
  } | null
  fallbackTitle?: string | null
}

export function PageHero({ variant, hero, fallbackTitle }: PageHeroProps) {
  const image = hero?.background_image
  const title = hero?.title || fallbackTitle

  if (variant === "split") {
    return (
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            {title && <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800">{title}</h1>}
            {hero?.subtitle && <p className="mt-4 text-slate-600">{hero.subtitle}</p>}
          </div>
          {image?.url && (
            <div className="relative h-56 sm:h-72 rounded-lg overflow-hidden">
              <Image src={image.url} alt={image.alt || ""} fill className="object-cover" />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pt-14 pb-4">
      {title && <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800">{title}</h1>}
      {hero?.subtitle && <p className="mt-3 text-slate-600 max-w-3xl">{hero.subtitle}</p>}
    </section>
  )
}
