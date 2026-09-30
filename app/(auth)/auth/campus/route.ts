import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { createCampusSession } from "@/lib/auth/session";
import { redirectResponse, safeNextPath } from "@/lib/auth/redirects";
import { absys, deriveCampusIdentity, DIRECCION_AUTO_ALTA } from "@/lib/integrations/absys";
import { CampusTokenError, verifyCampusToken, type CampusIdentity } from "@/lib/integrations/campus/token";
import { getClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

// Callback al que vuelve el campus con el token cifrado (fecha|email)
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeNextPath(params.get("next"));
  const token = params.get(process.env.NEXT_CAMPUS_TOKEN_PARAM || "token");
  const payload = await getClient();

  if (!token) return redirectResponse("/auth/error");

  let identity: CampusIdentity;
  try {
    identity = verifyCampusToken(token);
  } catch (error) {
    const motivo = error instanceof CampusTokenError ? error.reason : "config";
    payload.logger.warn(`Login campus rechazado: ${motivo}`);
    return redirectResponse("/auth/error");
  }

  try {
    // El rol se deriva del dominio del correo (pdi → alu → unam → resto del dominio institucional
    // → ANONI) antes de tocar Absys: sirve tanto para el colectivo del alta automática como para
    // guardarlo en Payload
    const { nombre, apellidos, rol } = deriveCampusIdentity(identity.email);
    let lector = await absys.findLectorByExternalId(identity.email);

    // Validado por el campus es suficiente: si no tiene ficha en Absys, se crea automáticamente
    // (solo con lo que da el campus) y el resto de datos se completan luego desde /perfil
    if (!lector) {
      lector = await absys.createLector({
        nombre,
        apellidos,
        colectivo: rol,
        direccion: DIRECCION_AUTO_ALTA,
        email: identity.email,
        // Absys exige lepass, pero estos lectores entran siempre por el campus: nadie necesita conocerla
        password: randomBytes(12).toString("base64url"),
      });
    }

    const cookie = await createCampusSession(identity.email, lector, rol);
    return redirectResponse(next, cookie);
  } catch (error) {
    payload.logger.error(error);
    return redirectResponse("/auth/error");
  }
}
