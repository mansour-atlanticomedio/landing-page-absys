import { AbsysAddLectorPayload, AbsysAddLectorResponse } from "@/types/absys.type";
import type { CollectionConfig, Endpoint, PayloadHandler } from "payload";
import { handleCreateLector, handleGetLectorMe, handleLoginLector } from "./LoginAbsys.service";
import { createDecipheriv } from "node:crypto";

class AbsysError extends Error { }

// Versión original en PHP (campus):
// $decoded = base64_decode($cadenaCodificada);
// if ($decoded === false || strlen($decoded) <= 16) {
// 	return null; // Datos inválidos
// }
// $iv = substr($decoded, 0, 16); // Primeros 16 bytes = IV
// $encrypted = substr($decoded, 16); // El resto = datos cifrados
// $decrypted = openssl_decrypt($encrypted, 'AES-128-CBC', SECRET_KEY, OPENSSL_RAW_DATA, $iv);
// if ($decrypted === false) {
// 	return null;
// }
// list($fecha, $email) = explode("|", $decrypted);
// return ['fecha' => $fecha, 'email' => $email];

// openssl_decrypt de PHP rellena con ceros o recorta la clave a 16 bytes; Node exige exactamente 16
const getCampusKey = (): Buffer => {
  const secret = process.env.NEXT_CAMPUS_SECRET_KEY;
  if (!secret) throw new Error("NEXT_CAMPUS_SECRET_KEY no configurada");

  const key = Buffer.alloc(16);
  Buffer.from(secret, "utf-8").copy(key, 0, 0, 16);
  return key;
};

// El campus manda la fecha sin zona horaria ("YYYY-MM-DD HH:mm:ss"), en la hora local de su servidor PHP
const CAMPUS_TIMEZONE = process.env.NEXT_CAMPUS_TIMEZONE || "Atlantic/Canary";

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
const campusDateToIsoUtc = (fecha: string, timeZone: string = CAMPUS_TIMEZONE): string | null => {
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

const passwordDecript = (passwordString: string): { fecha: string; email: string } | null => {
  const decoded = Buffer.from(passwordString, "base64");
  if (decoded.length <= 16) return null;

  // Primeros 16 bytes = IV, el resto = datos cifrados
  const iv = decoded.subarray(0, 16);
  const encrypted = decoded.subarray(16);

  const key = getCampusKey();

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

  return { fecha, email };
};

// Endpoint temporal para comprobar que desciframos los tokens del campus. No debe llegar a producción
export const handleDecryptTest: PayloadHandler = async (req) => {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ success: false, message: "No disponible" }, { status: 404 });
  }

  // El token puede venir en el body ({ token }) o en la ruta; en la ruta hay que mandarlo con encodeURIComponent
  let token = "";
  try {
    const body = typeof req.json === "function" ? await req.json() : null;
    token = body?.token ?? "";
  } catch {
    token = "";
  }
  if (!token) {
    const { id } = (req.routeParams ?? {}) as { id?: string };
    token = id ? decodeURIComponent(id) : "";
  }

  if (!token) {
    return Response.json({ success: false, message: "Falta el token" }, { status: 400 });
  }

  try {
    const result = passwordDecript(token);
    if (!result) {
      return Response.json({ success: false, message: "Token inválido o clave incorrecta" }, { status: 400 });
    }
    return Response.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    req.payload.logger.error((error as Error).message);
    return Response.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
};

export const decryptTestEndpoints: Endpoint[] = [
  { path: "/loginCampus/login/password", method: "post", handler: handleDecryptTest },
  { path: "/loginCampus/login/password/:id", method: "post", handler: handleDecryptTest },
];

export const LoginCampusService: CollectionConfig = {
  slug: "loginCampus_service",
  auth: {
    tokenExpiration: 1800,
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      return true;
    },
  },
  fields: [
    { name: "dni", type: "text", required: true, unique: true, index: true },
    { name: "nombre", type: "text", required: true },
    { name: "apellidos", type: "text", required: true },
    { name: "numeroCarnet", type: "text", unique: true, index: true },
    {
      name: "colectivo",
      type: "select",
      required: true,
      defaultValue: "ALUMN",
      options: [
        { label: "Estudiante", value: "ALUMN" },
        { label: "PDI", value: "PDI" },
        { label: "PAS", value: "PAS" },
        { label: "Externo", value: "EXT" },
      ],
    },
    { name: "maxPrestamos", type: "number" },
    { name: "diasPrestamo", type: "number" },
    { name: "isOfflineData", type: "checkbox", defaultValue: false },
  ],
  endpoints: [
    { path: "/signin", method: "post", handler: handleCreateLector },
    { path: "/login/password/:id", method: "post", handler: handleDecryptTest },
    { path: "/login/:credentials", method: "post", handler: handleLoginLector },
    { path: "/me", method: "get", handler: handleGetLectorMe },
  ],
};