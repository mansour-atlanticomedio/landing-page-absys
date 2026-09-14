import { getClient } from "@/lib/payload";
import FormationContent from "@/components/FormationContent";

export const dynamic = 'force-dynamic';

const ENLACES_RAPIDOS_FALLBACK = [
  { label: "Recomendaciones sobre búsqueda y evaluación", link: "#" },
  { label: "Acceso a Recursos electrónicos", link: "/recursos/recursos-electronicos" },
];

const CITAR_CTA_FALLBACK = {
  title: "Citar correctamente y evitar el plagio",
  subtitle:
    "Citar permite reconocer las ideas, datos y materiales procedentes de otras fuentes, diferenciar las aportaciones propias y facilitar que otras personas puedan localizar la información original.\nAnota los datos bibliográficos durante la búsqueda, utiliza el estilo de citación requerido y revisa que todas las citas aparezcan recogidas en la lista final de referencias.",
  button_cta: "Recomendaciones sobre citación y plagio",
  button_link: "#",
};

const GUIA_TUTORIAL_FALLBACK = {
  title: "Acceder a guías y tutoriales disponibles",
  description: "Colección de recursos de autoaprendizaje",
  link: "#",
};

export default async function Formation() {
  const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'formation' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const title = heroData?.title || "Formación";
  const subtitle =
    heroData?.subtitle ||
    "La Biblioteca ofrece recursos de apoyo para desarrollar las competencias necesarias para buscar, evaluar, utilizar y comunicar información académica de manera eficaz, crítica y responsable.";
  const imageUrl = heroData?.background_image?.url || "/img/formacion-hero.jpg";

  const buscarParrafo1 =
    homepage?.buscar_parrafo_1 ||
    "Una búsqueda eficaz comienza con la definición clara del tema, la selección de palabras clave y la elección del recurso más adecuado.";
  const buscarParrafo2 =
    homepage?.buscar_parrafo_2 ||
    "Antes de utilizar una fuente, revisa su autoría, actualidad, procedencia, finalidad y relación con el tema que estás trabajando.";

  const enlacesRapidos = homepage?.enlaces_rapidos?.length ? homepage.enlaces_rapidos : ENLACES_RAPIDOS_FALLBACK;
  const citarCta = homepage?.citar_cta || CITAR_CTA_FALLBACK;

  const tutorialItem = homepage?.guias_tutoriales?.accesos?.[0];
  const guiaTutorial = tutorialItem
    ? { title: tutorialItem.title, description: tutorialItem.description || "", link: tutorialItem.link || "#" }
    : GUIA_TUTORIAL_FALLBACK;

  const actividadesTexto =
    homepage?.actividades_texto ||
    "La Biblioteca podrá organizar sesiones y talleres relacionados con el uso del catálogo, las bases de datos, la búsqueda de información y la citación académica.";
  const actividadesEstado =
    homepage?.actividades_estado ||
    "Actualmente no hay actividades formativas programadas. Las nuevas sesiones se anunciarán en esta página.";

  return (
    <FormationContent
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
      buscarParrafo1={buscarParrafo1}
      buscarParrafo2={buscarParrafo2}
      enlacesRapidos={enlacesRapidos}
      citarCta={citarCta}
      guiaTutorial={guiaTutorial}
      actividadesTexto={actividadesTexto}
      actividadesEstado={actividadesEstado}
    />
  );
}
