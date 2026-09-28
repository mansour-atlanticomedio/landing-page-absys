import { describe, expect, it } from "vitest";
import { buildCampusLoginUrl, redirectResponse, safeNextPath } from "../redirects";

describe("safeNextPath", () => {
  it("acepta rutas internas", () => {
    expect(safeNextPath("/recursos/catalogo?q=quijote")).toBe("/recursos/catalogo?q=quijote");
  });

  it("quita el basePath si viene incluido", () => {
    expect(safeNextPath("/biblioteca/profile")).toBe("/profile");
    expect(safeNextPath("/biblioteca")).toBe("/");
  });

  it("rechaza URLs externas y protocol-relative", () => {
    expect(safeNextPath("https://evil.example")).toBe("/profile");
    expect(safeNextPath("//evil.example")).toBe("/profile");
    expect(safeNextPath("/\\evil.example")).toBe("/profile");
  });

  it("rechaza volver a las rutas de auth para no entrar en bucle", () => {
    expect(safeNextPath("/auth/login")).toBe("/profile");
  });

  it("usa el valor por defecto si no hay next", () => {
    expect(safeNextPath(null)).toBe("/profile");
    expect(safeNextPath("", "/")).toBe("/");
  });
});

describe("buildCampusLoginUrl", () => {
  const config = {
    loginUrl: "https://campus.atlanticomedio.es/biblioteca",
    siteUrl: "https://web.atlanticomedio.es/biblioteca/",
  };

  it("manda al campus con la URL de vuelta a nuestro callback", () => {
    const url = new URL(buildCampusLoginUrl("/profile", config)!);
    expect(url.origin + url.pathname).toBe("https://campus.atlanticomedio.es/biblioteca");
    expect(url.searchParams.get("return")).toBe("https://web.atlanticomedio.es/biblioteca/auth/campus?next=%2Fprofile");
  });

  it("permite cambiar el nombre del parámetro de vuelta", () => {
    const url = new URL(buildCampusLoginUrl("/profile", { ...config, returnParam: "redirect_to" })!);
    expect(url.searchParams.has("redirect_to")).toBe(true);
  });

  it("devuelve null si el campus no está configurado", () => {
    expect(buildCampusLoginUrl("/profile", { siteUrl: config.siteUrl })).toBeNull();
  });
});

describe("redirectResponse", () => {
  it("redirige con Location relativa al basePath y adjunta la cookie", () => {
    const res = redirectResponse("/profile", "payload-token=abc; Path=/");
    expect(res.status).toBe(303);
    expect(res.headers.get("Location")).toBe("/biblioteca/profile");
    expect(res.headers.get("Set-Cookie")).toBe("payload-token=abc; Path=/");
  });
});
