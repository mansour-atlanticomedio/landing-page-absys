import Image from "next/image"
import type { PayloadImage } from "@/types/common.type"
import Hero from "@/components/Hero"
import HeroCarrousel from "@/components/heroCarrusel"
import HeroSubtitle from "@/components/HeroSubtitle"
import { HERO_FALLBACK_IMAGE } from "@/lib/images"
import type { RichValue } from "@/lib/rich-text"

interface PageHeroProps {
  variant?: "simple" | "split" | "banner" | "carousel" | null
  hero?: {
    title?: string | null
    subtitle?: RichValue | null
    background_image?: PayloadImage | null
    pretitle?: string | null
    button_cta?: string | null
    input_placeholder?: string | null
  } | null
  carousel?: { items?: any[] | null } | null
  fallbackTitle?: string | null
}

export function PageHero({ variant, hero, carousel, fallbackTitle }: PageHeroProps) {
  const image = hero?.background_image
  const title = hero?.title || fallbackTitle

  if (variant === "carousel") {
    const items = (carousel?.items ?? []).filter(Boolean)
    return items.length ? <HeroCarrousel title="" items={items} /> : null
  }

  if (variant === "banner") {
    return (
      <Hero
        pretitle={hero?.pretitle ?? undefined}
        title={hero?.title ?? ""}
        subtitle={hero?.subtitle}
        image={image?.url || HERO_FALLBACK_IMAGE}
        buttonText={hero?.button_cta ?? undefined}
        inputPlaceHolder={hero?.input_placeholder ?? undefined}
      />
    )
  }

  if (variant === "split") {
    return (
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            {title && <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800">{title}</h1>}
            <HeroSubtitle value={hero?.subtitle} className="mt-4 text-slate-600" />
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
      <HeroSubtitle value={hero?.subtitle} className="mt-3 text-slate-600 max-w-3xl" />
    </section>
  )
}
