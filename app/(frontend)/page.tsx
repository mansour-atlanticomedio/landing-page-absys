import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";

import { getClient } from "@/lib/payload";

import './styles.css'

export default async function Home() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'home',
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const cta_button: string = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=XY9FITLOIEKpKiuDNuULSADr381rgy1HsyQ7GPxGWOpUMDNUMFIwV0JJM05ZR1VFR1c3UDFMRFhMMS4u&route=shorturl'

  const imageUrl = typeof heroData.background_image === 'object' && heroData.background_image !== null ? heroData.background_image.url : null;
  return (
    <>
      <Hero
        pretitle={heroData.pretitle}
        title={heroData.title}
        subtitle={heroData.subtitle}
        image={imageUrl}
        buttonText="Inscríbete"
        toPage={cta_button}
      />
      <RenderBlocks blocks={pageBlocks} />
    </>
  )
}



