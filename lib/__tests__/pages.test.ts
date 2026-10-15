import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOCKED_SLUGS, RESERVED_SEGMENTS, isLockedPageSlug, lockedDeleteError, lockedUnpublishError, normalizePageSlug, resolveSlugOnSave, validatePageSlug } from "../pages";

const ROOT = path.resolve(import.meta.dirname, "../..");

const firstSegments = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return [];
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      result.push(...firstSegments(path.join(dir, entry.name)));
    } else if (!entry.name.startsWith("[")) {
      result.push(entry.name);
    }
  }
  return result;
};

describe("normalizePageSlug", () => {
  it("pasa a minúsculas y quita barras en los extremos", () => {
    expect(normalizePageSlug("/Conocenos/Equipo/")).toBe("conocenos/equipo");
    expect(normalizePageSlug("  //Hola//  ")).toBe("hola");
  });

  it("devuelve cadena vacía si no es texto", () => {
    expect(normalizePageSlug(undefined)).toBe("");
    expect(normalizePageSlug(5)).toBe("");
  });
});

describe("validatePageSlug", () => {
  it("acepta slugs válidos", () => {
    expect(validatePageSlug("equipo")).toBe(true);
    expect(validatePageSlug("conocenos/quienes-somos")).toBe(true);
    expect(validatePageSlug("a-1/b-2/c")).toBe(true);
  });

  it("rechaza formato inválido", () => {
    for (const slug of ["", "Equipo", "/equipo", "equipo/", "a//b", "a b", "ñandú", "a_b", "../x"]) {
      expect(validatePageSlug(slug)).not.toBe(true);
    }
  });

  it("rechaza el primer segmento reservado o biblioteca", () => {
    expect(validatePageSlug("admin")).not.toBe(true);
    expect(validatePageSlug("api/pages")).not.toBe(true);
    expect(validatePageSlug("biblioteca")).not.toBe(true);
    expect(validatePageSlug("biblioteca/equipo")).not.toBe(true);
  });

  it("permite un segmento reservado que no es el primero", () => {
    expect(validatePageSlug("conocenos/admin")).toBe(true);
  });

  it("permite conocenos", () => {
    expect(RESERVED_SEGMENTS).not.toContain("conocenos");
    expect(validatePageSlug("conocenos")).toBe(true);
  });
});

describe("LOCKED_SLUGS", () => {
  it("son válidos y se reconocen como bloqueados", () => {
    for (const slug of LOCKED_SLUGS) {
      expect(validatePageSlug(slug)).toBe(true);
      expect(isLockedPageSlug(slug)).toBe(true);
    }
    expect(isLockedPageSlug("equipo")).toBe(false);
  });
});

describe("resolveSlugOnSave", () => {
  it("en borrador solo normaliza y no valida", () => {
    expect(resolveSlugOnSave("/Admin/", "draft")).toEqual({ slug: "admin", error: null });
    expect(resolveSlugOnSave("a b", undefined).error).toBeNull();
  });

  it("devuelve undefined si el slug llega vacío", () => {
    expect(resolveSlugOnSave("", "draft").slug).toBeUndefined();
    expect(resolveSlugOnSave(undefined, "draft").slug).toBeUndefined();
    expect(resolveSlugOnSave("  / ", "draft").slug).toBeUndefined();
  });

  it("al publicar valida formato, reservados y obligatoriedad", () => {
    expect(resolveSlugOnSave("equipo", "published")).toEqual({ slug: "equipo", error: null });
    expect(resolveSlugOnSave("admin", "published").error).not.toBeNull();
    expect(resolveSlugOnSave("a b", "published").error).not.toBeNull();
    expect(resolveSlugOnSave("", "published").error).not.toBeNull();
  });
});

describe("protección de slugs bloqueados", () => {
  const locked = LOCKED_SLUGS[0];

  it("impide borrar páginas bloqueadas", () => {
    expect(lockedDeleteError(locked)).toEqual(expect.any(String));
    expect(lockedDeleteError("equipo")).toBeNull();
  });

  it("impide despublicar pero permite guardar borradores", () => {
    const base = { slug: locked, previousStatus: "published", nextStatus: "draft", isDraftSave: false } as const;
    expect(lockedUnpublishError(base)).toEqual(expect.any(String));
    expect(lockedUnpublishError({ ...base, isDraftSave: true })).toBeNull();
    expect(lockedUnpublishError({ ...base, nextStatus: "published" })).toBeNull();
    expect(lockedUnpublishError({ ...base, slug: "equipo" })).toBeNull();
  });
});

describe("rutas del código", () => {
  it("todas las carpetas de primer nivel de app están reservadas", () => {
    const folders = ["app/(frontend)", "app/(auth)", "app/(payload)"].flatMap((dir) => firstSegments(path.join(ROOT, dir)));
    const missing = folders.filter(
      (name) => !(RESERVED_SEGMENTS as readonly string[]).includes(name),
    );
    expect(missing).toEqual([]);
  });
});
