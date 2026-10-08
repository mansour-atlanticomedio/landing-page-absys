"use server";

import { headers as getHeaders } from "next/headers";
import { getContactMailbox, sendContactEmail } from "@/collections/Email.service";
import { getSession } from "@/lib/auth/session";
import { type ContactoResultado, procesarContacto } from "@/lib/contacto-envio";
import { COLECTIVO_LABELS } from "@/lib/integrations/absys/mappers/lector";
import { getClient } from "@/lib/payload";
import { getFormTokenSecrets, getMemoryStore, getTrustedIpOptions } from "@/lib/security";

export async function enviarContacto(input: FormData | Record<string, unknown>): Promise<ContactoResultado> {
  const fields = input instanceof FormData ? Object.fromEntries(input.entries()) : (input ?? {});
  const session = await getSession();
  const payload = await getClient();

  return procesarContacto(
    {
      session: session
        ? { id: session.id, email: session.email, nombre: session.nombre, apellidos: session.apellidos, rol: session.colectivo ? COLECTIVO_LABELS[session.colectivo] : undefined }
        : null,
      headers: await getHeaders(),
      store: getMemoryStore(),
      now: Date.now,
      getSecrets: () => getFormTokenSecrets(),
      ipOptions: getTrustedIpOptions(),
      mailbox: getContactMailbox(),
      payload: payload as any,
      enviarCorreo: sendContactEmail,
    },
    fields,
  );
}
