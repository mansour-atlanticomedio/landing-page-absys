import { describe, expect, it } from "vitest";
import type { AbsysRawResponse } from "../client";
import {
  EXTERNAL_ID_FIELD,
  extractLectores,
  formatAbsysDateTime,
  fromNuevoLector,
  lenlecFromAddResponse,
  resolveColectivo,
  toExternalIdQuery,
  toLector,
  toLectorCreado,
  type NuevoLector,
} from "../mappers/lector";
import lectorAdd from "../__fixtures__/lector-add.json";
import lectorSearch from "../__fixtures__/lector-search.json";
import lectorSearchDuplicado from "../__fixtures__/lector-search-duplicado.json";
import lectorSearchVacio from "../__fixtures__/lector-search-vacio.json";

const nuevoLector: NuevoLector = {
  nombre: "Lucía",
  apellidos: "Martín Pérez",
  password: "clave-de-prueba",
  colectivo: "PDI",
  direccion: "Carretera de Quilmes, 37",
  email: "lector.prueba@atlanticomedio.es",
  telefono: "600000000",
};

describe("extractLectores", () => {
  it("devuelve un único lector cuando Absys manda un objeto", () => {
    expect(extractLectores(lectorSearch as AbsysRawResponse)).toHaveLength(1);
  });

  it("devuelve lista vacía cuando no hay resultados", () => {
    expect(extractLectores(lectorSearchVacio as AbsysRawResponse)).toEqual([]);
  });

  it("devuelve todos los lectores cuando Absys manda un array", () => {
    expect(extractLectores(lectorSearchDuplicado as AbsysRawResponse)).toHaveLength(2);
  });
});

describe("toLector", () => {
  it("traduce el lector crudo a nuestro tipo", () => {
    const [raw] = extractLectores(lectorSearch as AbsysRawResponse);
    expect(toLector(raw)).toEqual({
      id: "100023",
      externalId: "100023",
      nombre: "Lucía",
      apellidos: "Martín Pérez",
      email: "lector.prueba@atlanticomedio.es",
      ultimoUso: "2026-09-15",
      lepassLegacy: "******",
    });
  });

  it("deja cadenas vacías si faltan nombre, apellidos o email", () => {
    const lector = toLector({ lenlec: "1", lecolp: "ALUMN" } as never);
    expect(lector).toMatchObject({ nombre: "", apellidos: "", email: "" });
  });
});

describe("toExternalIdQuery", () => {
  it("busca en la tabla lector por el campo de identidad configurado", () => {
    expect(toExternalIdQuery("100023")).toEqual({ table: "lector", [EXTERNAL_ID_FIELD]: "100023" });
  });
});

describe("resolveColectivo", () => {
  it("acepta ALUMN y PDI", () => {
    expect(resolveColectivo("ALUMN")).toBe("ALUMN");
    expect(resolveColectivo("PDI")).toBe("PDI");
  });

  it("cae a ALUMN con colectivos que Absys no reconoce (ADR-0002)", () => {
    expect(resolveColectivo("EXT")).toBe("ALUMN");
    expect(resolveColectivo(undefined)).toBe("ALUMN");
  });
});

describe("formatAbsysDateTime", () => {
  it("formatea como dd/mm/yyyy hh:mm:ss", () => {
    expect(formatAbsysDateTime(new Date(2026, 8, 5, 7, 3, 9))).toBe("05/09/2026 07:03:09");
  });
});

describe("fromNuevoLector", () => {
  it("construye el payload de alta con las constantes institucionales", () => {
    const payload = fromNuevoLector(nuevoLector, new Date(2026, 8, 25, 12, 0, 0));
    expect(payload).toEqual({
      lenlec: "0",
      leapel: "Martín Pérez",
      lenomb: "Lucía",
      lepass: "clave-de-prueba",
      lecolp: "PDI",
      lecobi: "BIEURO",
      lecosu: "MADRID",
      lecart: "1",
      ledi11: "Carretera de Quilmes, 37",
      lecocf: "PDIM",
      leacpd: "1",
      lefepd: "25/09/2026 12:00:00",
      lemail: "lector.prueba@atlanticomedio.es",
      letfn1: "600000000",
    });
  });

  it("usa el perfil de préstamo de ALUMN si el colectivo no es válido", () => {
    const payload = fromNuevoLector({ ...nuevoLector, colectivo: "EXT" });
    expect(payload).toMatchObject({ lecolp: "ALUMN", lecocf: "ALIM" });
  });
});

describe("lenlecFromAddResponse", () => {
  it("devuelve el número de lector como string", () => {
    expect(lenlecFromAddResponse(lectorAdd as AbsysRawResponse)).toBe("100024");
  });

  it("devuelve null si Absys no manda lenlec", () => {
    expect(lenlecFromAddResponse({ response: { code: 0 } })).toBeNull();
  });
});

describe("toLectorCreado", () => {
  it("construye el lector a partir de los datos enviados y el lenlec asignado", () => {
    expect(toLectorCreado(nuevoLector, "100024")).toMatchObject({
      id: "100024",
      externalId: "100024",
      nombre: "Lucía",
      apellidos: "Martín Pérez",
      email: "lector.prueba@atlanticomedio.es",
    });
  });
});
