import Image from "next/image";
import Link from "next/link";
import { Info, Clock, MapPin, HelpCircle as PhoneHelp, Mail, Navigation, CircleHelp } from "lucide-react";
import { getClient } from "@/lib/payload";

const SCHEDULE_TYPE_STYLES: Record<string, string> = {
  regular: "text-slate-600",
  closed: "text-red-600 font-medium",
  extended: "text-teal-700 font-medium",
  holiday: "text-amber-700 font-medium",
};

export default async function HorariosUbicacionContactoPage() {
  const payload = await getClient();
  const aboutUs = await payload.findGlobal({
    slug: "about_us" as never,
    draft: false,
    depth: 5,
  }) as any;

  const h = aboutUs?.horarios;
  const heroData = h?.hero;
  const imageHeroURL = heroData?.background_image?.url || "";
  const imageHeroAlt = heroData?.background_image?.alt || "";
  const schedule = h?.horario?.schedule || [];
  const ayudaCta = h?.ayuda_cta;

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        {heroData?.title && <h1 className="text-4xl font-extrabold text-slate-800">{heroData.title}</h1>}
        {heroData?.subtitle && <p className="mt-3 text-slate-600 max-w-2xl">{heroData.subtitle}</p>}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <div className="border rounded-lg p-6">
            {h?.info_titulo && (
              <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                <Info className="h-5 w-5 text-teal-600" /> {h.info_titulo}
              </h2>
            )}

            {(h?.horario_titulo || schedule.length > 0) && (
              <div className="flex gap-3 mb-5">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                <div className="flex-1">
                  {h?.horario_titulo && <p className="font-semibold text-slate-800 mb-2">{h.horario_titulo}</p>}
                  <div className="space-y-1">
                    {schedule.map((s: any, index: number) => (
                      <div key={s.id ?? index} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-600">{s.day}</span>
                        <span className={SCHEDULE_TYPE_STYLES[s.type] || "text-slate-600"}>{s.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(h?.direccion_linea1 || h?.direccion_linea2) && (
              <div className="flex gap-3 mb-5">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  {h?.ubicacion_titulo && <p className="font-semibold text-slate-800">{h.ubicacion_titulo}</p>}
                  {h?.direccion_linea1 && <p className="text-sm text-slate-600">{h.direccion_linea1}</p>}
                  {h?.direccion_linea2 && <p className="text-sm text-slate-600">{h.direccion_linea2}</p>}
                </div>
              </div>
            )}

            {(h?.telefono || h?.email) && (
              <div className="flex gap-3 mb-6">
                <PhoneHelp className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  {h?.contacto_titulo && <p className="font-semibold text-slate-800">{h.contacto_titulo}</p>}
                  {h?.telefono && <p className="text-sm text-slate-600">{h.telefono}</p>}
                  {h?.email && (
                    <a href={`mailto:${h.email}`} className="transition-colors hover:text-teal-900">
                      <p className="text-sm text-teal-700 flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {h.email}
                      </p>
                    </a>
                  )}
                </div>
              </div>
            )}

            {h?.email && h?.boton_contactar && (
              <a href={`mailto:${h.email}`}>
                <button className="w-full bg-slate-800 text-white rounded-md py-2.5 font-medium flex items-center justify-center gap-2 mb-3 transition-transform hover:scale-[1.05] cursor-pointer">
                  <Mail className="h-4 w-4" /> {h.boton_contactar}
                </button>
              </a>
            )}
            {h?.mapa_url && h?.boton_como_llegar && (
              <a href={h.mapa_url}>
                <button className="w-full border rounded-md py-2.5 font-medium flex items-center justify-center gap-2 text-slate-800 cursor-pointer transition-colors hover:bg-teal-500 hover:text-white">
                  <Navigation className="h-4 w-4" /> {h.boton_como_llegar}
                </button>
              </a>
            )}
          </div>

          <div className="space-y-6">
            {(imageHeroURL !== "" || h?.edificio_nombre) && (
              <div className="relative h-72 rounded-lg overflow-hidden">
                {imageHeroURL !== "" && <Image src={imageHeroURL} alt={imageHeroAlt} fill className="object-cover" />}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                  {h?.edificio_nombre && <p className="font-bold text-lg">{h.edificio_nombre}</p>}
                  {h?.edificio_subtitulo && <p className="text-sm">{h.edificio_subtitulo}</p>}
                </div>
              </div>
            )}
            {h?.mapa_embed_url && (
              <div className="relative h-72 rounded-lg overflow-hidden bg-slate-100">
                <iframe src={h.mapa_embed_url} className="w-full h-full" loading="lazy"></iframe>
              </div>
            )}
          </div>
        </div>

        {ayudaCta && (
          <div className="mt-10 border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-4 items-start">
              <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center shrink-0">
                <CircleHelp className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                {ayudaCta.title && <p className="font-bold text-slate-800">{ayudaCta.title}</p>}
                {ayudaCta.subtitle && <p className="text-sm text-slate-600">{ayudaCta.subtitle}</p>}
              </div>
            </div>
            {ayudaCta.button_link && ayudaCta.button_cta && (
              <Link href={ayudaCta.button_link}>
                <button className="border rounded-md px-5 py-2.5 font-medium text-slate-800 cursor-pointer transition-colors hover:scale-[1.05] hover:bg-slate-700 hover:text-white">
                  {ayudaCta.button_cta}
                </button>
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
