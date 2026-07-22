import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";
import Image from "next/image";
import {
  Search,
  Megaphone,
  Lock,
  Fingerprint,
  BarChart3,
  HeartHandshake,
  BookOpenCheck,
  Landmark,
  Mail,
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Investigation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'investigation' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || "";
  const title = heroData?.title || "";
  const subtitle = heroData?.subtitle || "";
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';

  const ACCESOS_RAPIDOS = [
    { icon: Search, label: "Buscar información" },
    { icon: Megaphone, label: "Publicar y difundir" },
    { icon: Lock, label: "Acceso abierto" },
    { icon: Fingerprint, label: "Perfiles académicos" },
    { icon: BarChart3, label: "Indicadores" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="INVESTIGACIÓN" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">Apoyo a la investigación</h1>
          <p className="mt-4 text-slate-600">
            La Biblioteca reúne recursos y orientaciones para facilitar la búsqueda de
            información científica, la publicación y difusión de resultados, el acceso abierto y
            la gestión de la identidad investigadora. Este espacio se ampliará progresivamente
            con guías, documentos y enlaces adaptados a las necesidades del personal docente e
            investigador de la Universidad.
          </p>
        </div>
        <div className="relative h-72 rounded-lg overflow-hidden">
          <Image src="/img/investigacion-hero.jpg" alt="" fill className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="bg-slate-50 border rounded-lg p-6 mb-8">
          <h2 className="font-bold text-slate-800 mb-4">Accesos rápidos</h2>
          <div className="flex flex-wrap gap-3">
            {ACCESOS_RAPIDOS.map((a) => (
              <button
                key={a.label}
                className="border bg-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 text-slate-700"
              >
                <a.icon className="h-4 w-4" /> {a.label}
              </button>
            ))}
            <button className="bg-slate-800 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" /> Solicitar apoyo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
              <Search className="h-4 w-4" /> Buscar información científica
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Accede a recursos para localizar publicaciones, revisar antecedentes y desarrollar
              búsquedas bibliográficas de forma sistemática.
            </p>
            <button className="w-full bg-slate-100 rounded-md py-2.5 text-sm font-medium text-slate-700 flex items-center justify-center gap-2">
              <BookOpenCheck className="h-4 w-4" /> Acceder a Recursos electrónicos
            </button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
              <Megaphone className="h-4 w-4" /> Publicar y difundir
            </h3>
            <p className="text-sm text-slate-600">
              Consulta orientaciones para seleccionar revistas, revisar sus características,
              conocer sus condiciones de publicación y mejorar la difusión de los resultados.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
              <Lock className="h-4 w-4" /> Acceso abierto y repositorio
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Encuentra información sobre repositorios, versiones de los documentos, licencias,
              derechos de autor y posibilidades de difusión en acceso abierto.
            </p>
            <button className="w-full bg-slate-100 rounded-md py-2.5 text-sm font-medium text-slate-700 flex items-center justify-center gap-2">
              <Landmark className="h-4 w-4" /> Acceder al Repositorio institucional
            </button>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
              <Fingerprint className="h-4 w-4" /> Firma, ORCID y perfiles académicos
            </h3>
            <p className="text-sm text-slate-600">
              Consulta recomendaciones para utilizar una firma coherente, indicar correctamente
              la afiliación institucional y mantener actualizados los identificadores y perfiles
              académicos.
            </p>
          </div>

          <div className="border rounded-lg p-6 col-span-2">
            <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
              <BarChart3 className="h-4 w-4" /> Indicadores y evaluación de la investigación
            </h3>
            <p className="text-sm text-slate-600">
              Accede a fuentes de información relacionadas con citación, impacto, acreditaciones
              y sexenios. La Biblioteca ofrece orientación sobre los recursos disponibles, pero
              no interpreta convocatorias ni garantiza resultados en los procesos de evaluación.
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 col-span-2">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <HeartHandshake className="h-4 w-4" /> Solicitar apoyo
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Puedes contactar con la Biblioteca para realizar consultas sobre búsqueda
              bibliográfica, acceso a bases de datos y utilización de los recursos disponibles.
            </p>
            <button className="bg-teal-700 text-white rounded-md px-5 py-2.5 text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" /> Solicitar apoyo
            </button>
          </div>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}