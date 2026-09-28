import { redirect } from "next/navigation";
import AvisoCuenta from "@/components/cuenta/AvisoCuenta";
import PrestamosTabla from "@/components/cuenta/PrestamosTabla";
import { requireSession } from "@/lib/auth/session";
import { absys, isPrestamoVencido, type Prestamo } from "@/lib/integrations/absys";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mis préstamos | Biblioteca UNAM" };

export default async function PrestamosPage() {
  const session = await requireSession("/prestamos");

  let prestamos: Prestamo[] | null = null;
  try {
    const lector = await absys.findLectorByExternalId(session.email);
    if (!lector) redirect("/perfil/alta?next=/prestamos");
    prestamos = await absys.findPrestamosByLector(lector.id);
  } catch (error) {
    // redirect() lanza una excepción propia de Next que no hay que tragarse
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    prestamos = null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold text-primary">Préstamos en curso</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ejemplares que tienes prestados actualmente y su fecha de devolución.
        </p>
      </header>

      {prestamos === null ? (
        <AvisoCuenta>El sistema de la biblioteca no responde. Inténtalo de nuevo en unos minutos.</AvisoCuenta>
      ) : prestamos.length === 0 ? (
        <AvisoCuenta>No tienes ningún préstamo en curso.</AvisoCuenta>
      ) : (
        <PrestamosTabla prestamos={prestamos.map((p) => ({ ...p, vencido: isPrestamoVencido(p) }))} />
      )}

      <p className="text-xs text-muted-foreground">
        Para renovar un préstamo o resolver cualquier incidencia, dirígete al mostrador de préstamo o{" "}
        <a href="/biblioteca/contacto" className="text-accent underline-offset-4 hover:underline">
          contacta con la biblioteca
        </a>
        .
      </p>
    </div>
  );
}
