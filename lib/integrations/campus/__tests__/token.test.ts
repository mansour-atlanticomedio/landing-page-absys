import { createCipheriv, randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  CampusTokenError,
  campusDateToIsoUtc,
  decryptCampusToken,
  encryptCampusToken,
  toCampusKey,
  verifyCampusToken,
} from "../token";

const key = toCampusKey("clave-de-prueba-campus");

// Replica lo que hace el campus en PHP: base64(IV + openssl_encrypt(AES-128-CBC))
const encryptLikeCampus = (plain: string, cipherKey = key) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-128-cbc", cipherKey, iv);
  return Buffer.concat([iv, cipher.update(plain, "utf-8"), cipher.final()]).toString("base64");
};

describe("campusDateToIsoUtc", () => {
  it("convierte la hora de Canarias en verano (UTC+1) a UTC", () => {
    expect(campusDateToIsoUtc("2026-09-23 12:04:52", "Atlantic/Canary")).toBe("2026-09-23T11:04:52.000Z");
  });

  it("convierte la hora de Canarias en invierno (UTC+0) a UTC", () => {
    expect(campusDateToIsoUtc("2026-01-15 09:00:00", "Atlantic/Canary")).toBe("2026-01-15T09:00:00.000Z");
  });

  it("devuelve null con un formato desconocido", () => {
    expect(campusDateToIsoUtc("23/09/2026 12:04", "Atlantic/Canary")).toBeNull();
  });
});

describe("decryptCampusToken", () => {
  it("descifra la fecha y el email del campus", () => {
    const token = encryptLikeCampus("2026-09-23 12:04:52|Lector.Prueba@atlanticomedio.es");
    expect(decryptCampusToken(token, key)).toEqual({
      fecha: "2026-09-23T11:04:52.000Z",
      email: "lector.prueba@atlanticomedio.es",
    });
  });

  it("acepta el token aunque los + del base64 lleguen como espacios", () => {
    let token = "";
    while (!token.includes("+")) token = encryptLikeCampus("2026-09-23 12:04:52|lector.prueba@atlanticomedio.es");
    expect(decryptCampusToken(token.replace(/\+/g, " "), key)?.email).toBe("lector.prueba@atlanticomedio.es");
  });

  it("devuelve null con una clave distinta", () => {
    const token = encryptLikeCampus("2026-09-23 12:04:52|lector.prueba@atlanticomedio.es", toCampusKey("otra-clave"));
    expect(decryptCampusToken(token, key)).toBeNull();
  });

  it("devuelve null si el token es demasiado corto o no es base64", () => {
    expect(decryptCampusToken("abc", key)).toBeNull();
    expect(decryptCampusToken("", key)).toBeNull();
  });

  it("devuelve null si falta el email", () => {
    expect(decryptCampusToken(encryptLikeCampus("2026-09-23 12:04:52"), key)).toBeNull();
  });
});

describe("encryptCampusToken", () => {
  it("genera un token que el descifrado del campus entiende", () => {
    const now = new Date("2026-09-23T11:04:52.000Z");
    const token = encryptCampusToken("lector.prueba@atlanticomedio.es", { now, key, timeZone: "Atlantic/Canary" });
    expect(decryptCampusToken(token, key)).toEqual({
      fecha: now.toISOString(),
      email: "lector.prueba@atlanticomedio.es",
    });
  });
});

describe("verifyCampusToken", () => {
  const token = encryptLikeCampus("2026-09-23 12:04:52|lector.prueba@atlanticomedio.es");
  const emitido = new Date("2026-09-23T11:04:52.000Z");

  it("acepta un token recién emitido", () => {
    const now = new Date(emitido.getTime() + 30_000);
    expect(verifyCampusToken(token, { now, key, maxAgeSeconds: 300 }).email).toBe("lector.prueba@atlanticomedio.es");
  });

  it("rechaza un token más viejo que el máximo permitido", () => {
    const now = new Date(emitido.getTime() + 301_000);
    expect(() => verifyCampusToken(token, { now, key, maxAgeSeconds: 300 })).toThrow(
      expect.objectContaining({ reason: "caducado" })
    );
  });

  it("rechaza un token con fecha en el futuro más allá del desfase de reloj", () => {
    const now = new Date(emitido.getTime() - 120_000);
    expect(() => verifyCampusToken(token, { now, key })).toThrow(CampusTokenError);
  });

  it("rechaza un token manipulado", () => {
    const bytes = Buffer.from(token, "base64");
    bytes[bytes.length - 1] ^= 0xff;
    expect(() => verifyCampusToken(bytes.toString("base64"), { now: emitido, key })).toThrow(
      expect.objectContaining({ reason: "invalido" })
    );
  });
});
