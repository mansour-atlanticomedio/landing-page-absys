import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export const DEFAULT_TOKEN_MAX_AGE_SECONDS = 300;
const MAX_CLOCK_SKEW_MS = 60_000;

export interface CampusIdentity {
  email: string;
  fecha: string;
}

export type CampusTokenFailure = "invalido" | "caducado";

export class CampusTokenError extends Error {
  constructor(readonly reason: CampusTokenFailure) {
    super(reason === "caducado" ? "El token del campus ha caducado" : "El token del campus no es válido");
    this.name = "CampusTokenError";
  }
}

// openssl_decrypt de PHP rellena con ceros o recorta la clave a 16 bytes; Node exige exactamente 16
export const toCampusKey = (secret: string): Buffer => {
  const key = Buffer.alloc(16);
  Buffer.from(secret, "utf-8").copy(key, 0, 0, 16);
  return key;
};

const getCampusKey = (): Buffer => {
  const secret = process.env.NEXT_CAMPUS_SECRET_KEY;
  if (!secret) throw new Error("NEXT_CAMPUS_SECRET_KEY no configurada");
  return toCampusKey(secret);
};

// El campus manda la fecha sin zona horaria ("YYYY-MM-DD HH:mm:ss"), en la hora local de su servidor PHP
const getCampusTimeZone = () => process.env.NEXT_CAMPUS_TIMEZONE || "Atlantic/Canary";

// Diferencia en ms entre la hora local de la zona y UTC en un instante dado (cambia con el horario de verano)
const getTimeZoneOffset = (timestamp: number, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(timestamp));
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);

  return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - timestamp;
};

// Convierte la fecha del campus a ISO 8601 en UTC (ej: "2026-09-23T11:04:52.000Z")
export const campusDateToIsoUtc = (fecha: string, timeZone: string = getCampusTimeZone()): string | null => {
  const match = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);

  // Dos pasadas para acertar el offset también en los días de cambio de hora
  let utc = wallClockAsUtc - getTimeZoneOffset(wallClockAsUtc, timeZone);
  utc = wallClockAsUtc - getTimeZoneOffset(utc, timeZone);

  const date = new Date(utc);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

// Versión en Node del descifrado PHP del campus: base64(IV de 16 bytes + AES-128-CBC("fecha|email"))
export const decryptCampusToken = (token: string, key: Buffer = getCampusKey()): CampusIdentity | null => {
  // Si el campus no codifica el token en la URL, los "+" del base64 llegan convertidos en espacios
  const decoded = Buffer.from(token.replace(/ /g, "+"), "base64");
  if (decoded.length <= 16) return null;

  const iv = decoded.subarray(0, 16);
  const encrypted = decoded.subarray(16);

  let decrypted: string;
  try {
    const decipher = createDecipheriv("aes-128-cbc", key, iv);
    decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf-8");
  } catch {
    return null;
  }

  const [fechaCampus, email] = decrypted.split("|");
  if (!fechaCampus || !email) return null;

  const fecha = campusDateToIsoUtc(fechaCampus);
  if (!fecha) return null;

  return { fecha, email: email.trim().toLowerCase() };
};

const formatCampusDate = (date: Date, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  return parts.replace("T", " ");
};

// Solo para simular al campus en desarrollo: genera el mismo formato de token que manda el PHP
export const encryptCampusToken = (
  email: string,
  { now = new Date(), key = getCampusKey(), timeZone = getCampusTimeZone() }: { now?: Date; key?: Buffer; timeZone?: string } = {}
): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-128-cbc", key, iv);
  const plain = `${formatCampusDate(now, timeZone)}|${email}`;
  return Buffer.concat([iv, cipher.update(plain, "utf-8"), cipher.final()]).toString("base64");
};

const getMaxAgeSeconds = () =>
  Number(process.env.NEXT_CAMPUS_TOKEN_MAX_AGE) || DEFAULT_TOKEN_MAX_AGE_SECONDS;

// Además de descifrar, rechaza tokens viejos para que un enlace del campus no sirva indefinidamente
export const verifyCampusToken = (
  token: string,
  { now = new Date(), maxAgeSeconds = getMaxAgeSeconds(), key }: { now?: Date; maxAgeSeconds?: number; key?: Buffer } = {}
): CampusIdentity => {
  const identity = decryptCampusToken(token, key);
  if (!identity) throw new CampusTokenError("invalido");

  const age = now.getTime() - new Date(identity.fecha).getTime();
  if (age < -MAX_CLOCK_SKEW_MS || age > maxAgeSeconds * 1000) {
    throw new CampusTokenError("caducado");
  }
  return identity;
};
