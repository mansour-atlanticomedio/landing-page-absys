import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { buildCampusLoginUrl, redirectResponse, safeNextPath } from "@/lib/auth/redirects";
import { devToolsEnabled } from "@/lib/env";

export const dynamic = "force-dynamic";

// Punto de entrada único al login: si ya hay sesión vuelve a `next`, si no manda al campus
export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (await getSession(request.headers)) return redirectResponse(next);

  const campusUrl = buildCampusLoginUrl(next);
  if (campusUrl) {
    return new Response(null, { status: 303, headers: { Location: campusUrl, "Cache-Control": "no-store" } });
  }

  // Mientras el campus no esté configurado, en desarrollo se simula su redirección
  if (devToolsEnabled) {
    return redirectResponse(`/auth/simular-campus?next=${encodeURIComponent(next)}`);
  }
  return redirectResponse("/auth/error");
}
