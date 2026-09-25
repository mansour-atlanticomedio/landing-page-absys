import { createCatalogoService } from "./catalogo";
import type { AbsysClient, AbsysRawResponse } from "./client";
import { createLectorService } from "./lector";
import { EXTERNAL_ID_FIELD } from "./mappers/lector";
import type { AbsysAdapter } from "./index";
import catalogoRecurso from "./__fixtures__/catalogo-recurso.json";
import catalogoSearch from "./__fixtures__/catalogo-search.json";
import lectorAdd from "./__fixtures__/lector-add.json";
import lectorSearch from "./__fixtures__/lector-search.json";
import lectorSearchVacio from "./__fixtures__/lector-search-vacio.json";

const MOCK_EXTERNAL_ID = lectorSearch.response.lector[EXTERNAL_ID_FIELD];

const mockClient: AbsysClient = {
  async search(params) {
    if (params.table === "lector") {
      const found = String(params[EXTERNAL_ID_FIELD]) === MOCK_EXTERNAL_ID;
      return (found ? lectorSearch : lectorSearchVacio) as AbsysRawResponse;
    }
    return (params._description ? catalogoRecurso : catalogoSearch) as AbsysRawResponse;
  },
  async add() {
    return lectorAdd as AbsysRawResponse;
  },
};

export const absysMock: AbsysAdapter = {
  ...createLectorService(mockClient),
  ...createCatalogoService(mockClient),
};
