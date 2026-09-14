import { getClient } from "@/lib/payload";
import InvestigationContent from "@/components/InvestigationContent";

export const dynamic = 'force-dynamic';

const ACCESOS_RAPIDOS_FALLBACK = [
  { icon: "Search", title: "Buscar información" },
  { icon: "Megaphone", title: "Publicar y difundir" },
  { icon: "Lock", title: "Acceso abierto" },
  { icon: "Fingerprint", title: "Perfiles académicos" },
  { icon: "BarChart3", title: "Indicadores" },
];

const TARJETAS_FALLBACK = [
  {
    icon: "Search",
    title: "Buscar información científica",
    description: "Accede a recursos para localizar publicaciones, revisar antecedentes y desarrollar búsquedas bibliográficas de forma sistemática.",
    cta: "Acceder a Recursos electrónicos",
    link: "/recursos/recursos-electronicos",
  },
  {
    icon: "Megaphone",
    title: "Publicar y difundir",
    description: "Consulta orientaciones para seleccionar revistas, revisar sus características, conocer sus condiciones de publicación y mejorar la difusión de los resultados.",
  },
  {
    icon: "Lock",
    title: "Acceso abierto y repositorio",
    description: "Encuentra información sobre repositorios, versiones de los documentos, licencias, derechos de autor y posibilidades de difusión en acceso abierto.",
    cta: "Acceder al Repositorio institucional",
    link: "http://172.23.2.44:4000/dspace",
  },
  {
    icon: "Fingerprint",
    title: "Firma, ORCID y perfiles académicos",
    description: "Consulta recomendaciones para utilizar una firma coherente, indicar correctamente la afiliación institucional y mantener actualizados los identificadores y perfiles académicos.",
  },
  {
    icon: "BarChart3",
    title: "Indicadores y evaluación de la investigación",
    description: "Accede a fuentes de información relacionadas con citación, impacto, acreditaciones y sexenios. La Biblioteca ofrece orientación sobre los recursos disponibles, pero no interpreta convocatorias ni garantiza resultados en los procesos de evaluación.",
  },
];

const CTA_FALLBACK = {
  title: "Solicitar apoyo",
  subtitle: "Puedes contactar con la Biblioteca para realizar consultas sobre búsqueda bibliográfica, acceso a bases de datos y utilización de los recursos disponibles.",
  button_cta: "Solicitar apoyo",
  button_link: "/contacto",
};

export default async function Investigation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'investigation' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const title = heroData?.title || "Apoyo a la investigación";
  const subtitle =
    heroData?.subtitle ||
    "La Biblioteca reúne recursos y orientaciones para facilitar la búsqueda de información científica, la publicación y difusión de resultados, el acceso abierto y la gestión de la identidad investigadora. Este espacio se ampliará progresivamente con guías, documentos y enlaces adaptados a las necesidades del personal docente e investigador de la Universidad.";
  const imageUrl = heroData?.background_image?.url || "/img/investigacion-hero.jpg";

  const accesosRapidos = homepage?.accesos_rapidos?.feature?.length
    ? homepage.accesos_rapidos.feature
    : ACCESOS_RAPIDOS_FALLBACK;
  const tarjetas = homepage?.tarjetas?.accesos?.length ? homepage.tarjetas.accesos : TARJETAS_FALLBACK;
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
