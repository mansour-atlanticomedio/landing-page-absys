import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { RenderPageBlocks } from "@/components/blocks/RenderPageBlocks"
import { PageShell } from "@/components/blocks/PageShell"
import { HOME_SLUG } from "@/lib/pages"
import { buildPageMetadata, getPage, resolveIsDraft, toSlug, type PageProps } from "@/lib/page-data"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return buildPageMetadata(toSlug(slug), searchParams)
}

export default async function Page({ params, searchParams }: PageProps) {
  const slug = toSlug((await params).slug)
  if (slug === HOME_SLUG) notFound()
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(slug, isDraft)
  if (!page) notFound()

  return (
    <PageShell page={page} slug={slug} isDraft={isDraft}>
      <RenderPageBlocks layout={page.layout} />
    </PageShell>
  )
}
