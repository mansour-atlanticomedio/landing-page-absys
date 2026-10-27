import Link from "next/link"
import Image from "next/image"
import { BookText, CheckCircle2, KeyRound, TriangleAlert } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getClient } from "@/lib/payload"
import { iconMap } from "@/lib/icons"
import { resolveEnlace } from "@/lib/links"

// Ruta interna con Link, URL http externa con <a>
function EnlaceFlexible({ href, className, newTab, children }: { href: string; className?: string; newTab?: boolean; children: React.ReactNode }) {
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} className={className} {...(newTab !== false && { target: "_blank", rel: "noopener noreferrer" })}>{children}</a>
  }
  return <Link href={href} className={className}>{children}</Link>
}

export default async function RecursosElectronicosPage() {
  const payload = await getClient()
  const electronicResources = await payload.findGlobal({
    slug: 'electronic_resources' as never,
    draft: false,
    depth: 2
  }) as any

  const layout = await payload.findGlobal({ slug: 'layout' as never, depth: 0 }) as any
  const hero = electronicResources?.hero || null
  const heroImageURL = hero?.background_image?.url || null

  const accesosDestacados = electronicResources?.accesos_destacados?.accesos || []
  const remoto = electronicResources?.acceso_remoto || null
  const problema = electronicResources?.problema_acceso || null
  const problemaEnlace = resolveEnlace(problema, layout?.enlaces_externos)
  const categorias = (electronicResources?.categorias || []).filter((c: any) => c?.nombre && c?.recursos?.length > 0)

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          {hero?.title && <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">{hero.title}</h1>}
          {hero?.subtitle && <p className="mt-4 text-slate-600">{hero.subtitle}</p>}
        </div>
        {heroImageURL && (
          <div className="relative h-56 sm:h-72 rounded-lg overflow-hidden">
            <Image src={heroImageURL} alt="" fill className="object-cover" />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        {electronicResources?.accesos_titulo && (
          <h2 className="text-2xl font-bold text-slate-800 mb-8">{electronicResources.accesos_titulo}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accesosDestacados.map((a: any, index: number) => {
            const IconComponent = iconMap[a.icon] || BookText
            return (
              <div key={a.title ?? index} className="border rounded-lg p-6">
                <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{a.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{a.description}</p>
                {a.link && (
                  <a href={a.link} className="text-sm text-teal-700 font-medium">
                    {a.cta || "Acceder"} →
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {remoto?.titulo && (
          <div className="mt-8 bg-slate-50 border rounded-lg p-5 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-3">{remoto.titulo}</h3>
              {remoto.descripcion && <p className="text-sm text-slate-600 mb-4">{remoto.descripcion}</p>}
              {remoto.puntos?.length > 0 && (
                <ul className="space-y-2 text-sm text-slate-600">
                  {remoto.puntos.map((p: any, i: number) => (
                    <li key={p.id ?? i} className="flex gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" /> {p.texto}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(remoto.portal_titulo || remoto.portal_boton_texto) && (
              <div className="bg-white border rounded-lg p-6 text-center">
                <KeyRound className="h-6 w-6 mx-auto text-slate-800 mb-3" />
                {remoto.portal_titulo && <p className="font-bold text-slate-800">{remoto.portal_titulo}</p>}
                {remoto.portal_descripcion && <p className="text-sm text-slate-600 my-3">{remoto.portal_descripcion}</p>}
                {remoto.portal_boton_texto && remoto.portal_boton_enlace && (
                  <EnlaceFlexible
                    href={remoto.portal_boton_enlace}
                    className="block w-full bg-teal-700 text-white rounded-md py-2.5 font-medium cursor-pointer"
                  >
                    {remoto.portal_boton_texto}
                  </EnlaceFlexible>
                )}
              </div>
            )}
          </div>
        )}

        {categorias.length > 0 && (
          <div className="mt-12">
            {electronicResources?.categorias_titulo && (
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{electronicResources.categorias_titulo}</h2>
            )}
            <Tabs defaultValue="cat-0">
              <TabsList className="flex-wrap h-auto">
                {categorias.map((c: any, i: number) => (
                  <TabsTrigger key={c.id ?? i} value={`cat-${i}`}>{c.nombre}</TabsTrigger>
                ))}
              </TabsList>
              {categorias.map((c: any, i: number) => (
                <TabsContent key={c.id ?? i} value={`cat-${i}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {c.recursos.map((r: any, j: number) => (
                      <div key={r.id ?? j} className="border rounded-lg p-6">
                        <span
                          className={`inline-block text-xs font-medium rounded-md px-2 py-1 mb-3 ${
                            r.acceso === "open" ? "bg-teal-50 text-teal-700" : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {r.acceso === "open" ? "Acceso abierto" : "Suscripción"}
                        </span>
                        <h3 className="font-bold text-slate-800 mb-2">
                          {r.enlace ? (
                            <EnlaceFlexible href={r.enlace} className="hover:text-teal-700">{r.nombre}</EnlaceFlexible>
                          ) : (
                            r.nombre
                          )}
                        </h3>
                        {r.descripcion && <p className="text-sm text-slate-600">{r.descripcion}</p>}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {problema?.texto && problemaEnlace.href && (
          <div className="mt-8 flex justify-center">
            <EnlaceFlexible
              href={problemaEnlace.href}
              newTab={problemaEnlace.newTab}
              className="border rounded-md px-5 py-3 font-medium text-slate-800 flex items-center gap-2"
            >
              <TriangleAlert className="h-4 w-4" /> {problema.texto}
            </EnlaceFlexible>
          </div>
        )}
      </section>
    </div>
  );
}
