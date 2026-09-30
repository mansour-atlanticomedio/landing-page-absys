import AvisoCuenta from "@/components/cuenta/AvisoCuenta";
import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mis reservas | Biblioteca UNAM" };

// TODO(F10): Absys responde "Access denied 'reserv'" con el rol actual de Connect; pedir a Baratz permiso de lectura
export default async function ReservasPage() {
  await requireSession("/reservas");

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold text-primary">Reservas</h2>
        <p className="text-sm text-muted-foreground mt-1">Ejemplares que has reservado y su estado.</p>
      </header>

      <AvisoCuenta>
        La consulta de reservas en línea estará disponible próximamente. Mientras tanto, puedes consultar o gestionar
        tus reservas en el mostrador de préstamo o{" "}
        <a href="/biblioteca/contacto" className="text-accent underline-offset-4 hover:underline">
          contactando con la biblioteca
        </a>
        .
      </AvisoCuenta>
    </div>
  );
}
