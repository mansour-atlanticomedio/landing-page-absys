import { cache } from "react"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getClient } from "@/lib/payload"
import { PageHero } from "@/components/blocks/PageHero"
import { RenderPageBlocks } from "@/components/blocks/RenderPageBlocks"
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener"

export const dynamic = "force-dynamic"

const toSlug = (segments: string[]) =>
  segments
    .map((s) => {
      try {
        return decodeURIComponent(s)
      } catch {
        return s
      }
    })
    .join("/")
    .toLowerCase()

const getPage = cache(async (segments: string[], isDraft: boolean) => {
  const payload = await getClient()
  const slug = toSlug(segments)
  const res = await payload.find({
    collection: "pages" as never,
    where: {
      slug: { equals: slug },
      ...(isDraft ? {} : { _status: { equals: "published" } }),
    },
    limit: 1,
    depth: 3,
    draft: isDraft,
  } as any)
  return ((res as any).docs?.[0] ?? null) as any
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const page = await getPage(slug, isDraft)
  if (!page) return {}
  const heroSubtitle = typeof page.hero === "object" && page.hero ? page.hero.subtitle : undefined
  return {
    title: `${page.title} – Biblioteca UNAM`,
    description: page.meta_description || heroSubtitle || undefined,
    ...(isDraft ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const page = await getPage(slug, isDraft)
  if (!page) notFound()

  const content = (
    <div className="min-h-screen bg-white">
      <PageHero variant={page.hero_variant} hero={typeof page.hero === "object" ? page.hero : null} fallbackTitle={page.title} />
      <RenderPageBlocks layout={page.layout} />
    </div>
  )

  if (isDraft) {
    return <LivePreviewListener exitPath={`/${toSlug(slug)}`}>{content}</LivePreviewListener>
  }

  return content
}
