import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";
import { HERO_FALLBACK_IMAGE } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default async function Repositories() {
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
  const subtitle = heroData?.subtitle || "";
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