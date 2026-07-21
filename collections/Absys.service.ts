import type { CollectionConfig, PayloadHandler } from "payload";

const ABSYS_BASE = "cata";
const DOC_FIELDS = "245, 100, 020";
const DEFAULT_PAGE_SIZE = 12;

interface AbsysResponse {
  data: any;
  error?: string;
}

class AbsysError extends Error {}

const getAbsysHeaders = (): Headers => {
  const user = process.env.NEXT_ABSYS_USERNAME;
  const pass = Buffer.from(process.env.NEXT_ABSYS_PASSWORD || '', 'base64').toString('utf-8');

  if (!user || !pass) {
    throw new AbsysError("Credenciales de ABSYS no configuradas");
  }

  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  return new Headers({
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    Accept: "*/*",
    "Cache-Control": "no-cache",
    Cookie: "Path=/",
  });
};

const getPaginationParams = (query: Record<string, any>) => {
  const pagePosition = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE);
  const page = (pagePosition - 1) * limit + 1;
  return { page, limit };
};

const fetchAbsys = async (params: URLSearchParams): Promise<AbsysResponse> => {
  const baseUrl = process.env.NEXT_ABSYS_API;
  if (!baseUrl) throw new AbsysError("NEXT_ABSYS_API no configurada");

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    method: "GET",
    headers: getAbsysHeaders(),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AbsysError(`Absys API Error: ${response.statusText} - ${JSON.stringify(data)}`);
  }

  return data;
};

const buildParams = (opts: {
  search: string;
  extra?: Record<string, string>;
  paginate?: boolean;
  query?: Record<string, any>;
}) => {
  const params = new URLSearchParams();
  params.set("operation", "search");
  params.set("base", ABSYS_BASE);
  params.set("search", opts.search);

  Object.entries(opts.extra ?? {}).forEach(([k, v]) => params.set(k, v));

  if (opts.paginate) {
    const { page, limit } = getPaginationParams(opts.query ?? {});
    params.set("_start_position", String(page));
    params.set("_max_records", String(limit));
  }

  return params;
};

const jsonOk = (message: unknown) =>
  Response.json({ success: true, message }, { status: 200 });

const jsonError = (message: string, status = 500) =>
  Response.json({ success: false, message }, { status });

// Búsqueda general del catálogo (paginación opcional vía ?page & ?limit)
export const handleSearch: PayloadHandler = async (req) => {
  try {
    const search = (req.query?.search as string) ?? "_";
    const params = buildParams({
      search,
      extra: { _doc_fields: DOC_FIELDS },
      paginate: true,
      query: req.query,
    });

    const result = await fetchAbsys(params);
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

    const params = buildParams({
      search: name,
      extra: { _description: "1" },
      paginate: true,
      query: req.query,
    });

    const result = await fetchAbsys(params);
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