import type { NextRequest } from "next/server";
import { createCampusSession } from "@/lib/auth/session";
import { redirectResponse, safeNextPath } from "@/lib/auth/redirects";
import { absys } from "@/lib/integrations/absys";
import { CampusTokenError, verifyCampusToken, type CampusIdentity } from "@/lib/integrations/campus/token";
import { getClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

// Callback al que vuelve el campus con el token cifrado (fecha|email)
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const next = safeNextPath(params.get("next"));
  const token = params.get(process.env.NEXT_CAMPUS_TOKEN_PARAM || "token");
  const payload = await getClient();

  if (!token) return redirectResponse("/auth/error?motivo=invalido");

  let identity: CampusIdentity;
  try {
    identity = verifyCampusToken(token);
  } catch (error) {
    const motivo = error instanceof CampusTokenError ? error.reason : "config";
    payload.logger.warn(`Login campus rechazado: ${motivo}`);
    return redirectResponse(`/auth/error?motivo=${motivo}`);
  }

  try {
    const lector = await absys.findLectorByExternalId(identity.email);
    const cookie = await createCampusSession(identity.email, lector);

    // Sin lector en Absys: tiene sesión, pero antes de seguir tiene que completar el alta
    const destino = lector ? next : `/profile/alta?next=${encodeURIComponent(next)}`;
    return redirectResponse(destino, cookie);
  } catch (error) {
    payload.logger.error(error);
    return redirectResponse("/auth/error?motivo=absys");
  }
}
