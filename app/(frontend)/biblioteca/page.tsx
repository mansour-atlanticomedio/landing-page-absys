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

  const heroData = homepage?.hero
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
    <section>
      <Hero
        pretitle={pretitle}
        title={title}
        subtitle={subtitle}
        image={imageUrl}
        buttonText={buttonText}
        inputPlaceHolder={inputPlaceHolder}
      />

      <div className="my-8 w-11/12 flex flex-col gap-4 justify-center items-start mx-auto" >
        <Suspense fallback={<div className="text-center w-full">Cargando biblioteca...</div>} >
          <BooksList />
        </Suspense>
      </div>
    </section>
  );
}