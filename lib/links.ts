export interface EnlaceExterno {
  key?: string | null;
  label?: string | null;
  url?: string | null;
}

// Busca un enlace externo editable desde Payload (global `layout`, campo `enlaces_externos`) por su
// identificador; si no está configurado en el admin, usa el fallback para no romper páginas ya hechas
export const resolveEnlaceExterno = (
  enlaces: EnlaceExterno[] | null | undefined,
  key: string,
  fallback: string
): string => enlaces?.find((enlace) => enlace.key === key)?.url || fallback;
