import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { absysClient } from "../client";
import { AbsysInvalidDataError, AbsysUnavailableError } from "../errors";
import errorServicioCaido from "../__fixtures__/error-servicio-caido.json";
import lectorAddError from "../__fixtures__/lector-add-error.json";
import lectorSearch from "../__fixtures__/lector-search.json";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

beforeEach(() => {
  vi.stubEnv("NEXT_ABSYS_API", "https://absys.test/API");
  vi.stubEnv("NEXT_ABSYS_USERNAME", "usuario-test");
  vi.stubEnv("NEXT_ABSYS_PASSWORD", Buffer.from("clave-test").toString("base64"));
  vi.stubEnv("ABSYS_TIMEOUT_MS", "50");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("absysClient", () => {
  it("hace search por GET con los parámetros en la query y sin JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(lectorSearch));
    vi.stubGlobal("fetch", fetchMock);

    const data = await absysClient.search({ table: "lector", lenlec: "100023" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://absys.test/API?operation=search&table=lector&lenlec=100023");
    expect(init.method).toBe("GET");
    expect(init.headers["Content-Type"]).toBeUndefined();
    expect(init.headers.Authorization).toBe(`Basic ${Buffer.from("usuario-test:clave-test").toString("base64")}`);
    expect(data.response.lector).toBeDefined();
  });

  it("hace add por POST urlencoded", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ response: { code: 0, lenlec: 1 } }));
    vi.stubGlobal("fetch", fetchMock);

    await absysClient.add("lector", { lenomb: "Lucía", lemail: undefined });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://absys.test/API?operation=add&table=lector");
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    expect(init.body).toBe("lenomb=Luc%C3%ADa");
  });

  it("corta la petición y lanza AbsysUnavailableError al superar el timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        })
      )
    );

    await expect(absysClient.search({ table: "lector" })).rejects.toThrow(/sin respuesta en 50 ms/);
  });

  it("lanza AbsysUnavailableError si falla la red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(absysClient.search({ table: "lector" })).rejects.toBeInstanceOf(AbsysUnavailableError);
  });

  it("lanza AbsysUnavailableError con un HTTP 5xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 503)));
    await expect(absysClient.search({ table: "lector" })).rejects.toBeInstanceOf(AbsysUnavailableError);
  });

  it("lanza AbsysInvalidDataError con un HTTP 4xx", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 400)));
    await expect(absysClient.search({ table: "lector" })).rejects.toBeInstanceOf(AbsysInvalidDataError);
  });

  it("traduce el código de negocio 4 a AbsysUnavailableError aunque el HTTP sea 200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(errorServicioCaido)));
    await expect(absysClient.search({ table: "lector" })).rejects.toBeInstanceOf(AbsysUnavailableError);
  });

  it("traduce el código de negocio 3 a AbsysInvalidDataError sin devolver la respuesta cruda", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(lectorAddError)));

    const error = await absysClient.add("lector", {}).catch((e) => e);

    expect(error).toBeInstanceOf(AbsysInvalidDataError);
    expect(error).toMatchObject({ code: 3, subcode: 6, message: "Add operation: Invalid data (table 'lector')." });
    expect(error).not.toHaveProperty("response");
  });

  it("no incluye credenciales en los mensajes de error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 401)));
    const error = await absysClient.search({ table: "lector" }).catch((e) => e);
    expect(String(error.message)).not.toMatch(/usuario-test|clave-test/);
  });

  it("lanza AbsysUnavailableError si falta la configuración", async () => {
    vi.stubEnv("NEXT_ABSYS_API", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(absysClient.search({ table: "lector" })).rejects.toBeInstanceOf(AbsysUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
