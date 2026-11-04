import Hero from "@/components/Hero";
import { normalizeSubtitle } from '@/lib/rich-text'
import SolicitudCompraForm from "@/components/SolicitudCompraForm";
import { getClient } from "@/lib/payload";
import { HERO_FALLBACK_IMAGE } from "@/lib/images";
import { requireSession } from "@/lib/auth/session";
import { LivePreviewListener } from "@/components/blocks/LivePreviewListener";
import { getPage, resolveIsDraft, type PageSearchParams } from "@/lib/page-data";

const SLUG = "adquisiciones/solicitud-compra";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Solicitud de compra | Biblioteca UNAM",
  description: "Propón a la Biblioteca la adquisición de libros y obras de referencia para la docencia, el estudio o la investigación.",
};

export default async function SolicitudCompra({ searchParams }: { searchParams: PageSearchParams }) {
  const session = await requireSession("/adquisiciones/solicitud-compra")

  const isDraft = await resolveIsDraft(searchParams)
  const cmsPage = await getPage(SLUG, isDraft)

  let heroData: any
  if (cmsPage) {
    heroData = typeof cmsPage.hero === "object" ? cmsPage.hero : null
  } else {
    const payload = await getClient()
    const legacy = await payload.findGlobal({
      slug: 'solicitud_compra' as never,
      draft: false,
      depth: 2
    }) as any
    heroData = legacy?.hero
  }

  const pretitle = heroData?.pretitle || "Adquisiciones";
  const title = heroData?.title || "Solicitud de compra";
  const subtitle = normalizeSubtitle(heroData?.subtitle, "Propón la adquisición de libros u obras que necesites para tu docencia, estudio o investigación");

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : HERO_FALLBACK_IMAGE;

  const view = (
    <>
      <Hero
        pretitle={pretitle}
        title={title}
        subtitle={subtitle}
        image={imageUrl}
      />

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <SolicitudCompraForm solicitante={{ nombre: [session.nombre, session.apellidos].filter(Boolean).join(" "), email: session.email }} />
        </div>
      </section>
    </>
  );

  return isDraft ? <LivePreviewListener exitPath={`/${SLUG}`}>{view}</LivePreviewListener> : view
}
