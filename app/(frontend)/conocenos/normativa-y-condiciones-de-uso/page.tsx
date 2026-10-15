import { Download, AlertTriangle, FileText } from "lucide-react"
import { getClient } from "@/lib/payload"
import { iconMap } from "@/lib/utils"
import { appPath } from "@/lib/auth/redirects"

const withBasePath = (url: string) =>
  url.startsWith("/") && !url.startsWith(appPath("/")) ? appPath(url) : url

export default async function NormativaPage() {
  const payload = await getClient()
  const aboutUs = await payload.findGlobal({
    slug: 'about_us' as never,
    draft: false,
    depth: 5
  }) as any

  const normativa = aboutUs?.normativa
  const hero = normativa?.hero
  const tarjetas: any[] = normativa?.tarjetas || []
  const pdfUrl: string = normativa?.pdf?.url ? withBasePath(normativa.pdf.url) : ""

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        {hero?.title && <h1 className="text-4xl font-extrabold text-slate-800">{hero.title}</h1>}
        {hero?.subtitle && <p className="mt-3 text-slate-600 max-w-3xl">{hero.subtitle}</p>}

        {tarjetas.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-6">
            {tarjetas.map((t: any, index: number) => {
              const IconComponent = iconMap[t.icon] || FileText
              const puntos: any[] = t.puntos || []
              return (
                <div key={t.id ?? index} className={`border rounded-lg p-6${t.badge ? " relative" : ""}`}>
                  {t.badge && (
                    <span className="absolute top-6 right-6 bg-slate-800 text-white text-xs rounded-full px-3 py-1">
                      {t.badge}
                    </span>
                  )}
                  <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <h2 className={`font-bold text-slate-800 ${puntos.length > 0 ? "mb-4" : "mb-2"}`}>{t.title}</h2>
                  {t.description && (
                    <p className={`text-sm text-slate-600${t.nota_texto ? " mb-4" : ""}`}>{t.description}</p>
                  )}
                  {puntos.length > 0 && (
                    <ul className="space-y-3 text-sm text-slate-600">
                      {puntos.map((p: any, i: number) => (
                        <li key={p.id ?? i}>✓ {p.texto}</li>
                      ))}
                    </ul>
                  )}
                  {t.nota_texto && (
                    <div className="bg-slate-50 border rounded-md p-4">
                      {t.nota_titulo && <p className="text-sm font-semibold text-slate-800 mb-1">{t.nota_titulo}</p>}
                      <p className="text-sm text-slate-600">{t.nota_texto}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {normativa?.responsabilidad_texto && (
          <div className="mt-6 border rounded-lg p-6">
            {normativa.responsabilidad_titulo && (
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500" /> {normativa.responsabilidad_titulo}
              </h2>
            )}
            <p className="text-sm text-slate-600">{normativa.responsabilidad_texto}</p>
          </div>
        )}

        {pdfUrl && normativa?.pdf_texto_boton && (
          <div className="mt-10 flex justify-center">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 text-white rounded-md px-6 py-3 font-medium flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" /> {normativa.pdf_texto_boton}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
