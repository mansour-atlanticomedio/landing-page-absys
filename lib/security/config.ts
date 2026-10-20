import { createHmac } from 'node:crypto'
import { MIN_SECRET_LENGTH, SecurityConfigError } from './honeypot'
import type { ClientIpOptions } from './client-ip'

/*
 * Lee la configuración de seguridad del entorno. Nada lanza al importar el módulo: solo al
 * llamar a las funciones, para que un secreto ausente rompa el envío (500 controlado) y no el build.
 */

type Env = Record<string, string | undefined>

const valid = (v: string | undefined): v is string => typeof v === 'string' && v.length >= MIN_SECRET_LENGTH

/*
 * Devuelve [actual, anterior?] para verifyFormToken. El actual es FORM_TOKEN_SECRET si existe y
 * tiene >= 32 caracteres (si está definido y es más corto, lanza); si no existe, se DERIVA de PAYLOAD_SECRET con HMAC-SHA256 (así dev funciona
 * sin tocar .env y el secreto de Payload nunca se usa tal cual). Como el HMAC siempre da 64
 * caracteres, vale cualquier PAYLOAD_SECRET no vacío, aunque sea corto (el de dev lo es). Ojo: rotar PAYLOAD_SECRET (o definir FORM_TOKEN_SECRET por
 * primera vez) cambia el secreto derivado e invalida los formularios abiertos hasta que se recarguen; para
 * una rotación sin cortes, poner el secreto antiguo en FORM_TOKEN_SECRET_PREVIOUS. FORM_TOKEN_SECRET_PREVIOUS es
 * opcional y sirve para rotar sin invalidar los formularios abiertos. Lanza SecurityConfigError
 * si no hay ninguna fuente válida.
 */
export function getFormTokenSecrets(env: Env = process.env): string[] {
  let current: string | undefined
  // Un secreto explícito pero corto es una mala configuración: mejor fallar que degradar sin aviso
  if (env.FORM_TOKEN_SECRET && !valid(env.FORM_TOKEN_SECRET)) {
    throw new SecurityConfigError('form_token_secret_too_short')
  }
  if (valid(env.FORM_TOKEN_SECRET)) current = env.FORM_TOKEN_SECRET
  else if (env.PAYLOAD_SECRET) {
    current = createHmac('sha256', env.PAYLOAD_SECRET).update('form-token-v1').digest('hex')
  }
  if (!current) throw new SecurityConfigError('form_token_secret_missing')

  const previous = env.FORM_TOKEN_SECRET_PREVIOUS
  return valid(previous) && previous !== current ? [current, previous] : [current]
}

/*
 * Cabecera con la IP real del cliente (la que SOBRESCRIBE nuestro proxy) y, para x-forwarded-for,
 * cuántos proxies de confianza hay desde la derecha (TRUSTED_IP_HOP, entero >= 1, por defecto 1).
 * Sin TRUSTED_IP_HEADER no se confía en ninguna cabecera y la IP es "unknown".
 */
export function getTrustedIpOptions(env: Env = process.env): ClientIpOptions {
  const trustedHeader = env.TRUSTED_IP_HEADER?.trim() || undefined
  const raw = env.TRUSTED_IP_HOP?.trim()
  const hop = raw ? Number(raw) : 1
  return { trustedHeader, trustedHopFromRight: Number.isInteger(hop) && hop >= 1 ? hop : 1 }
}
