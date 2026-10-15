export const RESERVED_SEGMENTS = [
  'admin',
  'api',
  'auth',
  'login',
  'biblioteca',
  'libros',
  'perfil',
  'prestamos',
  'reservas',
  'contacto',
  'servicios',
  'formacion',
  'investigacion',
  'repositorios',
  'recursos',
  'adquisiciones',
  '_next',
  'media',
  'graphql',
  'graphql-playground',
] as const

export const LOCKED_SLUGS = [
  'conocenos/quienes-somos',
  'conocenos/horarios-ubicacion-y-contacto',
  'conocenos/normativa-y-condiciones-de-uso',
] as const

const SLUG_PATTERN = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/

export const normalizePageSlug = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase().replace(/^\/+|\/+$/g, '') : ''

export const validatePageSlug = (value: unknown): true | string => {
  if (typeof value !== 'string' || value.length === 0) return 'La ruta es obligatoria.'
  if (!SLUG_PATTERN.test(value)) {
    return 'Usa solo minúsculas, números y guiones, separando niveles con "/" (sin "/" al principio ni al final).'
  }
  const first = value.split('/')[0]
  if ((RESERVED_SEGMENTS as readonly string[]).includes(first)) {
    return `"${first}" es una ruta reservada de la web; elige otra.`
  }
  return true
}

export const isLockedPageSlug = (value: unknown): boolean =>
  typeof value === 'string' && (LOCKED_SLUGS as readonly string[]).includes(value)

export type PageStatus = 'draft' | 'published' | undefined | null

export const resolveSlugOnSave = (
  value: unknown,
  status: PageStatus,
): { slug: string | undefined; error: string | null } => {
  const slug = normalizePageSlug(value) || undefined
  if (status !== 'published') return { slug, error: null }
  const result = validatePageSlug(slug)
  return { slug, error: result === true ? null : result }
}

export const LOCKED_DELETE_MESSAGE =
  'Esta página es parte de la estructura de la web y no se puede eliminar.'

export const LOCKED_UNPUBLISH_MESSAGE =
  'Esta página es parte de la estructura de la web y no se puede despublicar.'

export const lockedDeleteError = (slug: unknown): string | null =>
  isLockedPageSlug(slug) ? LOCKED_DELETE_MESSAGE : null

export const lockedUnpublishError = (input: {
  slug: unknown
  previousStatus: PageStatus
  nextStatus: PageStatus
  isDraftSave: boolean
}): string | null => {
  if (!isLockedPageSlug(input.slug)) return null
  if (input.isDraftSave) return null
  if (input.previousStatus === 'published' && input.nextStatus === 'draft') return LOCKED_UNPUBLISH_MESSAGE
  return null
}
