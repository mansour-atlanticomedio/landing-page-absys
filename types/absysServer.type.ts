import "server-only";
import { parseAbsysResponse, type AbsysApiResponse, type AbsysCode, type AbsysResult } from "@/types/absys.type";

export interface AbsysRequestOptions {
  operation: "search" | "add" | "modify" | "delete" | "circulation";
  table: string;
  params?: Record<string, string | undefined>;
}

export async function absysRequest<T extends object = object>(
  options: AbsysRequestOptions
): Promise<AbsysResult<T>> {
  const baseUrl = process.env.ABSYS_API_URL;
  const authUser = process.env.ABSYS_ROLE_USER;
  const authPass = process.env.ABSYS_ROLE_PASS;

  if (!baseUrl || !authUser || !authPass) {
    return {
      ok: false,
      code: 3 as AbsysCode,
      message: "Configuración de conexión con Absys incompleta",
    };
  }

  const query = new URLSearchParams({
    operation: options.operation,
    table: options.table,
  });

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined) body.set(key, value);
  }

  const credentials = Buffer.from(`${authUser}:${authPass}`).toString("base64");

  const res = await fetch(`${baseUrl}?${query.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: body.toString(),
  });

  const raw: AbsysApiResponse<T> = await res.json();
  return parseAbsysResponse<T>(raw);
}