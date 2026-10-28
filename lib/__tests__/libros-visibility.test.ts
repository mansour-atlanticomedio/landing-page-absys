import { describe, expect, it } from "vitest";
import { shouldHideLibros } from "../libros-visibility";

describe("shouldHideLibros", () => {
  it("oculta la página cuando las herramientas de desarrollo están desactivadas (producción)", () => {
    expect(shouldHideLibros(false)).toBe(true);
  });
  it("la muestra en desarrollo", () => {
    expect(shouldHideLibros(true)).toBe(false);
  });
});
