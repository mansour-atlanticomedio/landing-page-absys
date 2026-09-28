import { describe, expect, it } from "vitest";
import { toCatalogQuery } from "../mappers/catalogo";

describe("toCatalogQuery", () => {
  it("pide solo los campos del listado y la primera página por defecto", () => {
    expect(toCatalogQuery({ search: "quijote" })).toEqual({
      base: "cata",
      search: "quijote",
      _doc_fields: "245, 100, 020",
      _start_position: "1",
      _max_records: "12",
    });
  });

  it("traduce página y límite a posición inicial", () => {
    expect(toCatalogQuery({ search: "quijote", page: "3", limit: "10" })).toMatchObject({
      _start_position: "21",
      _max_records: "10",
    });
  });

  it("pide la descripción completa en modo detalle", () => {
    const query = toCatalogQuery({ search: "9788497592208", detalle: true });
    expect(query).toMatchObject({ _description: "1" });
    expect(query).not.toHaveProperty("_doc_fields");
  });

  it("ignora página y límite inválidos", () => {
    expect(toCatalogQuery({ search: "x", page: "-4", limit: "abc" })).toMatchObject({
      _start_position: "1",
      _max_records: "12",
    });
  });
});
