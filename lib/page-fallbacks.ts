import { DSPACE_URL_POR_DEFECTO } from "@/lib/links";

const DSPACE_FALLBACK = DSPACE_URL_POR_DEFECTO;

export const ENLACES_RAPIDOS_FALLBACK = [
  { label: "Recomendaciones sobre búsqueda y evaluación", link: "#" },
  { label: "Acceso a Recursos electrónicos", link: "/recursos/recursos-electronicos" },
];

export const CITAR_CTA_FALLBACK = {
  title: "Citar correctamente y evitar el plagio",
  subtitle:
    "Citar permite reconocer las ideas, datos y materiales procedentes de otras fuentes, diferenciar las aportaciones propias y facilitar que otras personas puedan localizar la información original.\nAnota los datos bibliográficos durante la búsqueda, utiliza el estilo de citación requerido y revisa que todas las citas aparezcan recogidas en la lista final de referencias.",
  button_cta: "Recomendaciones sobre citación y plagio",
  button_link: "#",
};

export const GUIA_TUTORIAL_FALLBACK = {
  title: "Acceder a guías y tutoriales disponibles",
  description: "Colección de recursos de autoaprendizaje",
  link: "#",
};

export const ACCESOS_RAPIDOS_FALLBACK = [
  { icon: "Search", title: "Buscar información" },
  { icon: "Megaphone", title: "Publicar y difundir" },
  { icon: "Lock", title: "Acceso abierto" },
  { icon: "Fingerprint", title: "Perfiles académicos" },
  { icon: "BarChart3", title: "Indicadores" },
];

export const TARJETAS_FALLBACK = [
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
    link: DSPACE_FALLBACK,
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

export const CTA_FALLBACK = {
  title: "Solicitar apoyo",
  subtitle: "Puedes contactar con la Biblioteca para realizar consultas sobre búsqueda bibliográfica, acceso a bases de datos y utilización de los recursos disponibles.",
  button_cta: "Solicitar apoyo",
  button_link: "/biblioteca/conocenos/horarios-ubicacion-y-contacto",
};

export const FORMACION_SUBTITULO_FALLBACK = "La Biblioteca ofrece recursos de apoyo para desarrollar las competencias necesarias para buscar, evaluar, utilizar y comunicar información académica de manera eficaz, crítica y responsable.";

export const FORMACION_BUSCAR_1_FALLBACK = "Una búsqueda eficaz comienza con la definición clara del tema, la selección de palabras clave y la elección del recurso más adecuado.";

export const FORMACION_BUSCAR_2_FALLBACK = "Antes de utilizar una fuente, revisa su autoría, actualidad, procedencia, finalidad y relación con el tema que estás trabajando.";

export const FORMACION_ACTIVIDADES_TEXTO_FALLBACK = "La Biblioteca podrá organizar sesiones y talleres relacionados con el uso del catálogo, las bases de datos, la búsqueda de información y la citación académica.";

export const FORMACION_ACTIVIDADES_ESTADO_FALLBACK = "Actualmente no hay actividades formativas programadas. Las nuevas sesiones se anunciarán en esta página.";

export const INVESTIGACION_SUBTITULO_FALLBACK = "La Biblioteca reúne recursos y orientaciones para facilitar la búsqueda de información científica, la publicación y difusión de resultados, el acceso abierto y la gestión de la identidad investigadora. Este espacio se ampliará progresivamente con guías, documentos y enlaces adaptados a las necesidades del personal docente e investigador de la Universidad.";

export const SERVICIOS_SUBTITULO_FALLBACK =
  "La Biblioteca ofrece servicios destinados a facilitar el acceso, la consulta y la utilización de los recursos de información disponibles en la Universidad. Aquí encontrarás información sobre la consulta de fondos, el préstamo, las renovaciones, las reservas y la atención de dudas."

export const SERVICIOS_FALLBACK = [
  { icon: "Search", title: "Consulta de fondos", text: "Consulta el catálogo para localizar los libros y recursos disponibles y comprobar su ubicación y disponibilidad.", action_label: "Ir al catálogo", action_href: "/recursos/catalogo" },
  { icon: "BookOpen", title: "Préstamo", text: "Los miembros autorizados de la comunidad universitaria podrán solicitar en préstamo los materiales disponibles, de acuerdo con las condiciones establecidas por la Biblioteca.", badge: "Próximamente" },
  { icon: "RefreshCw", title: "Renovaciones", text: "Los préstamos podrán renovarse siempre que se cumplan las condiciones del servicio y el material no haya sido solicitado por otra persona." },
  { icon: "Bookmark", title: "Reservas", text: "Cuando esta función se encuentre habilitada, podrás reservar determinados materiales desde el catálogo o solicitar información a la Biblioteca.", badge: "Próximamente" },
  { icon: "Headphones", title: "Atención de consultas", text: "La Biblioteca puede ayudarte a localizar recursos, utilizar el catálogo, acceder a las plataformas disponibles y resolver dudas relacionadas con sus servicios.", action_label: "Contactar", action_href: "/conocenos/horarios-ubicacion-y-contacto", wide: true },
]
