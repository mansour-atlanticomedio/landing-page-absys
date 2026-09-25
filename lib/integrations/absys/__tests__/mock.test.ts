import { describe, expect, it } from "vitest";
import { absysMock } from "../mock";

describe("absysMock", () => {
  it("encuentra el lector de las fixtures", async () => {
    await expect(absysMock.findLectorByExternalId("100023")).resolves.toMatchObject({ nombre: "Lucía" });
  });

  it("devuelve null para cualquier otro lector", async () => {
    await expect(absysMock.findLectorByExternalId("999")).resolves.toBeNull();
  });

  it("crea lectores con el número de la fixture", async () => {
    const lector = await absysMock.createLector({
      nombre: "Javier",
      apellidos: "Suárez Rodríguez",
      password: "clave-de-prueba",
      colectivo: "PDI",
      direccion: "Carretera de Quilmes, 37",
    });
    expect(lector.id).toBe("100024");
  });

  it("devuelve el listado o el detalle del catálogo según el modo", async () => {
    const listado = await absysMock.searchCatalog({ search: "quijote" });
    const detalle = await absysMock.searchCatalog({ search: "9788497592208", detalle: true });
    expect(Array.isArray((listado.response.collection as any).record)).toBe(true);
    expect(Array.isArray((detalle.response.collection as any).record)).toBe(false);
  });
});
