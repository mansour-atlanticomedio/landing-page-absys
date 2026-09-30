import AvisoCuenta from "@/components/cuenta/AvisoCuenta";
import PrestamosTabla from "@/components/cuenta/PrestamosTabla";
import { requireSession } from "@/lib/auth/session";
import { absys, isPrestamoVencido, type Prestamo } from "@/lib/integrations/absys";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mis préstamos | Biblioteca UNAM" };

export default async function PrestamosPage() {
  const session = await requireSession("/prestamos");

  let prestamos: Prestamo[] | null = null;
  let sinFicha = false;
  try {
    const lector = await absys.findLectorByExternalId(session.email);
    if (!lector) sinFicha = true;
    else prestamos = await absys.findPrestamosByLector(lector.id);
  } catch {
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

      {sinFicha ? (
        <AvisoCuenta>No encontramos tu ficha de lector. Contacta con la biblioteca para resolverlo.</AvisoCuenta>
      ) : prestamos === null ? (
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
