"use server";

import { linkAbsysLector, requireSession } from "@/lib/auth/session";
import { absys, AbsysInvalidDataError } from "@/lib/integrations/absys";

export interface EditarPerfilState {
  error?: string;
  success?: boolean;
}

// Solo nombre/apellidos son editables desde aquí (decisión del usuario, 2026-09-29):
// el resto de la ficha (dirección, colectivo, email) no se toca desde la web
export async function actualizarPerfil(_prev: EditarPerfilState, formData: FormData): Promise<EditarPerfilState> {
  const session = await requireSession("/perfil");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellidos = String(formData.get("apellidos") ?? "").trim();

  if (!nombre || !apellidos) return { error: "Rellena nombre y apellidos." };

  try {
    const actual = await absys.findLectorByExternalId(session.email);
    if (!actual) return { error: "No se encontró tu ficha de lector. Contacta con la biblioteca." };

    const lector = await absys.updateLector(actual, { nombre, apellidos });
    await linkAbsysLector(session, lector);
  } catch (error) {
    if (error instanceof AbsysInvalidDataError) {
      return { error: "La biblioteca ha rechazado los datos. Revisa los campos o contacta con la biblioteca." };
    }
    return { error: "El sistema de la biblioteca no responde. Inténtalo de nuevo en unos minutos." };
  }

  return { success: true };
}
