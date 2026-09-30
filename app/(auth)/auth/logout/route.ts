import { destroyCampusSession } from "@/lib/auth/session";
import { redirectResponse } from "@/lib/auth/redirects";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const expiredCookie = await destroyCampusSession(request.headers);
  return redirectResponse("/", expiredCookie);
}
