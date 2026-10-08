import { describe, expect, it, vi } from "vitest";
import { type ContactoDeps, maskEmail, procesarContacto } from "../contacto-envio";
import { SecurityConfigError, createMemoryStore, signFormToken } from "../security";

const SECRET = "abcdefghijklmnopqrstuvwxyz012345";
const NOW = 1_800_000_000_000;
const MAILBOX = "biblioteca@atlanticomedio.es";

const sesion = { id: 7, email: "ana.perez@alu.atlanticomedio.es", nombre: "Ana", apellidos: "Pérez", rol: "Alumnado" };

const campos = (extra: Record<string, unknown> = {}) => ({
  asunto: "Consulta sobre préstamo",
  mensaje: "Quisiera saber cómo renovar un libro.",
  website_url: "",
  form_token: signFormToken(SECRET, NOW - 10_000, "contacto"),
  ...extra,
});

const montar = (over: Partial<ContactoDeps> = {}) => {
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const create = vi.fn().mockResolvedValue({});
  const enviarCorreo = vi.fn().mockResolvedValue(undefined);
  const clock = { t: NOW };
  const deps: ContactoDeps = {
    session: sesion,
    headers: new Headers({ "x-real-ip": "203.0.113.5" }),
    store: createMemoryStore(),
    now: () => clock.t,
    getSecrets: () => [SECRET],
    ipOptions: { trustedHeader: "x-real-ip" },
    mailbox: MAILBOX,
    payload: { logger, create },
    enviarCorreo,
    ...over,
  };
  return { deps, logger, create, enviarCorreo, clock };
};

const eventos = (fn: ReturnType<typeof vi.fn>) => fn.mock.calls.map((c) => c[0].event);

