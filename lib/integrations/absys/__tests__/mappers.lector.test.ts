import { describe, expect, it } from "vitest";
import type { AbsysRawResponse } from "../client";
import {
  deriveCampusIdentity,
  EXTERNAL_ID_FIELD,
  extractLectores,
  formatAbsysDateTime,
  fromNuevoLector,
  lenlecFromAddResponse,
  resolveColectivo,
  toExternalIdQuery,
  toLector,
  toLectorCreado,
  toModifyLectorQuery,
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
  colectivo: "PROFE",
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
      externalId: "lector.prueba@atlanticomedio.es",
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
  it("acepta los 5 colectivos reales de Absys", () => {
    expect(resolveColectivo("ADULT")).toBe("ADULT");
    expect(resolveColectivo("ALUMN")).toBe("ALUMN");
    expect(resolveColectivo("ANONI")).toBe("ANONI");
    expect(resolveColectivo("INVIT")).toBe("INVIT");
    expect(resolveColectivo("PROFE")).toBe("PROFE");
  });

  it("cae a ALUMN con colectivos que Absys no reconoce (ADR-0002)", () => {
    expect(resolveColectivo("EXT")).toBe("ALUMN");
    expect(resolveColectivo("PDI")).toBe("ALUMN");
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
      lecolp: "PROFE",
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

describe("deriveCampusIdentity", () => {
  it("separa nombre y apellidos por el primer punto del correo", () => {
    expect(deriveCampusIdentity("mansour.lolo@alu.atlanticomedio.es")).toEqual({
      nombre: "Mansour",
      apellidos: "Lolo",
      rol: "ALUMN",
    });
  });

  it("comprueba el dominio en orden: pdi, alu, unam, atlanticomedio.es a secas", () => {
    expect(deriveCampusIdentity("juan.perez@pdi.atlanticomedio.es").rol).toBe("PROFE");
    expect(deriveCampusIdentity("juan.perez@alu.atlanticomedio.es").rol).toBe("ALUMN");
    expect(deriveCampusIdentity("juan.perez@unam.atlanticomedio.es").rol).toBe("INVIT");
    expect(deriveCampusIdentity("juan.perez@atlanticomedio.es").rol).toBe("ADULT");
  });

  it("cae a ANONI si el dominio no es institucional (rol más básico)", () => {
    expect(deriveCampusIdentity("juan.perez@gmail.com").rol).toBe("ANONI");
    expect(deriveCampusIdentity("juan.perez@otro.atlanticomedio.es").rol).toBe("ANONI");
  });

  it("usa '-' como apellidos si el correo no tiene un segundo segmento", () => {
    expect(deriveCampusIdentity("mansour@alu.atlanticomedio.es")).toMatchObject({
      nombre: "Mansour",
      apellidos: "-",
    });
  });

  it("une varios segmentos como apellidos si el correo tiene más de un punto", () => {
    expect(deriveCampusIdentity("juan.perez.gomez@alu.atlanticomedio.es")).toMatchObject({
      nombre: "Juan",
      apellidos: "Perez Gomez",
    });
  });
});

describe("toModifyLectorQuery", () => {
  it("construye la query de modify solo con nombre y apellidos", () => {
    expect(toModifyLectorQuery("100023", { nombre: "Lucía", apellidos: "Martín Pérez" })).toEqual({
      table: "lector",
      lenlec: "100023",
      lenomb: "Lucía",
      leapel: "Martín Pérez",
    });
  });
});

describe("toLectorCreado", () => {
  it("construye el lector a partir de los datos enviados y el lenlec asignado", () => {
    expect(toLectorCreado(nuevoLector, "100024")).toMatchObject({
      id: "100024",
      externalId: "lector.prueba@atlanticomedio.es",
      nombre: "Lucía",
      apellidos: "Martín Pérez",
      email: "lector.prueba@atlanticomedio.es",
    });
  });
});
