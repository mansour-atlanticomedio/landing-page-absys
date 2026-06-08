import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";

export const dynamic = 'force-dynamic';

import './styles.css'
import HeroCarrousel from "@/components/heroCarrusel";

export default async function Home() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'home' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const heroCarruselData = homepage?.hero_carrusel
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || "";
  const title = heroData?.title || "";
  const subtitle = heroData?.subtitle || "";
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';

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
      {heroCarruselData !== null &&
        <HeroCarrousel
          title=""
          items={heroCarruselData.items}
        />
      }

      <RenderBlocks blocks={pageBlocks} />

    </>

  )
}



