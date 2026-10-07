"use server";

import { sendBookSuggestionConfirmationEmail, sendBookSuggestionEmail } from "@/collections/Email.service";
import { getSession } from "@/lib/auth/session";
import { COLECTIVO_LABELS } from "@/lib/integrations/absys/mappers/lector";
import { getClient } from "@/lib/payload";
import { validarLibrosSugeridos } from "@/lib/sugerencias";

export type EnviarSugerenciaResultado = { ok: true; total: number } | { ok: false; error: string };

export async function enviarSugerencia(input: unknown): Promise<EnviarSugerenciaResultado> {
  // El solicitante sale siempre de la sesión del servidor, nunca de lo que mande el formulario
  const session = await getSession();
  if (!session) return { ok: false, error: "Tu sesión ha caducado. Vuelve a iniciar sesión para sugerir un libro." };

  const validacion = validarLibrosSugeridos(input);
  if ("error" in validacion) return { ok: false, error: validacion.error };

  const solicitante = {
    nombre: [session.nombre, session.apellidos].filter(Boolean).join(" ") || session.email,
    email: session.email,
    rol: session.colectivo ? COLECTIVO_LABELS[session.colectivo] : undefined,
  };

  const payload = await getClient();

  try {
    await sendBookSuggestionEmail(payload, { solicitante, libros: validacion.libros });
  } catch (err: any) {
    payload.logger.error({ err }, "No se pudo enviar el correo de sugerencia de libro");
    return { ok: false, error: "No hemos podido enviar tu sugerencia. Inténtalo de nuevo en unos minutos." };
  }

  // La confirmación es un extra: si falla no se le dice al usuario que su sugerencia no llegó
  try {
    await sendBookSuggestionConfirmationEmail(payload, { solicitante, libros: validacion.libros });
  } catch (err: any) {
    payload.logger.warn({ err }, "No se pudo enviar la confirmación de sugerencia de libro");
  }

  return { ok: true, total: validacion.libros.length };
}
