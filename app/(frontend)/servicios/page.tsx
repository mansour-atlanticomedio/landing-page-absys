import Hero from "@/components/Hero";
import Image from "next/image";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";
import { Bookmark, BookOpen, Headphones, LibraryBig, RefreshCw, Search, User } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Servicios() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'services' as never,
    draft: false,
    depth: 5
  }) as any

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

  // return (
  //   <>
  //     <Hero
  //       pretitle={pretitle}
  //       title={title}
  //       subtitle={subtitle}
  //       image={imageUrl}
  //       buttonText={buttonText}
  //       inputPlaceHolder={inputPlaceHolder}
  //     />

  //     <RenderBlocks blocks={pageBlocks} />
  //   </>
  // )

  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="SERVICIOS" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-[1fr_320px] gap-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">Servicios bibliotecarios</h1>
            <p className="mt-3 text-slate-600">
              La Biblioteca ofrece servicios destinados a facilitar el acceso, la consulta y la
              utilización de los recursos de información disponibles en la Universidad. En esta
              página encontrarás información sobre la consulta de fondos, el préstamo, las
              renovaciones, las reservas y la atención de dudas.
            </p>
          </div>
          <div className="relative h-40 rounded-lg overflow-hidden">
            <Image src={imageUrl} alt="" fill className="object-cover" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-[1fr_320px] gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-800 mb-2">Consulta de fondos</h2>
              <p className="text-sm text-slate-600 mb-4">
                Consulta el catálogo para localizar los libros y recursos disponibles y comprobar
                su ubicación y disponibilidad.
              </p> 
              <Link href={'/recursos/catalogo'}  >
                <button className="bg-slate-800 text-white text-sm font-medium rounded-md px-4 py-2 cursor-pointer">
                  Ir al Catálogo
                </button>
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-800 mb-2">Préstamo</h2>
              <p className="text-sm text-slate-600 mb-4">
                Los miembros autorizados de la comunidad universitaria podrán solicitar en
                préstamo los materiales disponibles, de acuerdo con las condiciones establecidas
                por la Biblioteca.
              </p>
              <a href="#" className="text-sm text-teal-700 font-medium">
                Ver condiciones de préstamo (Próximamente) →
              </a>
            </div>

            <div className="border rounded-lg p-6">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-800 mb-2">Renovaciones</h2>
              <p className="text-sm text-slate-600">
                Los préstamos podrán renovarse siempre que se cumplan las condiciones del
                servicio y el material no haya sido solicitado por otra persona.
              </p>
            </div>

            <div className="border rounded-lg p-6 relative">
              <span className="absolute top-6 right-6 bg-slate-100 text-slate-600 text-xs rounded-full px-3 py-1">
                Próximamente
              </span>
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <Bookmark className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-800 mb-2">Reservas</h2>
              <p className="text-sm text-slate-600">
                Cuando esta función se encuentre habilitada, podrás reservar determinados
                materiales desde el catálogo o solicitar información a la Biblioteca.
              </p>
            </div>

            <div className="border rounded-lg p-6 col-span-2">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <Headphones className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-slate-800 mb-2">Atención de consultas</h2>
              <p className="text-sm text-slate-600 mb-4">
                La Biblioteca puede ayudarte a localizar recursos, utilizar el catálogo, acceder
                a las plataformas disponibles y resolver dudas relacionadas con sus servicios.
              </p>
              <button className="bg-slate-800 text-white text-sm font-medium rounded-md px-4 py-2">
                Contactar
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                <LibraryBig className="h-4 w-4" /> Acceso al catálogo
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Encuentra libros, revistas y otros recursos en nuestra colección.
              </p>
              <Link href={'/recursos/catalogo'} >
                <button className="w-full border-2 border-teal-700 text-teal-700 rounded-md py-2.5 font-medium cursor-pointer">
                  Buscar en Catálogo
                </button>
              </Link>
            </div>

            <div className="bg-slate-800 text-white rounded-lg p-6">
              <h3 className="flex items-center gap-2 font-bold mb-2">
                <User className="h-4 w-4" /> Mi Cuenta
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                Accede a tu perfil para gestionar tus préstamos y renovaciones.
              </p>
              <Link href={'/login'} >
                <button className="w-full bg-teal-700 rounded-md py-2.5 font-medium cursor-pointer">
                  Iniciar Sesión
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  )
}