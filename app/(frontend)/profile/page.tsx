import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import ProfileDatosCard from "@/components/ProfileDatosCard";
import { requireSession } from "@/lib/auth/session";
import { absys, type Lector } from "@/lib/integrations/absys";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireSession("/profile");

  let lector: Lector | null = null;
  let absysCaido = false;
  try {
    lector = await absys.findLectorByExternalId(session.email);
  } catch {
    absysCaido = true;
  }

  if (!lector && !absysCaido) redirect("/profile/alta");

  const nombre = lector ? `${lector.nombre} ${lector.apellidos}` : `${session.nombre ?? ""} ${session.apellidos ?? ""}`;

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 className="font-display text-3xl font-bold text-primary">Mi cuenta</h1>

      {absysCaido && (
        <div className="flex items-center gap-2 p-3 text-sm rounded-md border border-border bg-muted text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 text-accent" />
          El sistema de la biblioteca no responde; te mostramos los últimos datos guardados.
        </div>
      )}

      <ProfileDatosCard
        nombre={nombre.trim() || "—"}
        email={session.email}
        numeroLector={lector?.id ?? session.absysId ?? "—"}
      />
    </section>
  );
}
