import { getClient } from "@/lib/payload";
import { normalizeSubtitle } from '@/lib/rich-text'
import InvestigationContent from "@/components/InvestigationContent";
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener";
import { getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

import { ACCESOS_RAPIDOS_FALLBACK, TARJETAS_FALLBACK, CTA_FALLBACK, INVESTIGACION_SUBTITULO_FALLBACK } from "@/lib/page-fallbacks";

const SLUG = "investigacion";
import { DSPACE_URL_POR_DEFECTO, resolveEnlaceExterno } from "@/lib/links";

export const dynamic = 'force-dynamic';

const DSPACE_FALLBACK = DSPACE_URL_POR_DEFECTO;

export default async function Investigation({ searchParams }: { searchParams: PageSearchParams }) {
  const isDraft = await resolveIsDraft(searchParams)
  const page = await getPage(SLUG, isDraft)
  if (!page) return <LegacyInvestigation />

  const hero = typeof page.hero === "object" && page.hero ? page.hero : null
  const block = (page.layout ?? []).find((b: any) => b.blockType === "investigation_content_block") ?? {}

  const content = (
    <InvestigationContent
      title={hero?.title || "Apoyo a la investigación"}
      subtitle={normalizeSubtitle(hero?.subtitle, INVESTIGACION_SUBTITULO_FALLBACK)}
      imageUrl={hero?.background_image?.url || "/img/investigacion-hero.jpg"}
      accesosRapidos={(block.quick ?? []).map((a: any) => ({ icon: a.icon, title: a.title }))}
      tarjetas={(block.cards ?? []).map((t: any) => ({ icon: t.icon, title: t.title, description: t.description || "", cta: t.cta, link: t.link }))}
      cta={{
        title: block.support_title || "",
        subtitle: block.support_text || "",
        button_cta: block.support_button_label || "",
        button_link: block.support_button_link || "#",
      }}
    />
  )

  return isDraft ? <LivePreviewListener exitPath={`/${SLUG}`}>{content}</LivePreviewListener> : content
}

async function LegacyInvestigation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'investigation' as never,
    draft: false,
    depth: 5
  }) as any
  const layoutData = await payload.findGlobal({ slug: 'layout', depth: 0 }) as any
  const dspaceUrl = resolveEnlaceExterno(layoutData?.enlaces_externos, 'dspace', DSPACE_FALLBACK)

  const heroData = homepage?.hero
  const title = heroData?.title || "Apoyo a la investigación";
  const subtitle =
    normalizeSubtitle(
    heroData?.subtitle,
    INVESTIGACION_SUBTITULO_FALLBACK
  );
  const imageUrl = heroData?.background_image?.url || "/img/investigacion-hero.jpg";

  const accesosRapidos = homepage?.accesos_rapidos?.feature?.length
    ? homepage.accesos_rapidos.feature
    : ACCESOS_RAPIDOS_FALLBACK;
  const tarjetas = homepage?.tarjetas?.accesos?.length
    ? homepage.tarjetas.accesos
    : TARJETAS_FALLBACK.map((tarjeta) => (tarjeta.link === DSPACE_FALLBACK ? { ...tarjeta, link: dspaceUrl } : tarjeta));
  const cta = homepage?.cta || CTA_FALLBACK;

  return (
    <InvestigationContent
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
      accesosRapidos={accesosRapidos}
      tarjetas={tarjetas}
      cta={cta}
    />
  );
}
