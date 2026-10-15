import { draftMode } from "next/headers";
import { redirectResponse, safeNextPath } from "@/lib/auth/redirects";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const next = new URL(request.url).searchParams.get("next");
  return redirectResponse(safeNextPath(next, "/"));
}
