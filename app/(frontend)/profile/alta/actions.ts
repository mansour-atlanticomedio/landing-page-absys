"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { linkAbsysLector, requireSession } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/redirects";
import { absys, AbsysInvalidDataError } from "@/lib/integrations/absys";

export interface AltaState {
  error?: string;
}

const CAMPOS_OBLIGATORIOS = ["nombre", "apellidos", "direccion", "colectivo"] as const;

export async function darDeAltaLector(_prev: AltaState, formData: FormData): Promise<AltaState> {
  const session = await requireSession("/profile/alta");
  const next = safeNextPath(formData.get("next") as string | null);
  const campo = (name: string) => String(formData.get(name) ?? "").trim();

  const faltan = CAMPOS_OBLIGATORIOS.filter((name) => !campo(name));
  if (faltan.length > 0) return { error: "Rellena todos los campos obligatorios." };

  try {
    // Si ya existe (p. ej. doble envío del formulario) no se vuelve a crear
    const existente = await absys.findLectorByExternalId(session.email);
    const lector =
      existente ??
      (await absys.createLector({
        nombre: campo("nombre"),
        apellidos: campo("apellidos"),
        direccion: campo("direccion"),
        colectivo: campo("colectivo"),
        telefono: campo("telefono") || undefined,
        email: session.email,
        // Absys exige lepass, pero estos lectores entran siempre por el campus: nadie necesita conocerla
        password: randomBytes(12).toString("base64url"),
      }));

    await linkAbsysLector(session, lector);
  } catch (error) {
    if (error instanceof AbsysInvalidDataError) {
      return { error: "La biblioteca ha rechazado los datos del alta. Revisa los campos o contacta con la biblioteca." };
    }
    return { error: "El sistema de la biblioteca no responde. Inténtalo de nuevo en unos minutos." };
  }

  redirect(next);
}
