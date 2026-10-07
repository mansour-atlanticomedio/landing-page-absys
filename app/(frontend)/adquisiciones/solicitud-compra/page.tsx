import Hero from "@/components/Hero";
import SolicitudCompraForm from "@/components/SolicitudCompraForm";
import { getClient } from "@/lib/payload";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Solicitud de compra | Biblioteca UNAM",
  description: "Propón a la Biblioteca la adquisición de libros y obras de referencia para la docencia, el estudio o la investigación.",
};

export default async function SolicitudCompra() {
  const payload = await getClient()
  const page = await payload.findGlobal({
    slug: 'solicitud_compra' as never,
    draft: false,
    depth: 2
  }) as any

  const heroData = page?.hero

  const pretitle = heroData?.pretitle || "Adquisiciones";
  const title = heroData?.title || "Solicitud de compra";
  const subtitle = heroData?.subtitle || "Propón la adquisición de libros u obras que necesites para tu docencia, estudio o investigación";

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
      />

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <SolicitudCompraForm />
        </div>
      </section>
    </>
  );
}
