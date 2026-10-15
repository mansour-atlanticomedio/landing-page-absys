import { getClient } from "@/lib/payload"
import { ConocenosBlocks } from "@/components/conocenos/ConocenosBlocks"

export default async function Page() {
  const payload = await getClient()
  const aboutUs = await payload.findGlobal({
    slug: 'about_us' as never,
    draft: false,
    depth: 5
  }) as any

  const data = aboutUs?.normativa
  const hero = data?.hero

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-4">
        {hero?.title && <h1 className="text-4xl font-extrabold text-slate-800">{hero.title}</h1>}
        {hero?.subtitle && <p className="mt-3 text-slate-600 max-w-3xl">{hero.subtitle}</p>}
      </section>

      <ConocenosBlocks layout={data?.layout} />
    </div>
  );
}
