import type { NextRequest } from "next/server";
import { redirectResponse, safeNextPath } from "@/lib/auth/redirects";
import { encryptCampusToken } from "@/lib/integrations/campus/token";
import { devToolsEnabled } from "@/lib/env";

export const dynamic = "force-dynamic";

// Solo desarrollo: hace de campus, cifra el email con NEXT_CAMPUS_SECRET_KEY y vuelve al callback real
export async function GET(request: NextRequest) {
  if (!devToolsEnabled) return new Response("No disponible", { status: 404 });

  const params = request.nextUrl.searchParams;
  const email = params.get("email")?.trim();
  const next = safeNextPath(params.get("next"));
  if (!email) return redirectResponse(`/auth/simular-campus?next=${encodeURIComponent(next)}`);

  const token = encryptCampusToken(email);
  const tokenParam = process.env.NEXT_CAMPUS_TOKEN_PARAM || "token";
  return redirectResponse(`/auth/campus?${tokenParam}=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`);
}
