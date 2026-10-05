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
