import { describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "@/collections/Email.service";
import { procesarContacto } from "../contacto-envio";
import { createMemoryStore, signFormToken } from "../security";

const SECRET = "abcdefghijklmnopqrstuvwxyz012345";
const NOW = 1_800_000_000_000;

const ataque = {
  nombre: "<script>alert(1)</script>Ana",
  email: "ana@alu.atlanticomedio.es",
  asunto: "Hola <img src=x onerror=alert(1)>\r\nBcc: victima@x.es",
  mensaje: "Línea 1 <script>alert(2)</script>\nLínea 2 <img src=x onerror=alert(3)>\r\nLínea 3",
};

describe("sendContactEmail: escapado", () => {
  it("escapa HTML, convierte saltos en <br> y deja cabeceras de una línea", async () => {
    const sendEmail = vi.fn().mockResolvedValue(undefined);
    await sendContactEmail({ sendEmail } as any, {
      solicitante: { nombre: ataque.nombre, email: `${ataque.email}\r\nBcc: x@y.es`, rol: "<b>Rol</b>" },
      asunto: ataque.asunto,
      mensaje: ataque.mensaje,
    });
    const msg = sendEmail.mock.calls[0][0];
    const cuerpo = String(msg.html).replace(/<img src="cid:unam-logo"[^>]*>/, "");
    expect(cuerpo).not.toContain("<script");
    expect(cuerpo).not.toMatch(/<img/);
    expect(cuerpo).not.toContain("<b>Rol");
    expect(cuerpo).toContain("&lt;script&gt;");
    expect(cuerpo).toContain("Línea 1 &lt;script&gt;alert(2)&lt;/script&gt;<br>Línea 2");
    expect(cuerpo).toContain("<br>Línea 3");
    expect(msg.subject).not.toMatch(/[\r\n]/);
    expect(msg.replyTo).not.toMatch(/[\r\n]/);
  });
});

describe("procesarContacto + sendContactEmail: el solicitante sale de la sesión", () => {
  it("ignora name/email/rol falsos del input", async () => {
    const sendEmail = vi.fn().mockResolvedValue(undefined);
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const res = await procesarContacto(
      {
        session: { id: 7, email: "ana.perez@alu.atlanticomedio.es", nombre: "Ana", apellidos: "Pérez", rol: "Alumnado" },
        headers: new Headers({ "x-real-ip": "203.0.113.5" }),
        store: createMemoryStore(),
        now: () => NOW,
        getSecrets: () => [SECRET],
        ipOptions: { trustedHeader: "x-real-ip" },
        mailbox: "biblioteca@atlanticomedio.es",
        payload: { logger, create: vi.fn().mockResolvedValue({}), sendEmail } as any,
        enviarCorreo: (p, d) => sendContactEmail(p, d),
      },
      {
        asunto: "Consulta sobre préstamo",
        mensaje: "Quisiera saber cómo renovar un libro.",
        website_url: "",
        form_token: signFormToken(SECRET, NOW - 10_000, "contacto"),
        name: "Director General",
        email: "director@atlanticomedio.es",
        rol: "Personal",
      },
    );
    expect(res).toEqual({ ok: true });
    const msg = sendEmail.mock.calls[0][0];
    expect(msg.replyTo).toBe("ana.perez@alu.atlanticomedio.es");
    expect(msg.html).toContain("Ana Pérez");
    expect(msg.html).toContain("Alumnado");
    expect(msg.html).not.toContain("Director General");
    expect(msg.html).not.toContain("director@");
    expect(msg.html).not.toContain("Personal");
  });
});
