import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { RenderPageBlocks } from "@/components/blocks/RenderPageBlocks"
import { PageShell } from "@/components/blocks/PageShell"
import { buildPageMetadata, getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data"

export const dynamic = "force-dynamic"

const SLUG = "conocenos/normativa-y-condiciones-de-uso"

export async function generateMetadata({ searchParams }: { searchParams: PageSearchParams }): Promise<Metadata> {
  return buildPageMetadata(SLUG, searchParams)
}

export default async function Page({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(SLUG, isDraft)
  if (!page) notFound()

  return (
    <PageShell page={page} slug={SLUG} isDraft={isDraft}>
      <RenderPageBlocks layout={page.layout} />
    </PageShell>
  )
}
