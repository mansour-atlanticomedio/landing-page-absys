import { PageHero } from "@/components/blocks/PageHero"
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener"

export function PageShell({
  page,
  slug,
  isDraft,
  children,
}: {
  page: any
  slug: string
  isDraft: boolean
  children: React.ReactNode
}) {
  const content = (
    <div className="min-h-screen bg-white">
      <PageHero variant={page.hero_variant} hero={typeof page.hero === "object" ? page.hero : null} fallbackTitle={page.title} />
      {children}
    </div>
  )

  if (isDraft) {
    return <LivePreviewListener exitPath={`/${slug}`}>{content}</LivePreviewListener>
  }

  return content
}
