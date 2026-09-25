import { AbsysInvalidDataError, AbsysUnavailableError } from "./errors";

export type AbsysParams = Record<string, string | number | undefined>;

export interface AbsysRawResponse {
  response: {
    code: string | number;
    subcode?: string | number;
    description?: string;
    count?: string | number;
    [field: string]: unknown;
  };
}

export interface AbsysClient {
  search(params: AbsysParams): Promise<AbsysRawResponse>;
  add(table: string, fields: AbsysParams): Promise<AbsysRawResponse>;
}

const DEFAULT_TIMEOUT_MS = 10_000;

const CODE_OK = 0;
const CODES_UNAVAILABLE = [1, 4];

const getConfig = () => {
  if (typeof window !== "undefined") {
    throw new Error("El cliente de Absys solo puede ejecutarse en el servidor");
  }

  const baseUrl = process.env.NEXT_ABSYS_API;
  const user = process.env.NEXT_ABSYS_USERNAME;
  const pass = Buffer.from(process.env.NEXT_ABSYS_PASSWORD || "", "base64").toString("utf-8");

  if (!baseUrl || !user || !pass) {
    throw new AbsysUnavailableError("Configuración de conexión con Absys incompleta");
  }

  const timeoutMs = Number(process.env.ABSYS_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const auth = Buffer.from(`${user}:${pass}`).toString("base64");

  return { baseUrl, auth, timeoutMs };
};

const toUrlEncoded = (params: AbsysParams): URLSearchParams => {
  const encoded = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) encoded.set(key, String(value));
  }
  return encoded;
};

const send = async (query: AbsysParams, body?: AbsysParams): Promise<AbsysRawResponse> => {
  const { baseUrl, auth, timeoutMs } = getConfig();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}?${toUrlEncoded(query).toString()}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
      },
      body: body ? toUrlEncoded(body).toString() : undefined,
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    const reason = controller.signal.aborted ? `sin respuesta en ${timeoutMs} ms` : "error de red";
    throw new AbsysUnavailableError(`Absys no disponible (${reason})`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const ErrorClass = response.status >= 500 ? AbsysUnavailableError : AbsysInvalidDataError;
    throw new ErrorClass(`Absys respondió HTTP ${response.status}`);
  }

  let data: AbsysRawResponse;
  try {
    data = await response.json();
  } catch {
    throw new AbsysUnavailableError("Absys devolvió una respuesta que no es JSON");
  }

  return checkBusinessCode(data);
};

const checkBusinessCode = (data: AbsysRawResponse): AbsysRawResponse => {
  const code = Number(data?.response?.code);
  const subcode = data?.response?.subcode !== undefined ? Number(data.response.subcode) : undefined;
  const description = data?.response?.description || "Error sin descripción";

  if (Number.isNaN(code)) {
    throw new AbsysUnavailableError("Absys devolvió una respuesta sin código de estado");
  }
  if (code === CODE_OK) return data;
  if (CODES_UNAVAILABLE.includes(code)) {
    throw new AbsysUnavailableError(description, code, subcode);
  }
  throw new AbsysInvalidDataError(description, code, subcode);
};

export const absysClient: AbsysClient = {
  search: (params) => send({ operation: "search", ...params }),
  add: (table, fields) => send({ operation: "add", table }, fields),
};
