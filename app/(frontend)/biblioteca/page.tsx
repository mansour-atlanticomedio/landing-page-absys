import Hero from "@/components/Hero";
import { getClient } from "@/lib/payload";
import BooksList from "@/components/BooksList";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {

  const payload = await getClient();
  const homepage = await payload.findGlobal({
    slug: 'library' as never,
    draft: false,
    depth: 5
  }) as any;

  const heroData = homepage?.hero || {};
  const imageUrl = typeof heroData.background_image === 'object' && heroData.background_image !== null
    ? heroData.background_image.url
    : null;

  return (
    <section>
      <Hero
        pretitle={heroData.pretitle}
        title={heroData.title}
        subtitle={heroData.subtitle}
        image={imageUrl}
        buttonText={heroData.button_cta}
        inputPlaceHolder={heroData.input_placeholder}
      />

      <div className="my-8 w-11/12 flex flex-col gap-4 justify-center items-start mx-auto" >
        <Suspense fallback={<div className="text-center w-full">Cargando biblioteca...</div>} >
          <BooksList />
        </Suspense>
      </div>
    </section>
  );
}