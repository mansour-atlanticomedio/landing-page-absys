import { PageHero } from "@/components/blocks/PageHero";
import { getClient } from "@/lib/payload";
import { getSession } from "@/lib/auth/session";
import { Bookmark, BookOpen, Headphones, RefreshCw, Search, BookPlus, User } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Servicios() {
  const payload = await getClient()
  const session = await getSession()
  // Sin sesión el botón de sugerir libro lleva al login en vez de a la página privada
  const sugerirLibroHref = session ? '/adquisiciones/solicitud-compra' : '/login'
  const homepage = await payload.findGlobal({
    slug: 'services' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero

  const hero = {
    title: heroData?.title || "Servicios bibliotecarios",
    subtitle: heroData?.subtitle || "La Biblioteca ofrece servicios destinados a facilitar el acceso, la consulta y la utilización de los recursos de información disponibles en la Universidad. Aquí encontrarás información sobre la consulta de fondos, el préstamo, las renovaciones, las reservas y la atención de dudas.",
    background_image: heroData?.background_image && typeof heroData.background_image === 'object'
      ? heroData.background_image
      : { id: 0, url: '/images/app/campus.jpg', alt: '' },
  }

  const servicios = [
    {
      icon: Search,
      title: "Consulta de fondos",
      text: "Consulta el catálogo para localizar los libros y recursos disponibles y comprobar su ubicación y disponibilidad.",
      action: { label: "Ir al catálogo", href: "/recursos/catalogo" },
    },
    {
      icon: BookOpen,
      title: "Préstamo",
      text: "Los miembros autorizados de la comunidad universitaria podrán solicitar en préstamo los materiales disponibles, de acuerdo con las condiciones establecidas por la Biblioteca.",
      badge: "Próximamente",
    },
    {
      icon: RefreshCw,
      title: "Renovaciones",
      text: "Los préstamos podrán renovarse siempre que se cumplan las condiciones del servicio y el material no haya sido solicitado por otra persona.",
    },
    {
      icon: Bookmark,
      title: "Reservas",
      text: "Cuando esta función se encuentre habilitada, podrás reservar determinados materiales desde el catálogo o solicitar información a la Biblioteca.",
      badge: "Próximamente",
    },
    {
      icon: Headphones,
      title: "Atención de consultas",
      text: "La Biblioteca puede ayudarte a localizar recursos, utilizar el catálogo, acceder a las plataformas disponibles y resolver dudas relacionadas con sus servicios.",
      action: { label: "Contactar", href: "/conocenos/horarios-ubicacion-y-contacto" },
      wide: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageHero variant="split" hero={hero} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {servicios.map(({ icon: Icon, title, text, action, badge, wide }) => (
              <div
                key={title}
                className={`relative flex flex-col rounded-lg border border-border bg-card p-5 sm:p-6 ${wide ? "sm:col-span-2" : ""}`}
              >
                {badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground sm:right-6 sm:top-6">
                    {badge}
                  </span>
                )}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mb-2 font-display font-bold text-primary">{title}</h2>
                <p className="text-sm text-muted-foreground">{text}</p>
                {action && (
                  <Link
                    href={action.href}
                    className="inline-flex items-center justify-center rounded-lg font-medium text-sm transition-colors mt-4 h-10 self-start bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                  >
                    {action.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <aside className="space-y-4 sm:space-y-6">
            <div className="rounded-lg bg-primary p-5 text-primary-foreground sm:p-6">
              <h3 className="mb-2 flex items-center gap-2 font-display font-bold">
                <User className="h-4 w-4" /> Mi cuenta
              </h3>
              <p className="mb-4 text-sm text-primary-foreground/80">
                {session
                  ? "Consulta tu perfil, tus préstamos y tus reservas."
                  : "Accede a tu perfil para gestionar tus préstamos y renovaciones."}
              </p>
              <Link
                href={session ? "/perfil" : "/login"}
                className="inline-flex items-center justify-center rounded-lg font-medium text-sm transition-colors h-11 w-full bg-accent text-primary-foreground hover:bg-accent/90"
              >
                {session ? "Ir a mi perfil" : "Iniciar sesión"}
              </Link>
            </div>
            <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
              <h3 className="mb-2 flex items-center gap-2 font-display font-bold text-primary">
                <BookPlus className="h-4 w-4" /> Solicitud de compra
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Propón la adquisición de libros u obras que necesites para tu docencia, estudio o investigación.
              </p>
              <Link
                href={sugerirLibroHref}
                className="inline-flex items-center justify-center rounded-lg font-medium text-sm transition-colors h-11 w-full border-2 border-accent text-accent hover:bg-accent/10"
              >
                Sugerir libro
              </Link>
              {!session && (
                <p className="mt-2 text-center text-xs text-muted-foreground">Identifícate con tu cuenta para acceder</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
