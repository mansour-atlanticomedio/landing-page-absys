import { describe, expect, it } from "vitest";
import { resolveEnlaceExterno } from "../links";

const enlaces = [
  { key: "opac", label: "Catálogo OPAC", url: "https://demo.baratz.es/opac" },
  { key: "dspace", label: "Repositorio institucional", url: "https://repositorio.atlanticomedio.es" },
];

describe("resolveEnlaceExterno", () => {
  it("devuelve la URL del enlace configurado en Payload", () => {
    expect(resolveEnlaceExterno(enlaces, "opac", "https://fallback.example")).toBe("https://demo.baratz.es/opac");
  });

  it("usa el fallback si no hay ningún enlace con ese key", () => {
    expect(resolveEnlaceExterno(enlaces, "instagram", "https://fallback.example")).toBe("https://fallback.example");
  });

  it("usa el fallback si el enlace existe pero su url está vacía", () => {
    const conUrlVacia = [{ key: "opac", label: "Catálogo OPAC", url: "" }];
    expect(resolveEnlaceExterno(conUrlVacia, "opac", "https://fallback.example")).toBe("https://fallback.example");
  });

  it("usa el fallback si enlaces es null o undefined", () => {
    expect(resolveEnlaceExterno(null, "opac", "https://fallback.example")).toBe("https://fallback.example");
    expect(resolveEnlaceExterno(undefined, "opac", "https://fallback.example")).toBe("https://fallback.example");
  });
});
