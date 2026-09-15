import Image from "next/image";
import Link from "next/link";
import { Info, Clock, MapPin, HelpCircle as PhoneHelp, Mail, Navigation, CircleHelp } from "lucide-react";
import { getClient } from "@/lib/payload";

const SCHEDULE_FALLBACK = [
  { day: "Lunes a viernes", hours: "08:00 - 20:00", type: "regular" },
  { day: "Sábados", hours: "09:00 - 14:00", type: "regular" },
  { day: "Domingos y festivos", hours: "Cerrado", type: "closed" },
  { day: "Período de exámenes", hours: "08:00 - 22:00", type: "extended" },
  { day: "Vacaciones", hours: "09:00 - 15:00", type: "holiday" },
];

const AYUDA_CTA_FALLBACK = {
  title: "¿Necesitas ayuda adicional?",
  subtitle: "Consulta nuestras preguntas frecuentes o solicita una cita con un bibliotecario.",
  button_cta: "Ver FAQs",
  button_link: "/contacto",
};

const SCHEDULE_TYPE_STYLES: Record<string, string> = {
  regular: "text-slate-600",
  closed: "text-red-600 font-medium",
  extended: "text-teal-700 font-medium",
  holiday: "text-amber-700 font-medium",
};

export default async function HorariosUbicacionContactoPage() {
  const payload = await getClient();
  const homepage = await payload.findGlobal({
    slug: "horarios_contacto" as never,
    draft: false,
    depth: 2,
  }) as any;

  const heroData = homepage?.hero;
  const title = heroData?.title || "Horarios, ubicación y contacto";
  const subtitle =
    heroData?.subtitle ||
    "Encuentra toda la información necesaria para visitar nuestras instalaciones o ponerte en contacto con el equipo de la Biblioteca Universitaria.";
  const imageHeroURL = heroData?.background_image?.url || "";

  const edificioNombre = homepage?.edificio_nombre || "Edificio EMU de Usos Múltiples";
  const edificioSubtitulo = homepage?.edificio_subtitulo || "🏛 Campus Universitario";

  const schedule = homepage?.horario?.schedule?.length ? homepage.horario.schedule : SCHEDULE_FALLBACK;

  const direccionLinea1 = homepage?.direccion_linea1 || "Edificio EMU de Usos Múltiples";
  const direccionLinea2 = homepage?.direccion_linea2 || "Carretera de Quilmes, 37";
  const telefono = homepage?.telefono || "+34 828 019 019";
  const email = homepage?.email || "biblioteca@atlanticomedio.es";
  const mapaUrl =
    homepage?.mapa_url ||
    "https://www.google.com/maps?ll=28.069492,-15.451801&z=16&t=m&hl=es&gl=ES&mapclient=embed&cid=2474455529394761746";
  const mapaEmbedUrl =
    homepage?.mapa_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.3405726995734!2d-15.452000045269175!3d28.06915669043545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc409577ccdecaa7%3A0x225708319a137012!2sUniversidad%20del%20Atl%C3%A1ntico%20Medio%20(UNAM)!5e0!3m2!1ses!2ses!4v1784738876377!5m2!1ses!2ses";

  const ayudaCta = homepage?.ayuda_cta || AYUDA_CTA_FALLBACK;

  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="CONÓCENOS" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-4xl font-extrabold text-slate-800">{title}</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">{subtitle}</p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <Info className="h-5 w-5 text-teal-600" /> Información General
            </h2>

            <div className="flex gap-3 mb-5">
              <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-slate-800 mb-2">Horario de atención</p>
                <div className="space-y-1">
                  {schedule.map((s: any, index: number) => (
                    <div key={s.day ?? index} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-600">{s.day}</span>
                      <span className={SCHEDULE_TYPE_STYLES[s.type] || "text-slate-600"}>{s.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Ubicación</p>
                <p className="text-sm text-slate-600">{direccionLinea1}</p>
                <p className="text-sm text-slate-600">{direccionLinea2}</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <PhoneHelp className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Contacto Directo</p>
                <p className="text-sm text-slate-600">{telefono}</p>
                <a href={`mailto:${email}`} className="transition-colors hover:text-teal-900">
                  <p className="text-sm text-teal-700 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </p>
                </a>
              </div>
            </div>

            <a href={`mailto:${email}`}>
              <button className="w-full bg-slate-800 text-white rounded-md py-2.5 font-medium flex items-center justify-center gap-2 mb-3 transition-transform hover:scale-[1.05] cursor-pointer">
                <Mail className="h-4 w-4" /> Contactar con la Biblioteca
              </button>
            </a>
            <a href={mapaUrl}>
              <button className="w-full border rounded-md py-2.5 font-medium flex items-center justify-center gap-2 text-slate-800 cursor-pointer transition-colors hover:bg-teal-500 hover:text-white">
                <Navigation className="h-4 w-4" /> Cómo llegar
              </button>
            </a>
          </div>

          <div className="space-y-6">
            <div className="relative h-72 rounded-lg overflow-hidden">
              {imageHeroURL !== "" && <Image src={imageHeroURL} alt="" fill className="object-cover" />}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                <p className="font-bold text-lg">{edificioNombre}</p>
                <p className="text-sm">{edificioSubtitulo}</p>
              </div>
            </div>
            <div className="relative h-72 rounded-lg overflow-hidden bg-slate-100">
              <iframe src={mapaEmbedUrl} className="w-full h-full" loading="lazy"></iframe>
            </div>
          </div>
        </div>

        <div className="mt-10 border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center shrink-0">
              <CircleHelp className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{ayudaCta.title}</p>
              <p className="text-sm text-slate-600">{ayudaCta.subtitle}</p>
            </div>
          </div>
          <Link href={ayudaCta.button_link || "/contacto"}>
            <button className="border rounded-md px-5 py-2.5 font-medium text-slate-800 cursor-pointer transition-colors hover:scale-[1.05] hover:bg-slate-700 hover:text-white">
              {ayudaCta.button_cta}
            </button>
          </Link>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
