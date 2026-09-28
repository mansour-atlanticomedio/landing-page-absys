import type { AbsysClient } from "./client";
import { extractPrestamos, toPrestamo, toPrestamosQuery, type Prestamo } from "./mappers/prestamo";

export const createPrestamoService = (client: AbsysClient) => ({
  async findPrestamosByLector(lenlec: string): Promise<Prestamo[]> {
    const data = await client.search(toPrestamosQuery(lenlec));
    return extractPrestamos(data).map(toPrestamo);
  },
});
