import type { AbsysAddLectorPayload, AbsysLector } from "@/types/absys.type";
import type { AbsysRawResponse } from "../client";

export type Colectivo = "ALUMN" | "PDI";

export interface Lector {
  id: string;
  externalId: string;
  nombre: string;
  apellidos: string;
  email: string;
  ultimoUso?: string;
  // TODO(F01): Absys siempre devuelve lepass enmascarado (ADR-0005); solo existe para mantener la comparación heredada de handleLoginLector
  lepassLegacy?: string;
}

export interface NuevoLector {
  nombre: string;
  apellidos: string;
  password: string;
  colectivo: string;
  direccion: string;
  email?: string;
  telefono?: string;
}

// TODO(ADR-0005): campo provisional con el que se cruza la identidad del campus
export const EXTERNAL_ID_FIELD = "lemail";

export const COLECTIVOS = {
  ALUMN: { lecolp: "ALUMN", lecocf: "ALIM", maxPrestamos: 3, diasPrestamo: 15 },
  PDI: { lecolp: "PDI", lecocf: "PDIM", maxPrestamos: 10, diasPrestamo: 30 },
} as const;

export const LECOBI = "BIEURO";
export const LECOSU = "MADRID";
export const LECART = "1";

export const formatAbsysDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const resolveColectivo = (value?: string): Colectivo =>
  value && value in COLECTIVOS ? (value as Colectivo) : "ALUMN";

export const toExternalIdQuery = (externalId: string) => ({
  table: "lector",
  [EXTERNAL_ID_FIELD]: externalId,
});

export const extractLectores = (data: AbsysRawResponse): AbsysLector[] => {
  const raw = data.response.lector as AbsysLector | AbsysLector[] | undefined;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
};

export const toLector = (raw: AbsysLector): Lector => ({
  id: String(raw.lenlec),
  externalId: String(raw[EXTERNAL_ID_FIELD]),
  nombre: raw.lenomb ?? "",
  apellidos: raw.leapel ?? "",
  email: raw.lemail ?? "",
  ultimoUso: raw.lefubi,
  lepassLegacy: raw.lepass,
});

export const fromNuevoLector = (datos: NuevoLector, now: Date = new Date()): AbsysAddLectorPayload => {
  const { lecolp, lecocf } = COLECTIVOS[resolveColectivo(datos.colectivo)];

  return {
    lenlec: "0",
    leapel: datos.apellidos,
    lenomb: datos.nombre,
    lepass: datos.password,
    lecolp,
    lecobi: LECOBI,
    lecosu: LECOSU,
    lecart: LECART,
    ledi11: datos.direccion,
    lecocf,
    leacpd: "1",
    lefepd: formatAbsysDateTime(now),
    lemail: datos.email,
    letfn1: datos.telefono,
  };
};

export const lenlecFromAddResponse = (data: AbsysRawResponse): string | null => {
  const lenlec = data.response.lenlec;
  return lenlec === undefined || lenlec === null || lenlec === "" ? null : String(lenlec);
};

export const toLectorCreado = (datos: NuevoLector, lenlec: string): Lector =>
  toLector({ lenlec, lenomb: datos.nombre, leapel: datos.apellidos, lemail: datos.email, lecolp: resolveColectivo(datos.colectivo) });
