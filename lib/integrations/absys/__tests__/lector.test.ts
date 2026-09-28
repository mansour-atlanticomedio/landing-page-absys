import { describe, expect, it, vi } from "vitest";
import type { AbsysClient, AbsysRawResponse } from "../client";
import { AbsysInvalidDataError, AbsysUnavailableError } from "../errors";
import { createLectorService } from "../lector";
import lectorAdd from "../__fixtures__/lector-add.json";
import lectorSearch from "../__fixtures__/lector-search.json";
import lectorSearchDuplicado from "../__fixtures__/lector-search-duplicado.json";
import lectorSearchVacio from "../__fixtures__/lector-search-vacio.json";

const fakeClient = (overrides: Partial<AbsysClient>): AbsysClient => ({
  search: vi.fn(),
  add: vi.fn(),
  ...overrides,
});

const nuevoLector = {
  nombre: "Lucía",
  apellidos: "Martín Pérez",
  password: "clave-de-prueba",
  colectivo: "ALUMN",
  direccion: "Carretera de Quilmes, 37",
};

describe("findLectorByExternalId", () => {
  it("devuelve el lector cuando existe", async () => {
    const search = vi.fn().mockResolvedValue(lectorSearch as AbsysRawResponse);
    const service = createLectorService(fakeClient({ search }));

    const lector = await service.findLectorByExternalId("lector.prueba@atlanticomedio.es");

    expect(search).toHaveBeenCalledWith({ table: "lector", lemail: "lector.prueba@atlanticomedio.es" });
    expect(lector).toMatchObject({ id: "100023", nombre: "Lucía" });
  });

  it("devuelve null cuando no existe", async () => {
    const service = createLectorService(
      fakeClient({ search: vi.fn().mockResolvedValue(lectorSearchVacio as AbsysRawResponse) })
    );
    await expect(service.findLectorByExternalId("999")).resolves.toBeNull();
  });

  it("lanza AbsysInvalidDataError si hay más de un lector", async () => {
    const service = createLectorService(
      fakeClient({ search: vi.fn().mockResolvedValue(lectorSearchDuplicado as AbsysRawResponse) })
    );
    await expect(service.findLectorByExternalId("lector.prueba@atlanticomedio.es")).rejects.toBeInstanceOf(AbsysInvalidDataError);
  });

  it("propaga AbsysUnavailableError si Absys está caído o no responde", async () => {
    const service = createLectorService(
      fakeClient({ search: vi.fn().mockRejectedValue(new AbsysUnavailableError("sin respuesta en 10000 ms")) })
    );
    await expect(service.findLectorByExternalId("lector.prueba@atlanticomedio.es")).rejects.toBeInstanceOf(AbsysUnavailableError);
  });

  it("propaga el error de negocio del cliente", async () => {
    const service = createLectorService(
      fakeClient({ search: vi.fn().mockRejectedValue(new AbsysInvalidDataError("Datos no válidos", 3, 6)) })
    );
    await expect(service.findLectorByExternalId("lector.prueba@atlanticomedio.es")).rejects.toMatchObject({ code: 3, subcode: 6 });
  });
});

describe("createLector", () => {
  it("da de alta el lector y devuelve el número asignado", async () => {
    const add = vi.fn().mockResolvedValue(lectorAdd as AbsysRawResponse);
    const service = createLectorService(fakeClient({ add }));

    const lector = await service.createLector(nuevoLector);

    expect(add).toHaveBeenCalledWith("lector", expect.objectContaining({ lenomb: "Lucía", lecolp: "ALUMN" }));
    expect(lector).toMatchObject({ id: "100024", nombre: "Lucía" });
  });

  it("lanza AbsysInvalidDataError si Absys no devuelve el número de lector", async () => {
    const service = createLectorService(fakeClient({ add: vi.fn().mockResolvedValue({ response: { code: 0 } }) }));
    await expect(service.createLector(nuevoLector)).rejects.toBeInstanceOf(AbsysInvalidDataError);
  });

  it("propaga el error de negocio cuando Absys rechaza los datos", async () => {
    const service = createLectorService(
      fakeClient({ add: vi.fn().mockRejectedValue(new AbsysInvalidDataError("Add operation: Invalid data", 3, 6)) })
    );
    await expect(service.createLector(nuevoLector)).rejects.toBeInstanceOf(AbsysInvalidDataError);
  });
});
