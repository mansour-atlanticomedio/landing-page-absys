import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";

import { getClient } from "@/lib/payload";

import './styles.css'

export default async function Home() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'home' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout
  const imageUrl = typeof heroData.background_image === 'object' && heroData.background_image !== null ? heroData.background_image.url : null;

  return (
    <>
      <Hero
        pretitle={heroData.pretitle}
        title={heroData.title}
        subtitle={heroData.subtitle}
        image={imageUrl}
        buttonText={heroData.button_cta}
        inputPlaceHolder={heroData.input_placeholder}
      />
      <RenderBlocks blocks={pageBlocks} />
    </>
  )
}



