import { redirect } from "next/navigation";
import AltaLectorForm from "@/components/AltaLectorForm";
import { requireSession } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/redirects";
import { absys } from "@/lib/integrations/absys";
import { darDeAltaLector } from "./actions";

export const dynamic = "force-dynamic";

export default async function AltaLectorPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const session = await requireSession("/profile/alta");
  const next = safeNextPath((await searchParams).next);

  // Si ya tiene ficha en Absys no pinta nada aquí
  const lector = await absys.findLectorByExternalId(session.email).catch(() => null);
  if (lector) redirect(next);

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <AltaLectorForm email={session.email} next={next} action={darDeAltaLector} />
    </section>
  );
}