describe("procesarContacto", () => {
  it("ok: guarda el histórico y envía con los datos de la sesión", async () => {
    const { deps, create, enviarCorreo, logger } = montar();
    expect(await procesarContacto(deps, campos())).toEqual({ ok: true });
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ collection: "sendEmail", overrideAccess: true }));
    expect(enviarCorreo).toHaveBeenCalledWith(deps.payload, {
      solicitante: { nombre: "Ana Pérez", email: sesion.email, rol: "Alumnado" },
      asunto: "Consulta sobre préstamo",
      mensaje: "Quisiera saber cómo renovar un libro.",
    });
    expect(eventos(logger.info)).toContain("contacto.sent");
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain(sesion.email);
  });

  it("ignora nombre y correo que vengan en el formulario", async () => {
    const { deps, enviarCorreo } = montar();
    await procesarContacto(deps, campos({ name: "Otro", email: "otro@x.es", rol: "Admin" }));
    expect(enviarCorreo.mock.calls[0][1].solicitante).toEqual({ nombre: "Ana Pérez", email: sesion.email, rol: "Alumnado" });
  });

  it("sin sesión: error y no envía", async () => {
    const { deps, enviarCorreo } = montar({ session: null });
    expect(await procesarContacto(deps, campos())).toMatchObject({ ok: false, code: "sesion" });
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  it("honeypot relleno: éxito falso sin enviar y con log", async () => {
    const { deps, enviarCorreo, create, logger } = montar();
    expect(await procesarContacto(deps, campos({ website_url: "http://spam.example" }))).toEqual({ ok: true });
    expect(enviarCorreo).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(logger.warn.mock.calls[0][0]).toMatchObject({ event: "contacto.honeypot", reason: "honeypot" });
  });

  it("demasiado rápido: éxito falso sin enviar", async () => {
    const { deps, enviarCorreo, logger } = montar();
    const res = await procesarContacto(deps, campos({ form_token: signFormToken(SECRET, NOW - 500, "contacto") }));
    expect(res).toEqual({ ok: true });
    expect(enviarCorreo).not.toHaveBeenCalled();
    expect(logger.warn.mock.calls[0][0]).toMatchObject({ reason: "too_fast" });
  });

  it("token caducado, inválido o ausente: pide recargar", async () => {
    for (const form_token of [signFormToken(SECRET, NOW - 3 * 3_600_000, "contacto"), "basura", undefined, signFormToken(SECRET, NOW + 60_000, "contacto"), signFormToken(SECRET, NOW - 10_000, "otro")]) {
      const { deps, enviarCorreo } = montar();
      const res = await procesarContacto(deps, campos({ form_token }));
      expect(res).toMatchObject({ ok: false, code: "recargar" });
      expect((res as any).error).toContain("Recarga la página");
      expect(enviarCorreo).not.toHaveBeenCalled();
    }
  });

  it("validación: asunto con salto de línea y mensaje corto", async () => {
    const { deps, enviarCorreo } = montar();
    expect(await procesarContacto(deps, campos({ asunto: "Hola\nBcc: x@y.es" }))).toMatchObject({ ok: false, code: "validacion" });
    expect(await procesarContacto(deps, campos({ mensaje: "corto" }))).toMatchObject({ ok: false, code: "validacion" });
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  it("límite de usuario: el 6º envío en una hora se rechaza con retryAfter", async () => {
    const { deps, enviarCorreo, logger, clock } = montar();
    for (let i = 0; i < 5; i++) {
      clock.t += 1000;
      expect(await procesarContacto(deps, campos({ mensaje: `Mensaje número ${i} de prueba` }))).toEqual({ ok: true });
    }
    clock.t += 1000;
    const res = await procesarContacto(deps, campos({ mensaje: "Mensaje número 6 de prueba" }));
    expect(res).toMatchObject({ ok: false, code: "limite" });
    expect((res as any).retryAfterSec).toBeGreaterThan(0);
    expect((res as any).error).toContain("Demasiados intentos");
    expect(enviarCorreo).toHaveBeenCalledTimes(5);
    const evento = logger.warn.mock.calls.find((c) => c[0].event === "contacto.rate_limited")![0];
    expect(evento.violated[0]).toMatchObject({ dimension: "user", limit: 5 });
  });

  it("dedupe: un reenvío idéntico responde ok sin enviar de nuevo", async () => {
    const { deps, enviarCorreo, create, clock } = montar();
    await procesarContacto(deps, campos());
    clock.t += 60_000;
    expect(await procesarContacto(deps, campos())).toEqual({ ok: true, duplicado: true });
    expect(enviarCorreo).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("store que lanza: 503 sin enviar", async () => {
    const roto = { increment: vi.fn().mockRejectedValue(new Error("db")), peek: vi.fn().mockRejectedValue(new Error("db")), decrement: vi.fn() };
    const { deps, enviarCorreo, logger } = montar({ store: roto });
    expect(await procesarContacto(deps, campos())).toMatchObject({ ok: false, code: "no_disponible" });
    expect(enviarCorreo).not.toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toMatchObject({ event: "contacto.failed", reason: "store_unavailable" });
  });

  it("el store falla solo en el dedupe: 503 sin enviar", async () => {
    const real = createMemoryStore();
    const store = { ...real, increment: (...a: Parameters<typeof real.increment>) => (a[0].startsWith("dedupe:") ? Promise.reject(new Error("db")) : real.increment(...a)), peek: real.peek, decrement: real.decrement };
    const { deps, enviarCorreo } = montar({ store });
    expect(await procesarContacto(deps, campos())).toMatchObject({ ok: false, code: "no_disponible" });
    expect(enviarCorreo).not.toHaveBeenCalled();
  });

  it("SecurityConfigError: 500 controlado con log y sin enviar", async () => {
    const { deps, enviarCorreo, logger } = montar({
      getSecrets: () => {
        throw new SecurityConfigError("form_token_secret_missing");
      },
    });
    expect(await procesarContacto(deps, campos())).toMatchObject({ ok: false, code: "config" });
    expect(enviarCorreo).not.toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toMatchObject({ event: "contacto.failed", reason: "config" });
  });

  it("fallo de SMTP: error al usuario y el reintento no se descarta como duplicado", async () => {
    const { deps, enviarCorreo, logger, clock } = montar();
    enviarCorreo.mockRejectedValueOnce(new Error("smtp down"));
    expect(await procesarContacto(deps, campos())).toMatchObject({ ok: false, code: "envio" });
    expect(logger.error.mock.calls[0][0]).toMatchObject({ event: "contacto.failed", reason: "smtp" });
    clock.t += 5_000;
    expect(await procesarContacto(deps, campos())).toEqual({ ok: true });
    expect(enviarCorreo).toHaveBeenCalledTimes(2);
  });

  it("fallo de SMTP: no deja histórico y reembolsa los cupos de usuario y buzón", async () => {
    const { deps, enviarCorreo, create, clock } = montar();
    enviarCorreo.mockRejectedValue(new Error("smtp down"));
    for (let i = 0; i < 12; i++) {
      clock.t += 1000;
      expect(await procesarContacto(deps, campos({ mensaje: `Mensaje número ${i} de prueba` }))).toMatchObject({ ok: false, code: "envio" });
    }
    expect(create).not.toHaveBeenCalled();
    enviarCorreo.mockResolvedValue(undefined);
    clock.t += 1000;
    expect(await procesarContacto(deps, campos({ mensaje: "Ahora sí funciona el envío" }))).toEqual({ ok: true });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("si falla el histórico el envío ya hecho cuenta como ok y solo hay log", async () => {
    const { deps, create, enviarCorreo, logger } = montar();
    create.mockRejectedValue(new Error("db"));
    expect(await procesarContacto(deps, campos())).toEqual({ ok: true });
    expect(enviarCorreo).toHaveBeenCalledTimes(1);
    expect(eventos(logger.warn)).toContain("contacto.history_failed");
  });

  it("el histórico se crea después del envío", async () => {
    const { deps, create, enviarCorreo } = montar();
    await procesarContacto(deps, campos());
    expect(enviarCorreo.mock.invocationCallOrder[0]).toBeLessThan(create.mock.invocationCallOrder[0]);
  });
});

describe("maskEmail", () => {
  it("enmascara el local-part", () => {
    expect(maskEmail("ana.perez@alu.atlanticomedio.es")).toBe("an***@alu.atlanticomedio.es");
    expect(maskEmail("nada")).toBe("***");
  });
});
