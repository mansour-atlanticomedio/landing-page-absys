import Link from "next/link"
import { CircleHelp } from "lucide-react"

export function HelpCtaSection({ block }: { block: any }) {
  const cta = block?.cta
  if (!cta || typeof cta !== "object") return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center shrink-0">
            <CircleHelp className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            {cta.title && <p className="font-display font-bold text-primary">{cta.title}</p>}
            {cta.subtitle && <p className="text-sm text-slate-600">{cta.subtitle}</p>}
          </div>
        </div>
        {cta.button_link && cta.button_cta && (
          <Link
            href={cta.button_link}
            className="border rounded-md px-5 py-2.5 font-medium text-slate-800 transition-colors hover:bg-slate-700 hover:text-white"
          >
            {cta.button_cta}
          </Link>
        )}
      </div>
    </section>
  )
}
