import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";

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
  const pretitle = heroData?.pretitle || "Próximo Evento";
  const title = heroData?.title || "Bienvenidos a la Biblioteca";
  const subtitle = heroData?.subtitle || "Explora nuestros recursos y repositorios académicos.";
  const buttonText = heroData?.button_cta || "Ver Programa";
  const inputPlaceHolder = heroData?.input_placeholder || "Tu correo electrónico...";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';
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