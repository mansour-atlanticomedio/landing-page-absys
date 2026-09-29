import AvisoCuenta from "@/components/cuenta/AvisoCuenta";
import PerfilForm from "@/components/cuenta/PerfilForm";
import { requireSession } from "@/lib/auth/session";
import { absys, type Lector } from "@/lib/integrations/absys";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mi perfil | Biblioteca UNAM" };

// Mismas etiquetas que collections/LoginCampus.service.ts (campo `colectivo`)
const ROL_LABELS: Record<string, string> = {
  ADULT: "Personal",
  ALUMN: "Estudiante",
  ANONI: "Básico",
  INVIT: "Invitado",
  PROFE: "Profesor",
};

export default async function PerfilPage() {
  const session = await requireSession("/perfil");

  let lector: Lector | null = null;
  let absysCaido = false;
  try {
    lector = await absys.findLectorByExternalId(session.email);
  } catch {
    absysCaido = true;
  }

  const datos = [
    { label: "Número de lector", value: lector?.id ?? session.absysId ?? "—" },
    { label: "Correo electrónico", value: session.email },
    { label: "Rol", value: (session.colectivo && ROL_LABELS[session.colectivo]) || "—" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold text-primary">Datos del lector</h2>
        <p className="text-sm text-muted-foreground mt-1">Información registrada en tu ficha de la biblioteca.</p>
      </header>

      {absysCaido && (
        <AvisoCuenta>El sistema de la biblioteca no responde; te mostramos los últimos datos guardados.</AvisoCuenta>
      )}

      {lector ? (
        <PerfilForm nombre={lector.nombre} apellidos={lector.apellidos} />
      ) : (
        <dl className="divide-y divide-border border-y border-border">
          <div className="grid gap-1 py-4 sm:grid-cols-3">
            <dt className="text-sm text-muted-foreground">Nombre</dt>
            <dd className="sm:col-span-2 font-medium text-foreground break-all">
              {`${session.nombre ?? ""} ${session.apellidos ?? ""}`.trim() || "—"}
            </dd>
          </div>
        </dl>
      )}

      <dl className="divide-y divide-border border-y border-border">
        {datos.map(({ label, value }) => (
          <div key={label} className="grid gap-1 py-4 sm:grid-cols-3">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="sm:col-span-2 font-medium text-foreground break-all">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
