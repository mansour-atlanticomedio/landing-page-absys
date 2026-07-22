import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";
import Image from "next/image";
import { Search, CalendarCheck, BookOpen, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Formation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'formation' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || ""
  const title = heroData?.title || "";
  const subtitle = heroData?.subtitle || ""
  const buttonText = heroData?.button_cta || ""
  const inputPlaceHolder = heroData?.input_placeholder || ""

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg'

  return (
      <div className="min-h-screen bg-white">
        {/* <SiteHeader active="FORMACIÓN" /> */}
  
        <section className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">Formación</h1>
            <div className="w-10 h-1 bg-teal-700 my-4" />
            <p className="text-slate-600 mb-4">
              La Biblioteca ofrece recursos de apoyo para desarrollar las competencias necesarias
              para buscar, evaluar, utilizar y comunicar información académica de manera eficaz,
              crítica y responsable.
            </p>
            <p className="text-slate-600">
              En esta página se incorporarán progresivamente guías, tutoriales, documentos y
              actividades formativas dirigidas a la comunidad universitaria.
            </p>
          </div>
          <div className="relative h-72 rounded-lg overflow-hidden">
            <Image src="/img/formacion-hero.jpg" alt="" fill className="object-cover" />
          </div>
        </section>
  
        <section className="mx-auto max-w-6xl px-6 pb-14 grid grid-cols-[1fr_320px] gap-10">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-slate-800 text-xl mb-6">
              <Search className="h-5 w-5 text-indigo-500" /> Buscar y evaluar información
            </h2>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <p className="text-sm text-slate-600">
                Una búsqueda eficaz comienza con la definición clara del tema, la selección de
                palabras clave y la elección del recurso más adecuado.
              </p>
              <p className="text-sm text-slate-600">
                Antes de utilizar una fuente, revisa su autoría, actualidad, procedencia, finalidad
                y relación con el tema que estás trabajando.
              </p>
            </div>
            <div className="flex gap-8 text-sm font-medium text-teal-700 mb-10">
              <a href="#" className="flex items-center gap-1">
                → Recomendaciones sobre búsqueda y evaluación
              </a>
              <a href="#" className="flex items-center gap-1">
                → Acceso a Recursos electrónicos
              </a>
            </div>
  
            <div className="bg-slate-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Citar correctamente y evitar el plagio
              </h3>
              <p className="text-slate-600 mb-3">
                Citar permite reconocer las ideas, datos y materiales procedentes de otras fuentes,
                diferenciar las aportaciones propias y facilitar que otras personas puedan
                localizar la información original.
              </p>
              <p className="text-sm text-slate-600 mb-6">
                Anota los datos bibliográficos durante la búsqueda, utiliza el estilo de citación
                requerido y revisa que todas las citas aparezcan recogidas en la lista final de
                referencias.
              </p>
              <button className="border rounded-md px-5 py-2.5 text-sm font-medium text-slate-800 flex items-center gap-2">
                Recomendaciones sobre citación y plagio <ArrowRight className="h-4 w-4" />
              </button>
            </div>
  
            <h2 className="text-2xl font-bold text-slate-800 border-t mt-12 pt-8 mb-2">
              Guías y tutoriales
            </h2>
            <p className="text-slate-600 mb-6">
              En este espacio encontrarás materiales breves y prácticos sobre el uso del catálogo,
              el acceso a recursos electrónicos, la búsqueda bibliográfica, la evaluación de
              fuentes y la citación académica.
            </p>
            <div className="border rounded-lg p-5 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Acceder a guías y tutoriales disponibles</p>
                  <p className="text-sm text-slate-600">Colección de recursos de autoaprendizaje</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>
  
          <aside>
            <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-4">
              <CalendarCheck className="h-4 w-4" /> ACTIVIDADES FORMATIVAS
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              La Biblioteca podrá organizar sesiones y talleres relacionados con el uso del
              catálogo, las bases de datos, la búsqueda de información y la citación académica.
            </p>
            <p className="text-sm font-bold text-slate-800 mb-2">● Estado actual</p>
            <p className="text-sm text-slate-600">
              Actualmente no hay actividades formativas programadas. Las nuevas sesiones se
              anunciarán en esta página.
            </p>
          </aside>
        </section>
  
        {/* <SiteFooter /> */}
      </div>
    );
}