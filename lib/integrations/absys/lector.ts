import type { AbsysClient } from "./client";
import { AbsysInvalidDataError } from "./errors";
import {
  extractLectores,
  fromNuevoLector,
  lenlecFromAddResponse,
  toExternalIdQuery,
  toLector,
  toLectorCreado,
  type Lector,
  type NuevoLector,
} from "./mappers/lector";

export const createLectorService = (client: AbsysClient) => ({
  async findLectorByExternalId(externalId: string): Promise<Lector | null> {
    const data = await client.search(toExternalIdQuery(externalId));
    const lectores = extractLectores(data);

    if (lectores.length === 0) return null;
    if (lectores.length > 1) {
      throw new AbsysInvalidDataError(`Absys devolvió ${lectores.length} lectores para el mismo identificador`);
    }
    return toLector(lectores[0]);
  },

  // NO VERIFICADO contra Absys real (error -400 pendiente con Baratz)
  async createLector(datos: NuevoLector): Promise<Lector> {
    const data = await client.add("lector", { ...fromNuevoLector(datos) });
    const lenlec = lenlecFromAddResponse(data);

    if (!lenlec) {
      throw new AbsysInvalidDataError("Absys no devolvió el número del lector creado");
    }
    return toLectorCreado(datos, lenlec);
  },
});
