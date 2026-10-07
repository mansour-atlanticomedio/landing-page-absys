import { describe, expect, it } from "vitest";
import { MAX_LIBROS_SUGERIDOS, validarLibrosSugeridos } from "../sugerencias";

const libro = { titulo: "Cien años de soledad", autor: "García Márquez, Gabriel" };

describe("validarLibrosSugeridos", () => {
  it("acepta un libro mínimo y limpia espacios y campos vacíos", () => {
    expect(validarLibrosSugeridos([{ ...libro, titulo: "  Cien años de soledad ", editorial: "  ", isbn: "978-84-376-0494-7" }])).toEqual({
      libros: [{ titulo: "Cien años de soledad", autor: "García Márquez, Gabriel", editorial: undefined, anio: undefined, isbn: "978-84-376-0494-7", enlace: undefined }],
    });
  });

  it("rechaza una lista vacía o que no es lista", () => {
    expect(validarLibrosSugeridos([])).toHaveProperty("error");
    expect(validarLibrosSugeridos("x")).toHaveProperty("error");
  });

  it("exige título y autor e indica qué libro falla", () => {
    expect(validarLibrosSugeridos([libro, { titulo: "Sin autor" }])).toEqual({ error: "El libro #2 necesita título y autor." });
  });

  it("limita el número de libros", () => {
    expect(validarLibrosSugeridos(Array(MAX_LIBROS_SUGERIDOS + 1).fill(libro))).toHaveProperty("error");
  });

  it("solo admite enlaces http(s)", () => {
    expect(validarLibrosSugeridos([{ ...libro, enlace: "javascript:alert(1)" }])).toHaveProperty("error");
    expect(validarLibrosSugeridos([{ ...libro, enlace: "no es url" }])).toHaveProperty("error");
    expect(validarLibrosSugeridos([{ ...libro, enlace: "https://www.amazon.es/dp/1" }])).toHaveProperty("libros");
  });

  it("rechaza campos demasiado largos", () => {
    expect(validarLibrosSugeridos([{ ...libro, titulo: "a".repeat(300) }])).toHaveProperty("error");
  });
});
