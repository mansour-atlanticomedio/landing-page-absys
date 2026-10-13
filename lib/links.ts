export interface EnlaceExterno {
  key?: string | null;
  label?: string | null;
  url?: string | null;
}

// Catálogo de "keys" conocidas para enlaces_externos, usado como opciones del select en
// globals/Layout.ts — mantiene el admin de Payload acotado a identificadores que el código ya
// sabe buscar (ver resolveEnlaceExterno), en vez de texto libre propenso a typos
export const ENLACES_EXTERNOS_KEYS = [
  { key: "opac", label: "Catálogo (OPAC)" },
  { key: "dspace", label: "Repositorio institucional (DSpace)" },
  { key: "campus", label: "Campus virtual" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "Twitter / X" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

export type EnlaceExternoKey = (typeof ENLACES_EXTERNOS_KEYS)[number]["key"];

// Busca un enlace externo editable desde Payload (global `layout`, campo `enlaces_externos`) por su
// identificador; si no está configurado en el admin, usa el fallback para no romper páginas ya hechas
export const resolveEnlaceExterno = (
  enlaces: EnlaceExterno[] | null | undefined,
  key: string,
  fallback: string
): string => enlaces?.find((enlace) => enlace.key === key)?.url || fallback;

// Catálogo cerrado de secciones de la web a las que se puede enlazar con ancla. Cada entrada lleva
// su página y el `id` real que existe en el DOM, así el admin elige de una lista y no puede apuntar
// a un id inventado. Añadir una ancla nueva = poner el `id` en el componente + una entrada aquí
export const ANCLAS = [
  { key: "home-noticias", label: "Inicio · Noticias", path: "/", id: "noticias" },
  { key: "investigacion-apoyo", label: "Investigación · Apoyo a la investigación", path: "/investigacion", id: "cta-apoyo" },
] as const;

export type AnclaKey = (typeof ANCLAS)[number]["key"];

export type EnlaceTipo = "interno" | "ancla" | "registro" | "externo";

// Forma cruda de un enlace tal y como lo guarda Payload (navbar, desplegables, footer)
export interface EnlaceRaw {
  tipo?: EnlaceTipo | null;
  to?: string | null;
  ancla?: string | null;
  enlace_key?: string | null;
  url?: string | null;
  link?: string | null;
  nueva_pestana?: boolean | null;
}

export interface EnlaceResuelto {
  href?: string;
  external: boolean;
  newTab: boolean;
}

const isAbsolute = (url: string) => /^https?:\/\//i.test(url);

// Convierte un enlace crudo en una URL final lista para pintar. Los datos anteriores a `tipo`
// (sin tipo) se tratan como "interno" con `to`; un interno que empiece por http se sigue
// considerando externo para no romper el DSpace del seed. Si falta el destino (key sin entrada en
// el registro, ancla desconocida) devuelve `href` undefined y quien llama decide si lo oculta
export const resolveEnlace = (
  raw: EnlaceRaw | null | undefined,
  enlaces: EnlaceExterno[] | null | undefined
): EnlaceResuelto => {
  const tipo = raw?.tipo ?? "interno";
  let href: string | undefined;

  if (tipo === "ancla") {
    const ancla = ANCLAS.find((a) => a.key === raw?.ancla);
    href = ancla ? `${ancla.path}#${ancla.id}` : undefined;
  } else if (tipo === "registro") {
    href = raw?.enlace_key ? resolveEnlaceExterno(enlaces, raw.enlace_key, "") || undefined : undefined;
  } else if (tipo === "externo") {
    href = raw?.url || raw?.link || undefined;
  } else {
    href = raw?.to || undefined;
  }

  const external = href ? isAbsolute(href) : false;
  return { href, external, newTab: raw?.nueva_pestana ?? external };
};

export interface NavItemRaw extends EnlaceRaw {
  label?: string | null;
}

export interface NavSectionRaw extends EnlaceRaw {
  name?: string | null;
  items?: NavItemRaw[] | null;
}

export interface NavItemResuelto extends EnlaceResuelto {
  label: string;
}

export interface NavSectionResuelta extends EnlaceResuelto {
  name: string;
  items: NavItemResuelto[];
}

// Resuelve todo el navbar en servidor: los desplegables sin destino se descartan y una sección sin
// enlace propio ni desplegables también (un botón que no lleva a ningún sitio no aporta nada)
export const resolveNavbar = (
  navbar: NavSectionRaw[] | null | undefined,
  enlaces: EnlaceExterno[] | null | undefined
): NavSectionResuelta[] =>
  (navbar ?? [])
    .map((section) => {
      const items = (section.items ?? [])
        .map((item) => ({ label: item.label ?? "", ...resolveEnlace(item, enlaces) }))
        .filter((item) => item.href);
      return { name: section.name ?? "", items, ...resolveEnlace(section, enlaces) };
    })
    .filter((section) => section.href || section.items.length > 0);

export interface FooterSocialRaw extends EnlaceRaw {
  icon?: string | null;
}

export interface FooterInfoRaw extends EnlaceRaw {
  icon?: string | null;
  label?: string | null;
}

export interface FooterSectionRaw {
  title?: string | null;
  information?: FooterInfoRaw[] | null;
}

// Mismo criterio que el navbar: redes sociales sin destino se descartan; en la información del
// footer se conservan las filas sin enlace (p. ej. el horario es solo texto) con `href` undefined
export const resolveFooterLinks = (
  footer: { social_medias?: FooterSocialRaw[] | null; seccion_info?: FooterSectionRaw[] | null },
  enlaces: EnlaceExterno[] | null | undefined
) => ({
  social_medias: (footer.social_medias ?? [])
    .map((social) => ({ icon: social.icon ?? "", ...resolveEnlace(social, enlaces) }))
    .filter((social) => social.href),
  seccion_info: (footer.seccion_info ?? []).map((section) => ({
    title: section.title ?? "",
    information: (section.information ?? []).map((info) => ({
      icon: info.icon ?? "",
      label: info.label ?? "",
      ...resolveEnlace(info, enlaces),
    })),
  })),
});
