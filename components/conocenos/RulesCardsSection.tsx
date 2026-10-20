import { FileText } from "lucide-react"
import { iconMap } from "@/lib/icons"

export function RulesCardsSection({ block }: { block: any }) {
  const cards: any[] = block?.cards || []
  if (cards.length === 0) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((t, i) => {
          const Icon = iconMap[t.icon] || FileText
          const points: any[] = t.points || []
          return (
            <div key={t.id ?? i} className={`border rounded-lg p-6${t.badge ? " relative" : ""}`}>
              {t.badge && (
                <span className="absolute top-6 right-6 bg-slate-800 text-white text-xs rounded-full px-3 py-1">
                  {t.badge}
                </span>
              )}
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className={`font-display font-bold text-primary ${points.length > 0 ? "mb-4" : "mb-2"}`}>{t.title}</h2>
              {t.description && (
                <p className={`text-sm text-slate-600${t.note_text ? " mb-4" : ""}`}>{t.description}</p>
              )}
              {points.length > 0 && (
                <ul className="space-y-3 text-sm text-slate-600">
                  {points.map((p, k) => (
                    <li key={p.id ?? k}>✓ {p.text}</li>
                  ))}
                </ul>
              )}
              {t.note_text && (
                <div className="bg-slate-50 border rounded-md p-4 mt-4">
                  {t.note_title && <p className="text-sm font-semibold text-slate-800 mb-1">{t.note_title}</p>}
                  <p className="text-sm text-slate-600">{t.note_text}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
