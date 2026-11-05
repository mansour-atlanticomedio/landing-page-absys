import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { normalizeSubtitle } from '@/lib/rich-text'
import { RenderBlocks } from "@/components/RenderBlocks";
import { RenderPageBlocks } from "@/components/blocks/RenderPageBlocks";
import { PageShell } from "@/components/blocks/PageShell";
import { getClient } from "@/lib/payload";
import { HERO_FALLBACK_IMAGE } from "@/lib/images";
import { buildPageMetadata, getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

export const dynamic = 'force-dynamic';

const SLUG = 'repositorios'

export async function generateMetadata({ searchParams }: { searchParams: PageSearchParams }): Promise<Metadata> {
  const page = await getPage(SLUG, await resolveIsDraft(searchParams))
  return page ? buildPageMetadata(SLUG, searchParams) : {}
}

export default async function Repositories({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(SLUG, isDraft)

  if (page) {
    return (
      <PageShell page={page} slug={SLUG} isDraft={isDraft}>
        <RenderPageBlocks layout={page.layout} />
      </PageShell>
    )
  }

  return <LegacyRepositories />
}

async function LegacyRepositories() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'repository' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || "";
  const title = heroData?.title || "";
  const subtitle = normalizeSubtitle(heroData?.subtitle);
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : HERO_FALLBACK_IMAGE;

  return (
    <>
      <Hero
        pretitle={pretitle}
        title={title}
        subtitle={subtitle}
        image={imageUrl}
        buttonText={buttonText}
        inputPlaceHolder={inputPlaceHolder}
      />

      <RenderBlocks blocks={pageBlocks} />
    </>
  )
}
