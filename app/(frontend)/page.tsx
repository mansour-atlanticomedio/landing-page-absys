import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";

export const dynamic = 'force-dynamic';

import './styles.css'
import { FlaskConical, LayoutGrid, Newspaper, PenLine, Sparkles } from "lucide-react";

export default async function Home() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'home' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || "Próximo Evento";
  const title = heroData?.title || "Bienvenidos a la Biblioteca";
  const subtitle = heroData?.subtitle || "Explora nuestros recursos y repositorios académicos.";
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';

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



