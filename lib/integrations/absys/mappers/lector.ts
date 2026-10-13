import type { AbsysAddLectorPayload, AbsysLector } from "@/types/absys.type";
import type { AbsysRawResponse } from "../client";

// Tipos de lector reales de Absys (dados por el usuario, 2026-09-29), cada uno con su dominio de
// correo institucional (ver deriveCampusIdentity): ADULT (personal, @atlanticomedio.es a secas),
// ALUMN (alumnado, @alu.), ANONI (rol más básico / fallback para cualquier otro dominio), INVIT
// (externos, @unam.) y PROFE (profesores, @pdi.)
export type Colectivo = "ADULT" | "ALUMN" | "ANONI" | "INVIT" | "PROFE";

// Mismas etiquetas que el select `colectivo` de collections/LoginCampus.service.ts
export const COLECTIVO_LABELS: Record<Colectivo, string> = {
  ADULT: "Personal",
  ALUMN: "Estudiante",
  ANONI: "Básico",
  INVIT: "Invitado",
  PROFE: "Profesor",
};

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

interface PerfilColectivo {
  lecolp: Colectivo;
  lecocf?: string;
  maxPrestamos?: number;
  diasPrestamo?: number;
}

// lecocf/maxPrestamos/diasPrestamo (perfil de préstamo) solo están confirmados para ALUMN y PROFE
// (venían de antes, PROFE se llamaba PDI); para ADULT/ANONI/INVIT falta confirmar con Baratz, así
// que se manda sin lecocf (campo opcional en AbsysAddLectorPayload) en vez de inventar un valor
export const COLECTIVOS: Record<Colectivo, PerfilColectivo> = {
  ADULT: { lecolp: "ADULT" },
  ALUMN: { lecolp: "ALUMN", lecocf: "ALIM", maxPrestamos: 3, diasPrestamo: 15 },
  ANONI: { lecolp: "ANONI" },
  INVIT: { lecolp: "INVIT" },
  PROFE: { lecolp: "PROFE", lecocf: "PDIM", maxPrestamos: 10, diasPrestamo: 30 },
};

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

// Placeholder de dirección para el alta automática: el campus no manda dirección y Absys la exige
export const DIRECCION_AUTO_ALTA = "-";

const capitalizar = (palabra: string): string =>
  palabra ? palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() : palabra;

// El campus manda el correo como nombre.apellidos@{pdi|alu|unam}.atlanticomedio.es, o sin
// subdominio para el resto de personal (nombre.apellidos@atlanticomedio.es); cualquier otro
// dominio (fuera de la institución) no da para más que el rol más básico. Se comprueba en ese
// orden —pdi, alu, unam, atlanticomedio.es a secas, y el resto cae a ANONI— para derivar
// nombre/apellidos/rol, tanto para el alta automática en Absys como para guardar el rol en Payload
export const deriveCampusIdentity = (email: string): { nombre: string; apellidos: string; rol: Colectivo } => {
  const [local = "", dominio = ""] = email.split("@");
  const [nombreRaw, ...apellidosRaw] = local.split(".");

  const nombre = capitalizar(nombreRaw || local) || "-";
  const apellidos = apellidosRaw.length > 0 ? apellidosRaw.map(capitalizar).join(" ") : "-";

  const dominioLower = dominio.toLowerCase();
  const rol: Colectivo = dominioLower.startsWith("pdi.")
    ? "PROFE"
    : dominioLower.startsWith("alu.")
      ? "ALUMN"
      : dominioLower.startsWith("unam.")
        ? "INVIT"
        : dominioLower === "atlanticomedio.es"
          ? "ADULT"
          : "ANONI";

  return { nombre, apellidos, rol };
};

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

// Único subconjunto de datos que se puede editar desde /perfil (ver decisión del usuario, 2026-09-29)
export interface ActualizarLector {
  nombre: string;
  apellidos: string;
}

export const toModifyLectorQuery = (lenlec: string, datos: ActualizarLector) => ({
  table: "lector",
  lenlec,
  lenomb: datos.nombre,
  leapel: datos.apellidos,
});

export const lenlecFromAddResponse = (data: AbsysRawResponse): string | null => {
  const lenlec = data.response.lenlec;
  return lenlec === undefined || lenlec === null || lenlec === "" ? null : String(lenlec);
};

export const toLectorCreado = (datos: NuevoLector, lenlec: string): Lector =>
  toLector({ lenlec, lenomb: datos.nombre, leapel: datos.apellidos, lemail: datos.email, lecolp: resolveColectivo(datos.colectivo) });
