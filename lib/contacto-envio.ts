import { validarContacto } from "@/lib/contacto";
import {
  type ClientIpOptions,
  type RateLimitStore,
  SecurityConfigError,
  buildEmailRules,
  checkHoneypot,
  checkLimits,
  dedupeHash,
  getClientIp,
  refundLimits,
  slidingWindowCount,
} from "@/lib/security";

export const CONTACTO_PURPOSE = "contacto";
export const DEDUPE_WINDOW_MS = 10 * 60_000;

export type ContactoCodigo = "sesion" | "recargar" | "validacion" | "limite" | "no_disponible" | "config" | "envio";

export type ContactoResultado =
  | { ok: true; duplicado?: boolean }
  | { ok: false; code: ContactoCodigo; error: string; retryAfterSec?: number };

export interface ContactoSesion {
  id: string | number;
  email: string;
  nombre?: string;
  apellidos?: string;
  rol?: string;
}

export interface ContactoPayload {
  logger: { info: (obj: any, msg?: string) => void; warn: (obj: any, msg?: string) => void; error: (obj: any, msg?: string) => void };
  create: (args: any) => Promise<unknown>;
}

export interface ContactoDeps {
  session: ContactoSesion | null;
  headers: Headers;
  store: RateLimitStore;
  now: () => number;
  getSecrets: () => string[];
  ipOptions: ClientIpOptions;
  mailbox: string;
  payload: ContactoPayload;
  enviarCorreo: (
    payload: any,
    data: { solicitante: { nombre: string; email: string; rol?: string }; asunto: string; mensaje: string },
  ) => Promise<void>;
}

// El correo completo no se vuelca en logs: solo lo justo para reconocer el dominio
export const maskEmail = (email: string) => {
  const at = email.lastIndexOf("@");
  return at < 1 ? "***" : `${email.slice(0, Math.min(2, at))}***${email.slice(at)}`;
};

const fail = (code: ContactoCodigo, error: string, retryAfterSec?: number): ContactoResultado => ({ ok: false, code, error, retryAfterSec });

const MSG_RECARGAR = "El formulario ha caducado. Recarga la página e inténtalo de nuevo.";
const MSG_NO_DISPONIBLE = "El servicio no está disponible en este momento. Inténtalo de nuevo en unos minutos.";

const formatRetry = (sec: number) => (sec < 90 ? "un minuto" : sec < 5400 ? `${Math.ceil(sec / 60)} minutos` : `${Math.ceil(sec / 3600)} horas`);

// Orden: sesión, honeypot, validación, límites, dedupe, histórico y envío. Falla cerrado ante cualquier error de seguridad
export async function procesarContacto(deps: ContactoDeps, input: Record<string, unknown>): Promise<ContactoResultado> {
  const { session, payload } = deps;
  const log = (level: "info" | "warn" | "error", event: string, extra: Record<string, unknown> = {}, err?: unknown) =>
    payload.logger[level]({ event, userId: session?.id, ...extra, ...(err ? { err } : {}) }, event);

  if (!session) return fail("sesion", "Inicia sesión para escribirnos.");

  const now = deps.now();
  const ip = getClientIp(deps.headers, deps.ipOptions);

  try {
    const trampa = checkHoneypot(input, { secrets: deps.getSecrets(), purpose: CONTACTO_PURPOSE, now });
    if (!trampa.ok) {
      log("warn", "contacto.honeypot", { reason: trampa.reason, ip });
      // Éxito falso solo para bots evidentes; un humano con token caducado debe saberlo
      if (trampa.reason === "honeypot" || trampa.reason === "too_fast") return { ok: true };
      return fail("recargar", MSG_RECARGAR);
    }
  } catch (err) {
    log("error", "contacto.failed", { reason: err instanceof SecurityConfigError ? "config" : "honeypot_error", ip }, err);
    return fail("config", "No hemos podido procesar tu mensaje. Avisa a la Biblioteca por teléfono o correo.");
  }

  const validacion = validarContacto(input);
  if ("error" in validacion) return fail("validacion", validacion.error);

  let rules: ReturnType<typeof buildEmailRules>;
  try {
    rules = buildEmailRules({
      kind: "contacto",
      ip,
      userId: String(session.id),
      recipient: deps.mailbox,
      internalRecipient: deps.mailbox,
    });
  } catch (err) {
    log("error", "contacto.failed", { reason: "config_mailbox", ip }, err);
    return fail("config", "No hemos podido procesar tu mensaje. Avisa a la Biblioteca por teléfono o correo.");
  }

  let hash: string;
  try {
    const limites = await checkLimits(deps.store, rules, now);
    if (!limites.allowed) {
      const retryAfterSec = Math.max(...limites.violated.map((v) => v.retryAfterSec));
      log("warn", "contacto.rate_limited", {
        ip,
        violated: limites.violated.map((v) => ({ dimension: v.dimension, limit: v.limit, retryAfterSec: v.retryAfterSec })),
      });
      return fail("limite", `Demasiados intentos. Inténtalo de nuevo en ${formatRetry(retryAfterSec)}.`, retryAfterSec);
    }

    hash = dedupeHash({ kind: "contacto", actor: String(session.id), recipient: deps.mailbox, payload: validacion });
  } catch (err) {
    log("error", "contacto.failed", { reason: "store_unavailable", ip }, err);
    return fail("no_disponible", MSG_NO_DISPONIBLE);
  }

  const dedupeKey = `dedupe:contacto:${hash}`;
  try {
    const c = await deps.store.increment(dedupeKey, DEDUPE_WINDOW_MS, now, 2);
    if (slidingWindowCount(c.current, c.previous, now - c.windowStart, DEDUPE_WINDOW_MS) > 1) {
      log("info", "contacto.duplicate", { ip });
      return { ok: true, duplicado: true };
    }
  } catch (err) {
    log("error", "contacto.failed", { reason: "store_unavailable", ip }, err);
    return fail("no_disponible", MSG_NO_DISPONIBLE);
  }

  const nombre = [session.nombre, session.apellidos].filter(Boolean).join(" ") || session.email;

  try {
    await deps.enviarCorreo(payload, {
      solicitante: { nombre, email: session.email, rol: session.rol },
      asunto: validacion.asunto,
      mensaje: validacion.mensaje,
    });
  } catch (err) {
    // Sin esto el reintento se descartaría como duplicado, y una caída del SMTP quemaría cupos del usuario y del buzón
    await deps.store.decrement(dedupeKey, DEDUPE_WINDOW_MS, now).catch(() => undefined);
    await refundLimits(deps.store, rules, now);
    log("error", "contacto.failed", { reason: "smtp", ip }, err);
    return fail("envio", "No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.");
  }

  // El histórico va después del envío (sin registros de mensajes no enviados) y es secundario: si falla solo se avisa en log
  try {
    await payload.create({
      collection: "sendEmail",
      data: { name: nombre, email: session.email, rol: session.rol, about: validacion.asunto, message: validacion.mensaje },
      overrideAccess: true,
    });
  } catch (err) {
    log("warn", "contacto.history_failed", { ip }, err);
  }

  log("info", "contacto.sent", { ip, email: maskEmail(session.email), asuntoLength: validacion.asunto.length, mensajeLength: validacion.mensaje.length });
  return { ok: true };
}
