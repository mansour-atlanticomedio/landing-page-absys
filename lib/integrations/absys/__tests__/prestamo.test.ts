import { describe, expect, it, vi } from "vitest";
import type { AbsysClient, AbsysRawResponse } from "../client";
import { AbsysUnavailableError } from "../errors";
import { createPrestamoService } from "../prestamo";
import { extractPrestamos, isPrestamoVencido, toPrestamo, toPrestamosQuery } from "../mappers/prestamo";
import prestamoSearch from "../__fixtures__/prestamo-search.json";

const vacio = { response: { code: 0, count: 0, table: "presta" } } as AbsysRawResponse;

describe("mappers de préstamo", () => {
  it("busca en presta por el número de lector", () => {
    expect(toPrestamosQuery("100023")).toEqual({ table: "presta", prnlec: "100023" });
  });

  it("devuelve lista vacía si el lector no tiene préstamos", () => {
    expect(extractPrestamos(vacio)).toEqual([]);
  });

  it("acepta un único préstamo como objeto", () => {
    const uno = { response: { code: 0, presta: prestamoSearch.response.presta[0] } } as AbsysRawResponse;
    expect(extractPrestamos(uno)).toHaveLength(1);
  });

  it("traduce el préstamo crudo a nuestro tipo", () => {
    expect(toPrestamo(prestamoSearch.response.presta[0])).toEqual({
      ejemplar: "BIEU000123",
      fechaPrestamo: "2026-09-10",
      fechaDevolucion: "2026-09-25",
      renovaciones: 1,
      renovable: true,
      sucursal: "MADRID",
    });
  });

  it("marca como vencido solo si la devolución es anterior a hoy", () => {
    const prestamo = toPrestamo(prestamoSearch.response.presta[0]);
    expect(isPrestamoVencido(prestamo, new Date(2026, 8, 25))).toBe(false);
    expect(isPrestamoVencido(prestamo, new Date(2026, 8, 26))).toBe(true);
  });
});

describe("findPrestamosByLector", () => {
  const fakeClient = (search: AbsysClient["search"]): AbsysClient => ({ search, add: vi.fn() });

  it("devuelve los préstamos del lector", async () => {
    const search = vi.fn().mockResolvedValue(prestamoSearch as AbsysRawResponse);
    const prestamos = await createPrestamoService(fakeClient(search)).findPrestamosByLector("100023");

    expect(search).toHaveBeenCalledWith({ table: "presta", prnlec: "100023" });
    expect(prestamos.map((p) => p.ejemplar)).toEqual(["BIEU000123", "BIEU000456"]);
  });

  it("propaga AbsysUnavailableError si Absys está caído", async () => {
    const search = vi.fn().mockRejectedValue(new AbsysUnavailableError("caído"));
    await expect(createPrestamoService(fakeClient(search)).findPrestamosByLector("1")).rejects.toBeInstanceOf(
      AbsysUnavailableError
    );
  });
});
