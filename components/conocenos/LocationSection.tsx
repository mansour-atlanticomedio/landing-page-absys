import Image from "next/image"
import { Clock, Info, Mail, MapPin, Navigation, Phone } from "lucide-react"

const SCHEDULE_TYPE_STYLES: Record<string, string> = {
  regular: "text-slate-600",
  closed: "text-red-600 font-medium",
  extended: "text-teal-700 font-medium",
  holiday: "text-amber-700 font-medium",
}

export function LocationSection({ block }: { block: any }) {
  const b = block || {}
  const rows: any[] = b.schedule?.schedule || []
  const image = b.image?.url
  const hasLocation = b.address_line1 || b.address_line2
  const hasContact = b.phone || b.email
  const hasCard = b.title || rows.length > 0 || hasLocation || hasContact
  const hasRight = image || b.map_embed_url
  if (!hasCard && !hasRight) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className={`grid grid-cols-1 gap-6 ${hasCard && hasRight ? "lg:grid-cols-[380px_1fr]" : ""}`}>
        {hasCard && (
          <div className="border rounded-lg p-6 self-start">
            {b.title && (
              <h2 className="font-display flex items-center gap-2 font-bold text-primary mb-6">
                <Info className="h-5 w-5 text-accent" /> {b.title}
              </h2>
            )}

            {rows.length > 0 && (
              <div className="flex gap-3 mb-5">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  {(b.schedule_title || b.schedule?.title) && (
                    <p className="font-semibold text-slate-800 mb-2">{b.schedule_title || b.schedule?.title}</p>
                  )}
                  <div className="space-y-1">
                    {rows.map((s, i) => (
                      <div key={s.id ?? i} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-600">{s.day}</span>
                        <span className={SCHEDULE_TYPE_STYLES[s.type] || "text-slate-600"}>{s.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {hasLocation && (
              <div className="flex gap-3 mb-5">
                <MapPin className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  {b.location_title && <p className="font-semibold text-slate-800">{b.location_title}</p>}
                  {b.address_line1 && <p className="text-sm text-slate-600">{b.address_line1}</p>}
                  {b.address_line2 && <p className="text-sm text-slate-600">{b.address_line2}</p>}
                </div>
              </div>
            )}

            {hasContact && (
              <div className="flex gap-3 mb-6">
                <Phone className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  {b.contact_title && <p className="font-semibold text-slate-800">{b.contact_title}</p>}
                  {b.phone && <p className="text-sm text-slate-600">{b.phone}</p>}
                  {b.email && (
                    <a href={`mailto:${b.email}`} className="text-sm text-teal-700 flex items-center gap-1 transition-colors hover:text-teal-900">
                      <Mail className="h-3.5 w-3.5" /> {b.email}
                    </a>
                  )}
                </div>
              </div>
            )}

            {b.email && b.contact_button_label && (
              <a
                href={`mailto:${b.email}`}
                className="w-full bg-slate-800 text-white rounded-md py-2.5 font-medium flex items-center justify-center gap-2 mb-3 transition-transform hover:scale-[1.02]"
              >
                <Mail className="h-4 w-4" /> {b.contact_button_label}
              </a>
            )}
            {b.map_url && b.directions_button_label && (
              <a
                href={b.map_url}
                className="w-full border rounded-md py-2.5 font-medium flex items-center justify-center gap-2 text-slate-800 transition-colors hover:bg-accent hover:text-white"
              >
                <Navigation className="h-4 w-4" /> {b.directions_button_label}
              </a>
            )}
          </div>
        )}

        {hasRight && (
          <div className="space-y-6">
            {(image || b.building_name) && (
              <div className="relative h-60 sm:h-72 rounded-lg overflow-hidden bg-slate-100">
                {image && (
                  <Image
                    src={image}
                    alt={b.image?.alt || ""}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                  {b.building_name && <p className="font-bold text-lg">{b.building_name}</p>}
                  {b.building_subtitle && <p className="text-sm">{b.building_subtitle}</p>}
                </div>
              </div>
            )}
            {b.map_embed_url && (
              <div className="relative h-64 sm:h-72 rounded-lg overflow-hidden bg-slate-100">
                <iframe src={b.map_embed_url} title={b.title || "Mapa"} className="w-full h-full" loading="lazy" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
