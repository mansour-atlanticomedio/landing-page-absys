import { createCatalogoService } from "./catalogo";
import { absysClient, type AbsysRawResponse } from "./client";
import { createLectorService } from "./lector";
import { createPrestamoService } from "./prestamo";
import { absysMock } from "./mock";
import type { CatalogSearchParams } from "./mappers/catalogo";
import type { ActualizarLector, Colectivo, Lector, NuevoLector } from "./mappers/lector";
import type { Prestamo } from "./mappers/prestamo";

export interface AbsysAdapter {
  findLectorByExternalId(externalId: string): Promise<Lector | null>;
  createLector(datos: NuevoLector): Promise<Lector>;
  updateLector(actual: Lector, datos: ActualizarLector): Promise<Lector>;
  searchCatalog(params: CatalogSearchParams): Promise<AbsysRawResponse>;
  findPrestamosByLector(lenlec: string): Promise<Prestamo[]>;
}

const absysReal: AbsysAdapter = {
  ...createLectorService(absysClient),
  ...createCatalogoService(absysClient),
  ...createPrestamoService(absysClient),
};

export const absys: AbsysAdapter = process.env.ABSYS_MOCK === "true" ? absysMock : absysReal;

export type { ActualizarLector, Colectivo, Lector, NuevoLector, CatalogSearchParams, AbsysRawResponse, Prestamo };
export { deriveCampusIdentity, resolveColectivo, DIRECCION_AUTO_ALTA } from "./mappers/lector";
export { isPrestamoVencido } from "./mappers/prestamo";
export { AbsysError, AbsysNotFoundError, AbsysUnavailableError, AbsysInvalidDataError } from "./errors";
