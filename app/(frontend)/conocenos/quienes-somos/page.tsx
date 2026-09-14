import Image from "next/image"
import { BookOpen } from "lucide-react"
import { getClient } from "@/lib/payload";
import { iconMap } from "@/lib/utils";

// const teamMembers = [
//   { name: "Dra. María García", role: "Directora de Biblioteca", image: "/team/directora.jpg" },
//   { name: "Lic. Carlos López", role: "Coordinador de Servicios", image: "/team/coordinador.jpg" },
//   { name: "Mtra. Ana Martínez", role: "Bibliotecóloga", image: "/team/bibliotecologa.jpg" },
//   { name: "Ing. Roberto Sánchez", role: "Sistemas Digitales", image: "/team/sistemas.jpg" },
// ]

const AYUDAS_FALLBACK = [
  {
    icon: "BookOpen",
    title: "Apoyo al aprendizaje",
    description: "Proporcionamos espacios de estudio, recursos bibliográficos actualizados y asesoramiento personalizado para asegurar el éxito en tu trayectoria académica.",
  },
  {
    icon: "User",
    title: "Apoyo a la docencia",
    description: "Colaboramos con el profesorado en la creación de materiales, gestión de bibliografía recomendada y herramientas para la innovación educativa.",
  },
  {
    icon: "Microscope",
    title: "Apoyo a la investigación",
    description: "Ofrecemos servicios especializados en publicación científica, gestión de datos, métricas y acceso a bases de datos de alto impacto.",
  },
];

const DIRIGIDOS_FALLBACK = [
  {
    icon: "BookOpen",
    title: "Estudiantes",
    description: "Acceso a manuales, salas de trabajo en grupo, portátiles de préstamo y cursos de competencias informacionales.",
  },
  {
    icon: "Briefcase",
    title: "PDI (Personal Docente e Investigador)",
    description: "Asesoría en acreditaciones, repositorios institucionales, gestión de referencias y adquisición de recursos especializados.",
  },
  {
    icon: "User",
    title: "PAS (Personal de Administración y Servicios)",
    description: "Servicios de préstamo general, acceso a colecciones de ocio y recursos para el desarrollo profesional continuo.",
  },
];

export default async function QuienesSomosPage() {
  const payload = await getClient()
  const quienesSomos = await payload.findGlobal({
    slug: 'quienes_somos' as never,
    draft: false,
    depth: 2
  }) as any

  const hero = quienesSomos?.hero || null
  const imageHeroURL = hero?.background_image?.url || ""
  const heroTitle = hero?.title || "Quiénes somos"
  const heroSubtitle =
    hero?.subtitle ||
    "La Biblioteca Universitaria es un servicio de apoyo al aprendizaje, la docencia y la investigación, comprometido con la excelencia académica y el desarrollo integral de nuestra comunidad."

  const imageDemographicTarget = quienesSomos?.imagen_dirigidos?.url || ""

  const ayudas = quienesSomos?.ayudas?.feature?.length ? quienesSomos.ayudas.feature : AYUDAS_FALLBACK
  const dirigidos = quienesSomos?.dirigidos?.feature?.length ? quienesSomos.dirigidos.feature : DIRIGIDOS_FALLBACK

  console.log("Info: ", imageHeroURL)

  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="CONÓCENOS" /> */}

      <section className="bg-gradient-to-b from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">{heroTitle}</h1>
            <p className="mt-4 text-slate-600">{heroSubtitle}</p>
          </div>
          <div className="relative h-72 rounded-lg overflow-hidden">
            { imageHeroURL != "" && <Image src={imageHeroURL} alt="" fill className="object-cover" />}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          ¿Cómo podemos ayudarte?
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {ayudas.map((a: any, index: number) => {
            const IconComponent = iconMap[a.icon] || BookOpen
            return (
              <div key={a.title ?? index} className="border rounded-lg p-6">
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

      <section className="bg-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-lg overflow-hidden">
            { imageDemographicTarget != "" && <Image src={imageDemographicTarget} alt="" fill className="object-cover" />}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">A quién se dirigen nuestros servicios</h2>
            <div className="space-y-4">
              {dirigidos.map((d: any, index: number) => {
                const IconComponent = iconMap[d.icon] || BookOpen
                return (
                  <div key={d.title ?? index} className="bg-white/5 rounded-lg p-5">
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

      {/* <SiteFooter /> */}
    </div>
  );
}
