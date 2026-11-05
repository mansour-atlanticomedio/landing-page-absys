import Hero from "@/components/Hero";
import { normalizeSubtitle } from '@/lib/rich-text'
import { getClient } from "@/lib/payload";
import { HERO_FALLBACK_IMAGE } from "@/lib/images";
import BooksList from "@/components/BooksList";
import { Suspense } from "react";
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener";
import { getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

const SLUG = "biblioteca";

export const dynamic = 'force-dynamic';

export default async function LibraryPage({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(SLUG, isDraft)

  let heroData: any
  if (page) {
    heroData = typeof page.hero === "object" ? page.hero : null
  } else {
    const payload = await getClient();
    const homepage = await payload.findGlobal({
      slug: 'library' as never,
      draft: false,
      depth: 5
    }) as any;
    heroData = homepage?.hero
  }

  const pretitle = heroData?.pretitle || "";
  const title = heroData?.title || "";
  const subtitle = normalizeSubtitle(heroData?.subtitle);
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : HERO_FALLBACK_IMAGE;

  const view = (
    <section>
      <Hero
        pretitle={pretitle}
        title={title}
        subtitle={subtitle}
        image={imageUrl}
        buttonText={buttonText}
        inputPlaceHolder={inputPlaceHolder}
      />

      <div className="my-8 w-11/12 flex flex-col gap-4 justify-center items-start mx-auto" >
        <Suspense fallback={<div className="text-center w-full">Cargando biblioteca...</div>} >
          <BooksList />
        </Suspense>
      </div>
    </section>
  );

  return isDraft ? <LivePreviewListener exitPath={`/${SLUG}`}>{view}</LivePreviewListener> : view
}
