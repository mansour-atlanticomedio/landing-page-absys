import type { AbsysClient, AbsysRawResponse } from "./client";
import { toCatalogQuery, type CatalogSearchParams } from "./mappers/catalogo";

export const createCatalogoService = (client: AbsysClient) => ({
  searchCatalog(params: CatalogSearchParams): Promise<AbsysRawResponse> {
    return client.search(toCatalogQuery(params));
  },
});
