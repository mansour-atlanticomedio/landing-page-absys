import Image from "next/image"
import { getClient } from "@/lib/payload"
import { ConocenosBlocks } from "@/components/conocenos/ConocenosBlocks"

export default async function QuienesSomosPage() {
  const payload = await getClient()
  const aboutUs = await payload.findGlobal({
    slug: 'about_us' as never,
    draft: false,
    depth: 5
  }) as any

  const quienesSomos = aboutUs?.quienes_somos
  const hero = quienesSomos?.hero || null
  const imageHeroURL = hero?.background_image?.url || ""
  const imageHeroAlt = hero?.background_image?.alt || ""

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            {hero?.title && <h1 className="text-4xl font-extrabold text-slate-800">{hero.title}</h1>}
            {hero?.subtitle && <p className="mt-4 text-slate-600">{hero.subtitle}</p>}
          </div>
          {imageHeroURL !== "" && (
            <div className="relative h-72 rounded-lg overflow-hidden">
              <Image src={imageHeroURL} alt={imageHeroAlt} fill className="object-cover" />
            </div>
          )}
        </div>
      </section>

      <ConocenosBlocks layout={quienesSomos?.layout} />
    </div>
  );
}
