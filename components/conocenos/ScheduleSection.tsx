import { Clock } from "lucide-react"

const SCHEDULE_TYPE_STYLES: Record<string, string> = {
  regular: "text-slate-600",
  closed: "text-red-600 font-medium",
  extended: "text-teal-700 font-medium",
  holiday: "text-amber-700 font-medium",
}

export function ScheduleSection({ block }: { block: any }) {
  const rows: any[] = block?.schedule?.schedule || []
  if (rows.length === 0) return null
  const title = block.title || block.schedule?.title
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="border rounded-lg p-6 max-w-xl">
        <div className="flex gap-3">
          <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
          <div className="flex-1">
            {title && <h2 className="font-display font-semibold text-primary mb-2">{title}</h2>}
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
      </div>
    </section>
  )
}
