import { getClient } from "@/lib/payload";
import { normalizeSubtitle } from '@/lib/rich-text'
import FormationContent from "@/components/FormationContent";
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener";
import { getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

import { ENLACES_RAPIDOS_FALLBACK, CITAR_CTA_FALLBACK, GUIA_TUTORIAL_FALLBACK, FORMACION_SUBTITULO_FALLBACK, FORMACION_BUSCAR_1_FALLBACK, FORMACION_BUSCAR_2_FALLBACK, FORMACION_ACTIVIDADES_TEXTO_FALLBACK, FORMACION_ACTIVIDADES_ESTADO_FALLBACK } from "@/lib/page-fallbacks";

const SLUG = "formacion";

export const dynamic = 'force-dynamic';

export default async function Formation({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(SLUG, isDraft)
  if (!page) return <LegacyFormation />

  const hero = typeof page.hero === "object" && page.hero ? page.hero : null
  const block = (page.layout ?? []).find((b: any) => b.blockType === "formation_content_block") ?? {}
  const quickLinks = (block.quick_links ?? []).filter((e: any) => e?.label)

  const content = (
    <FormationContent
      title={hero?.title || "Formación"}
      subtitle={normalizeSubtitle(hero?.subtitle, FORMACION_SUBTITULO_FALLBACK)}
      imageUrl={hero?.background_image?.url || "/img/formacion-hero.jpg"}
      buscarParrafo1={block.search_paragraph_1 || ""}
      buscarParrafo2={block.search_paragraph_2 || ""}
      enlacesRapidos={quickLinks.map((e: any) => ({ label: e.label, link: e.link }))}
      citarCta={{
        title: block.cite_title || "",
        subtitle: block.cite_text || "",
        button_cta: block.cite_button_label || "",
        button_link: block.cite_button_link || "#",
      }}
      guiaTutorial={{ title: block.guide_title || "", description: block.guide_description || "", link: block.guide_link || "#" }}
      actividadesTexto={block.activities_text || ""}
      actividadesEstado={block.activities_status || ""}
    />
  )

  return isDraft ? <LivePreviewListener exitPath={`/${SLUG}`}>{content}</LivePreviewListener> : content
}

async function LegacyFormation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'formation' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const title = heroData?.title || "Formación";
  const subtitle =
    normalizeSubtitle(
    heroData?.subtitle,
    FORMACION_SUBTITULO_FALLBACK
  );
  const imageUrl = heroData?.background_image?.url || "/img/formacion-hero.jpg";

  const buscarParrafo1 =
    homepage?.buscar_parrafo_1 ||
    FORMACION_BUSCAR_1_FALLBACK;
  const buscarParrafo2 =
    homepage?.buscar_parrafo_2 ||
    FORMACION_BUSCAR_2_FALLBACK;

  const enlacesRapidos = homepage?.enlaces_rapidos?.length ? homepage.enlaces_rapidos : ENLACES_RAPIDOS_FALLBACK;
  const citarCta = homepage?.citar_cta || CITAR_CTA_FALLBACK;

  const tutorialItem = homepage?.guias_tutoriales?.accesos?.[0];
  const guiaTutorial = tutorialItem
    ? { title: tutorialItem.title, description: tutorialItem.description || "", link: tutorialItem.link || "#" }
    : GUIA_TUTORIAL_FALLBACK;

  const actividadesTexto =
    homepage?.actividades_texto ||
    FORMACION_ACTIVIDADES_TEXTO_FALLBACK;
  const actividadesEstado =
    homepage?.actividades_estado ||
    FORMACION_ACTIVIDADES_ESTADO_FALLBACK;

  return (
    <FormationContent
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
      buscarParrafo1={buscarParrafo1}
      buscarParrafo2={buscarParrafo2}
      enlacesRapidos={enlacesRapidos}
      citarCta={citarCta}
      guiaTutorial={guiaTutorial}
      actividadesTexto={actividadesTexto}
      actividadesEstado={actividadesEstado}
    />
  );
}
