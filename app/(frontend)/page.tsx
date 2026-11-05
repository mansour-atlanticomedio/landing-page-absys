import Hero from "@/components/Hero";
import { normalizeSubtitle } from '@/lib/rich-text'
import { RenderBlocks } from "@/components/RenderBlocks";
import { RenderPageBlocks } from "@/components/blocks/RenderPageBlocks";
import { PageShell } from "@/components/blocks/PageShell";
import { getClient } from "@/lib/payload";
import { HERO_FALLBACK_IMAGE } from "@/lib/images";
import { HOME_SLUG } from "@/lib/pages";
import { getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

export const dynamic = 'force-dynamic';

import '../styles.css'
import HeroCarrousel from "@/components/heroCarrusel";

export default async function Home({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(HOME_SLUG, isDraft)

  if (page) {
    return (
      <PageShell page={page} slug={HOME_SLUG} isDraft={isDraft}>
        <RenderPageBlocks layout={page.layout} />
      </PageShell>
    )
  }

  return <LegacyHome />
}

async function LegacyHome() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'home' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const heroCarruselData = homepage?.hero_carrusel
  const carruselItems = heroCarruselData?.items || []
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
      {heroData !== null &&
        <Hero
          pretitle={pretitle}
          title={title}
          subtitle={subtitle}
          image={imageUrl}
          buttonText={buttonText}
          inputPlaceHolder={inputPlaceHolder}
        />

      }
      {carruselItems !== null &&
        <HeroCarrousel
          title=""
          items={carruselItems}
        />
      }

      <RenderBlocks blocks={pageBlocks} />

    </>

  )
}
