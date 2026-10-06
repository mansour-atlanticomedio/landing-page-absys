import { describe, expect, it } from "vitest";
import { resolveEnlace, resolveFooterLinks, resolveNavbar } from "../links";

const enlaces = [{ key: "dspace", label: "DSpace", url: "https://repo.example.com" }];

describe("resolveEnlace", () => {
  it("trata un enlace sin tipo como interno", () => {
    expect(resolveEnlace({ to: "/servicios" }, enlaces)).toEqual({ href: "/servicios", external: false, newTab: false });
  });

  it("un interno con http sigue siendo externo (datos anteriores a tipo)", () => {
    expect(resolveEnlace({ to: "http://x.es/a" }, enlaces)).toEqual({ href: "http://x.es/a", external: true, newTab: true });
  });

  it("resuelve una ancla de la lista cerrada", () => {
    expect(resolveEnlace({ tipo: "ancla", ancla: "investigacion-apoyo" }, enlaces).href).toBe("/investigacion#cta-apoyo");
    expect(resolveEnlace({ tipo: "ancla", ancla: "home-noticias" }, enlaces).href).toBe("/#noticias");
  });

  it("ancla desconocida no tiene destino", () => {
    expect(resolveEnlace({ tipo: "ancla", ancla: "no-existe" }, enlaces).href).toBeUndefined();
  });

  it("resuelve una key del registro y respeta nueva_pestana", () => {
    expect(resolveEnlace({ tipo: "registro", enlace_key: "dspace", nueva_pestana: false }, enlaces)).toEqual({
      href: "https://repo.example.com",
      external: true,
      newTab: false,
    });
  });

  it("key sin entrada en el registro no tiene destino", () => {
    expect(resolveEnlace({ tipo: "registro", enlace_key: "opac" }, enlaces).href).toBeUndefined();
  });

  it("externo lee url y, si no, el campo legacy link", () => {
    expect(resolveEnlace({ tipo: "externo", url: "https://a.es" }, enlaces).href).toBe("https://a.es");
    expect(resolveEnlace({ tipo: "externo", link: "https://b.es" }, enlaces).href).toBe("https://b.es");
  });
});

describe("resolveNavbar", () => {
  it("descarta desplegables sin destino y secciones vacías, conserva padres con hijos", () => {
    const result = resolveNavbar(
      [
        { name: "recursos", items: [{ label: "OPAC", tipo: "registro", enlace_key: "opac" }, { label: "DSpace", tipo: "registro", enlace_key: "dspace" }] },
        { name: "vacía", tipo: "registro", enlace_key: "opac", items: [] },
        { name: "inicio", to: "/" },
      ],
      enlaces
    );
    expect(result.map((s) => s.name)).toEqual(["recursos", "inicio"]);
    expect(result[0].items).toHaveLength(1);
  });
});

describe("resolveFooterLinks", () => {
  it("descarta redes sin destino y conserva filas de información sin enlace", () => {
    const result = resolveFooterLinks(
      {
        social_medias: [{ icon: "FaYoutube", tipo: "registro", enlace_key: "youtube" }, { icon: "FaFacebook", tipo: "externo", url: "https://fb.com/x" }],
        seccion_info: [{ title: "Servicio", information: [{ label: "Horario" }, { label: "Tel", tipo: "externo", url: "tel:+34" }] }],
      },
      enlaces
    );
    expect(result.social_medias).toHaveLength(1);
    expect(result.seccion_info[0].information[0].href).toBeUndefined();
    expect(result.seccion_info[0].information).toHaveLength(2);
  });
});
