export const ASUNTO_MIN = 3;
export const ASUNTO_MAX = 150;
export const MENSAJE_MIN = 10;
export const MENSAJE_MAX = 2000;

export interface MensajeContacto {
  asunto: string;
  mensaje: string;
}

// Saltos de línea y caracteres de control (incluidos los Unicode de línea/párrafo) en el asunto permitirían inyectar cabeceras en el correo
const CONTROL_ASUNTO = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/;
// En el cuerpo solo se admiten saltos de línea y tabulaciones como control
const CONTROL_MENSAJE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/;

export const validarContacto = (input: unknown): MensajeContacto | { error: string } => {
  const item = (input ?? {}) as Record<string, unknown>;
  if (typeof item.asunto !== "string" || typeof item.mensaje !== "string") return { error: "Rellena el asunto y el mensaje." };

  const asunto = item.asunto.trim();
  const mensaje = item.mensaje.replace(/\r\n?/g, "\n").trim();

  if (asunto.length < ASUNTO_MIN) return { error: `El asunto debe tener al menos ${ASUNTO_MIN} caracteres.` };
  if (asunto.length > ASUNTO_MAX) return { error: `El asunto no puede superar los ${ASUNTO_MAX} caracteres.` };
  if (CONTROL_ASUNTO.test(asunto)) return { error: "El asunto no puede contener saltos de línea ni caracteres especiales." };

  if (mensaje.length < MENSAJE_MIN) return { error: `El mensaje debe tener al menos ${MENSAJE_MIN} caracteres.` };
  if (mensaje.length > MENSAJE_MAX) return { error: `El mensaje no puede superar los ${MENSAJE_MAX} caracteres.` };
  if (CONTROL_MENSAJE.test(mensaje)) return { error: "El mensaje contiene caracteres no permitidos." };

  return { asunto, mensaje };
};
