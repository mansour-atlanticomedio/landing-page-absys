"use client";

import { Badge } from "@/components/ui/badge";

export interface PrestamoFila {
  ejemplar: string;
  fechaPrestamo: string | null;
  fechaDevolucion: string | null;
  renovaciones: number;
  vencido: boolean;
}

const formatFecha = (iso: string | null) => {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
};

export default function PrestamosTabla({ prestamos }: { prestamos: PrestamoFila[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="py-3 pr-4 font-semibold">Ejemplar</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Fecha de préstamo</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Devolución</th>
            <th scope="col" className="py-3 pr-4 font-semibold">Renovaciones</th>
            <th scope="col" className="py-3 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((p) => (
            <tr key={p.ejemplar} className="border-b border-border last:border-0">
              <td className="py-3 pr-4 font-medium text-foreground">{p.ejemplar}</td>
              <td className="py-3 pr-4">{formatFecha(p.fechaPrestamo)}</td>
              <td className="py-3 pr-4">{formatFecha(p.fechaDevolucion)}</td>
              <td className="py-3 pr-4">{p.renovaciones}</td>
              <td className="py-3">
                {p.vencido ? (
                  <Badge variant="destructive">Vencido</Badge>
                ) : (
                  <Badge variant="outline">En plazo</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
