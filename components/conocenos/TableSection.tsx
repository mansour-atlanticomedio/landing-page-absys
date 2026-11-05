export function TableSection({ block }: { block: any }) {
  const columns: any[] = block?.columns ?? []
  const rows: any[] = block?.rows ?? []
  if (!columns.length) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      {block.title && <h2 className="font-display text-2xl font-bold text-primary mb-4">{block.title}</h2>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {columns.map((c, i) => (
                <th key={c.id ?? i} scope="col" className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? i} className="border-t border-border">
                {columns.map((c, j) => (
                  <td key={c.id ?? j} className="px-4 py-3 text-slate-700">
                    {r.cells?.[j]?.text ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
