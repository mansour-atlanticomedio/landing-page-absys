export const ANALYTICS_RETENTION_DAYS = 395
export const ANALYTICS_TIMEZONE = 'Europe/Madrid'
// Un visitante cuenta como conectado si su último latido es de hace menos de esto
export const PRESENCE_WINDOW_SECONDS = 120
export const PRESENCE_RETENTION_DAYS = 1
export const MAX_PATH_LENGTH = 200
export const MAX_REFERRER_LENGTH = 100
export const TRACK_RATE_LIMIT_PER_MIN = 60
// Sin cabecera de IP de confianza todas las peticiones comparten cubo: límite mucho más holgado
export const TRACK_RATE_LIMIT_UNKNOWN_IP_PER_MIN = 1200
export const PRUNE_PROBABILITY = 1 / 200

export const DEVICES = ['desktop', 'mobile', 'tablet', 'other'] as const
export type Device = (typeof DEVICES)[number]

export const BROWSERS = ['chrome', 'safari', 'firefox', 'edge', 'other'] as const
export type Browser = (typeof BROWSERS)[number]

export const IGNORED_PATH_PREFIXES = ['/admin', '/api', '/_next', '/auth'] as const
