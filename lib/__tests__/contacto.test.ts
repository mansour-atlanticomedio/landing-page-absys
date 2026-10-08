import { describe, expect, it } from "vitest";
import { ASUNTO_MAX, MENSAJE_MAX, validarContacto } from "../contacto";

const ok = { asunto: "Consulta sobre préstamo", mensaje: "Quisiera saber cómo renovar un libro." };

describe("validarContacto", () => {
  it("acepta y recorta espacios", () => {
    expect(validarContacto({ asunto: "  Hola  ", mensaje: "  Mensaje de prueba  " })).toEqual({ asunto: "Hola", mensaje: "Mensaje de prueba" });
  });

  it("rechaza tipos no string y entradas vacías", () => {
    expect(validarContacto({ asunto: 1, mensaje: ok.mensaje })).toHaveProperty("error");
    expect(validarContacto({ asunto: ok.asunto, mensaje: ["a"] })).toHaveProperty("error");
    expect(validarContacto(null)).toHaveProperty("error");
    expect(validarContacto("x")).toHaveProperty("error");
  });

  it("limita la longitud del asunto", () => {
    expect(validarContacto({ ...ok, asunto: "ab" })).toHaveProperty("error");
    expect(validarContacto({ ...ok, asunto: "a".repeat(ASUNTO_MAX) })).toHaveProperty("asunto");
    expect(validarContacto({ ...ok, asunto: "a".repeat(ASUNTO_MAX + 1) })).toHaveProperty("error");
  });

  it("limita la longitud del mensaje", () => {
    expect(validarContacto({ ...ok, mensaje: "corto" })).toHaveProperty("error");
    expect(validarContacto({ ...ok, mensaje: "a".repeat(MENSAJE_MAX) })).toHaveProperty("mensaje");
    expect(validarContacto({ ...ok, mensaje: "a".repeat(MENSAJE_MAX + 1) })).toHaveProperty("error");
  });

  it("el asunto no admite saltos de línea ni caracteres de control", () => {
    for (const asunto of ["Hola\nBcc: x@y.es", "Hola\r\nmundo", "Hola\u0000", "Hola x", "Hola\u0085x"]) {
      expect(validarContacto({ ...ok, asunto })).toHaveProperty("error");
    }
  });

  it("el mensaje admite saltos de línea pero no caracteres de control", () => {
    expect(validarContacto({ ...ok, mensaje: "Primera línea\r\nSegunda línea\ttab" })).toEqual({ asunto: ok.asunto, mensaje: "Primera línea\nSegunda línea\ttab" });
    expect(validarContacto({ ...ok, mensaje: "Mensaje con nulo\u0000 dentro" })).toHaveProperty("error");
  });
});
