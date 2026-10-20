export function MapSection({ block }: { block: any }) {
  if (!block?.map_embed_url) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      {block.title && <h2 className="font-display text-2xl font-bold text-primary mb-6">{block.title}</h2>}
      <div className="relative h-72 rounded-lg overflow-hidden bg-slate-100">
        <iframe src={block.map_embed_url} title={block.title || "Mapa"} className="w-full h-full" loading="lazy" />
      </div>
    </section>
  )
}
