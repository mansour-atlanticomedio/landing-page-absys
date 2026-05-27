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
  const buttonText = heroData?.button_cta || "Ver Programa";
  const inputPlaceHolder = heroData?.input_placeholder || "Tu correo electrónico...";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';


  const NOTICIAS = [
    { tag: "EVENTO", title: "Visita de la Fundación Esperanza (Togo)", desc: "Una mañana de intercambio cultural y bibliotecario con visitantes internacionales." },
    { tag: "EXPOSICIÓN", title: '"Bridge to Africa" 2026, en la Biblioteca Universitaria', desc: "Del 25 al 29 de mayo, programa de actividades dedicado al continente africano." },
    { tag: "MUESTRA", title: "Pintaderas: exposición de fotografía y videoarte", desc: "Pieza destacada del ciclo Bridge to Africa, abierta al público en sala principal." },
  ];

  const RECOMENDADOS = [
    { title: "¡Ayúdanos a mejorar!: Encuesta de satisfacción 2026", desc: "Rellena la encuesta del 7 al 31 de mayo y ayúdanos a seguir creciendo." },
    { title: "Reapertura de la sala de lectura del CDE", desc: "Centro de Documentación Europea: nuevos horarios y servicios renovados." },
    { title: "Silencio, exámenes: campaña mayo y junio 2026", desc: "Recuerda mantener el silencio en las salas durante el periodo de exámenes." },
  ];

  const PORTALES = ["accedaCRIS", "memoria digital de Canarias", "Jable · Archivo de Prensa", "CraaL"];

  const INVESTIGACION = [
    { title: "La contribución investigadora de la ULPGC a los ODS", desc: "Un cuadro de mando abierto y actualizable con todos los indicadores." },
    { title: "I Monitor ULPGC sobre Acceso Abierto", desc: "Análisis comparativo de indicadores bibliométricos 2015-2024." },
    { title: "Publica en acceso abierto en la ULPGC sin coste", desc: "Acuerdos transformativos y financiación APC disponibles para tu publicación." },
  ];

  const BLOGS = [
    { date: "27 MAYO 2026", title: "Ingeniería con propósito: la historia de ELIMU", blog: "Inteling" },
    { date: "27 MAYO 2026", title: "III Jornadas de Patrimonio documental de El Museo Canario", blog: "Lecturas archivadas" },
    { date: "26 MAYO 2026", title: "Agenda: Congresos y jornadas (junio 2026)", blog: "Anatomía de Gray" },
    { date: "25 MAYO 2026", title: "The Very Best of Michael Nyman (2001)", blog: "The End" },
    { date: "25 MAYO 2026", title: "Cruzando el puente: lecturas sobre mujeres africanas", blog: "Espacio Violeta" },
  ];

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

      <section id="noticias" className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
              Noticias
            </h2>
            <a href="#" className="text-sm font-semibold text-primary hover:underline">Ver todas las noticias →</a>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {NOTICIAS.map((n) => (
              <article key={n.title} className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg">
                <div className="h-44 bg-linear-to-br from-primary/30 via-primary/10 to-accent/20" />
                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{n.tag}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{n.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 h-px w-full bg-accent/40" />
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 flex items-center gap-3 text-3xl font-bold text-primary">
            Te recomendamos
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {RECOMENDADOS.map((r) => (
              <article key={r.title} className="rounded-lg border border-border bg-card p-6 transition hover:border-primary hover:shadow-md">
                <div className="mb-4 h-36 rounded-md bg-linear-to-br from-accent/30 to-primary/20" />
                <h3 className="text-lg font-bold leading-snug text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 h-px w-full bg-accent/40" />
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 flex items-center gap-3 text-3xl font-bold text-primary">
            Portales y herramientas
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PORTALES.map((p) => (
              <a key={p} href="#" className="flex h-32 items-center justify-center rounded-lg border border-border bg-card p-6 text-center text-sm font-bold text-primary transition hover:border-primary hover:shadow-md">
                {p}
              </a>
            ))}
          </div>
          <div className="mt-10 h-px w-full bg-accent/40" />
        </div>
      </section>

      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 flex items-center gap-3 text-3xl font-bold text-primary">
            <FlaskConical className="h-7 w-7" /> Apoyo a la investigación
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {INVESTIGACION.map((r) => (
              <article key={r.title} className="rounded-lg border border-border bg-card p-6 transition hover:border-primary hover:shadow-md">
                <div className="mb-4 h-36 rounded-md bg-linear-to-br from-primary/20 to-accent/30" />
                <h3 className="text-lg font-bold leading-snug text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 flex items-center gap-3 text-3xl font-bold text-primary">
            Blogs
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOGS.map((b) => (
              <article key={b.title} className="border-b border-border pb-5">
                <div className="text-xs font-bold tracking-widest text-muted-foreground">{b.date}</div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-primary hover:underline">
                  <a href="#">{b.title}</a>
                </h3>
                <div className="mt-2 text-sm italic text-muted-foreground">{b.blog}</div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-right">
            <a href="#" className="text-sm font-semibold text-primary hover:underline">Ver todos los artículos →</a>
          </div>
        </div>
      </section>

      <RenderBlocks blocks={pageBlocks} />
    </>
  )
}



