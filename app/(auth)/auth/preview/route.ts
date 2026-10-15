import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { redirectResponse, safeNextPath } from "@/lib/auth/redirects";
import { normalizePageSlug, validatePageSlug } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });

  if (!user || user.collection !== "users") {
    return redirectResponse("/auth/error");
  }

  const slug = normalizePageSlug(new URL(request.url).searchParams.get("slug"));
  if (validatePageSlug(slug) !== true) {
    return redirectResponse("/auth/error");
  }

  const target = safeNextPath(`/${slug}`, "");
  if (!target) {
    return redirectResponse("/auth/error");
  }

  const draft = await draftMode();
  draft.enable();

  return redirectResponse(`${target}?preview=1`);
}
