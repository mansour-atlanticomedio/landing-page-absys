import { AlertTriangle } from "lucide-react"

export function NoticeSection({ block }: { block: any }) {
  if (!block?.text) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="border rounded-lg p-6">
        {block.title && (
          <h2 className="font-display flex items-center gap-2 font-bold text-primary mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" /> {block.title}
          </h2>
        )}
        <p className="text-sm text-slate-600">{block.text}</p>
      </div>
    </section>
  )
}
