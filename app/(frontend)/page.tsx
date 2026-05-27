import Hero from "@/components/Hero";
import { RenderBlocks } from "@/components/RenderBlocks";
import { getClient } from "@/lib/payload";

export const dynamic = 'force-dynamic';

import './styles.css'

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
      <RenderBlocks blocks={pageBlocks} />
    </>
  )
}



