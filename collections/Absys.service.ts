import type { CollectionConfig, PayloadHandler } from "payload";
import { absys } from "@/lib/integrations/absys";

const jsonOk = (message: unknown) =>
  Response.json({ success: true, message }, { status: 200 });

const jsonError = (message: string, status = 500) =>
  Response.json({ success: false, message }, { status });

// Búsqueda general del catálogo (paginación opcional vía ?page & ?limit)
export const handleSearch: PayloadHandler = async (req) => {
  try {
    const search = (req.query?.search as string) ?? "_";
    const result = await absys.searchCatalog({
      search,
      page: req.query?.page as string,
      limit: req.query?.limit as string,
    });
    return jsonOk(result);
  } catch (error) {
    req.payload.logger.error(error);
    return jsonError("Error al comunicarse con el servicio de biblioteca.");
  }
};

// Búsqueda de un recurso concreto por nombre/ISBN (paginación opcional)
export const handleResourceByName: PayloadHandler = async (req) => {
  try {
    const { name } = req.routeParams as { name: string };
    if (!name) return jsonError("Nombre/ID de recurso requerido", 400);

    const result = await absys.searchCatalog({
      search: name,
      page: req.query?.page as string,
      limit: req.query?.limit as string,
      detalle: true,
    });
    return jsonOk(result);
  } catch (error) {
    req.payload.logger.error(error);
    return jsonError("Error al buscar el recurso específico.");
  }
};

export const AbsysService: CollectionConfig = {
  slug: "absys_service",
  admin: { hidden: true },
  access: { read: () => true },
  fields: [
    { name: "isbn", label: "ISBN", type: "text" },
    { name: "title", label: "Título", type: "text" },
    { name: "author", label: "Autor", type: "text" },
  ],
  endpoints: [
    { path: "/:name", method: "get", handler: handleResourceByName },
    { path: "/", method: "get", handler: handleSearch },
  ],
};