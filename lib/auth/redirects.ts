export const BASE_PATH = "/biblioteca";
export const DEFAULT_AFTER_LOGIN = "/profile";

// Solo rutas internas de la app: evita que ?next= se use para mandar al usuario a otra web tras el login
export const safeNextPath = (next: string | null | undefined, fallback = DEFAULT_AFTER_LOGIN): string => {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(next)) return fallback;

  const path = next.startsWith(`${BASE_PATH}/`) || next === BASE_PATH ? next.slice(BASE_PATH.length) || "/" : next;
  if (path.startsWith("/auth/")) return fallback;
  return path;
};

// Location relativa: funciona igual detrás de nginx que accediendo directo al contenedor
export const appPath = (path: string) => `${BASE_PATH}${path}`;

export const redirectResponse = (path: string, setCookie?: string, status = 303): Response => {
  const headers = new Headers({ Location: appPath(path), "Cache-Control": "no-store" });
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return new Response(null, { status, headers });
};

export interface CampusLoginConfig {
  loginUrl?: string;
  siteUrl?: string;
  returnParam?: string;
}

const getCampusLoginConfig = (): CampusLoginConfig => ({
  loginUrl: process.env.NEXT_CAMPUS_LOGIN_URL,
  siteUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  returnParam: process.env.NEXT_CAMPUS_RETURN_PARAM,
});

// URL del campus a la que mandamos al usuario sin sesión; null si el campus aún no está configurado
export const buildCampusLoginUrl = (next: string, config: CampusLoginConfig = getCampusLoginConfig()): string | null => {
  if (!config.loginUrl || !config.siteUrl) return null;

  const siteUrl = config.siteUrl.replace(/\/+$/, "");
  const callback = `${siteUrl}/auth/campus?next=${encodeURIComponent(safeNextPath(next))}`;

  const url = new URL(config.loginUrl);
  url.searchParams.set(config.returnParam || "return", callback);
  return url.toString();
};
