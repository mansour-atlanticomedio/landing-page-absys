import Image from "next/image"
import { BookOpen } from "lucide-react"
import { getClient } from "@/lib/payload";
import { iconMap } from "@/lib/utils";

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
  const imageDemographicTarget = quienesSomos?.imagen_dirigidos?.url || ""
  const imageDemographicAlt = quienesSomos?.imagen_dirigidos?.alt || ""

  const ayudasTitle = quienesSomos?.ayudas?.title
  const ayudas = quienesSomos?.ayudas?.feature || []
  const dirigidosTitle = quienesSomos?.dirigidos?.title
  const dirigidos = quienesSomos?.dirigidos?.feature || []

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 gap-12 items-center">
          <div>
            {hero?.title && <h1 className="text-4xl font-extrabold text-slate-800">{hero.title}</h1>}
            {hero?.subtitle && <p className="mt-4 text-slate-600">{hero.subtitle}</p>}
          </div>
          <div className="relative h-72 rounded-lg overflow-hidden">
            {imageHeroURL !== "" && <Image src={imageHeroURL} alt={imageHeroAlt} fill className="object-cover" />}
          </div>
        </div>
      </section>

      {ayudas.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          {ayudasTitle && (
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">{ayudasTitle}</h2>
          )}
          <div className="grid grid-cols-3 gap-6">
            {ayudas.map((a: any, index: number) => {
              const IconComponent = iconMap[a.icon] || BookOpen
              return (
                <div key={a.id ?? index} className="border rounded-lg p-6">
                  <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{a.title}</h3>
                  <p className="text-sm text-slate-600">{a.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {(dirigidos.length > 0 || imageDemographicTarget !== "") && (
        <section className="bg-slate-800 text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-lg overflow-hidden">
              {imageDemographicTarget !== "" && <Image src={imageDemographicTarget} alt={imageDemographicAlt} fill className="object-cover" />}
            </div>
            <div>
              {dirigidosTitle && <h2 className="text-2xl font-bold mb-6 text-white">{dirigidosTitle}</h2>}
              <div className="space-y-4">
                {dirigidos.map((d: any, index: number) => {
                  const IconComponent = iconMap[d.icon] || BookOpen
                  return (
                    <div key={d.id ?? index} className="bg-white/5 rounded-lg p-5">
                      <div className="flex items-center gap-2 text-teal-400 font-semibold mb-1">
                        <IconComponent className="h-4 w-4" /> {d.title}
                      </div>
                      <p className="text-sm text-slate-300">{d.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
