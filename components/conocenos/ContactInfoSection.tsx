import { Info, MapPin, HelpCircle, Mail, Navigation } from "lucide-react"

export function ContactInfoSection({ block, mapUrl }: { block: any; mapUrl?: string }) {
  const b = block || {}
  const hasLocation = b.address_line1 || b.address_line2
  const hasContact = b.phone || b.email
  if (!b.title && !b.building_name && !hasLocation && !hasContact) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="border rounded-lg p-6 max-w-xl">
        {b.title && (
          <h2 className="font-display flex items-center gap-2 font-bold text-primary mb-6">
            <Info className="h-5 w-5 text-accent" /> {b.title}
          </h2>
        )}
        {(b.building_name || b.building_subtitle) && (
          <div className="mb-5">
            {b.building_name && <p className="font-semibold text-slate-800">{b.building_name}</p>}
            {b.building_subtitle && <p className="text-sm text-slate-600">{b.building_subtitle}</p>}
          </div>
        )}
        {hasLocation && (
          <div className="flex gap-3 mb-5">
            <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
            <div>
              {b.location_title && <p className="font-semibold text-slate-800">{b.location_title}</p>}
              {b.address_line1 && <p className="text-sm text-slate-600">{b.address_line1}</p>}
              {b.address_line2 && <p className="text-sm text-slate-600">{b.address_line2}</p>}
            </div>
          </div>
        )}
        {hasContact && (
          <div className="flex gap-3 mb-6">
            <HelpCircle className="h-5 w-5 text-slate-500 mt-0.5" />
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
        {mapUrl && b.directions_button_label && (
          <a
            href={mapUrl}
            className="w-full border rounded-md py-2.5 font-medium flex items-center justify-center gap-2 text-slate-800 transition-colors hover:bg-accent hover:text-white"
          >
            <Navigation className="h-4 w-4" /> {b.directions_button_label}
          </a>
        )}
      </div>
    </section>
  )
}
