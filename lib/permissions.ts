export const SECTION_KEYS = ['paginas', 'bloques', 'navegacion', 'medios'] as const
export type SectionKey = (typeof SECTION_KEYS)[number]

export const PERMISSION_FLAGS = ['read', 'write', 'delete'] as const
export type PermissionFlag = (typeof PERMISSION_FLAGS)[number]

export type SectionPermissions = Record<PermissionFlag, boolean>
export type Permissions = Record<SectionKey, SectionPermissions>

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'paginas', label: 'Páginas' },
  { key: 'bloques', label: 'Bloques de contenido' },
  { key: 'navegacion', label: 'Navegación y pie' },
  { key: 'medios', label: 'Medios' },
]

export const PERMISSION_FLAG_LABELS: Record<PermissionFlag, string> = {
  read: 'Ver',
  write: 'Crear y editar',
  delete: 'Eliminar',
}

// Slug de collection o global -> sección del panel (coincide con su admin.group)
export const SECTION_BY_SLUG: Record<string, SectionKey> = {
  pages: 'paginas',
  login_page: 'paginas',
  home: 'paginas',
  services: 'paginas',
  formation: 'paginas',
  investigation: 'paginas',
  repository: 'paginas',
  library: 'paginas',
  contact: 'paginas',
  about_us: 'paginas',
  horarios_contacto: 'paginas',
  electronic_resources: 'paginas',
  quienes_somos: 'paginas',
  solicitud_compra: 'paginas',

  hero: 'bloques',
  hero_carrusel: 'bloques',
  speakers: 'bloques',
  statistics: 'bloques',
  about: 'bloques',
  features: 'bloques',
  timeline: 'bloques',
  input: 'bloques',
  cta: 'bloques',
  faq: 'bloques',
  news: 'bloques',
  blogs: 'bloques',
  electronic_resources_access: 'bloques',
  schedule: 'bloques',
  partners: 'bloques',

  header: 'navegacion',
  footer: 'navegacion',
  layout: 'navegacion',

  media: 'medios',
}

const all = (value: boolean): Permissions =>
  Object.fromEntries(SECTION_KEYS.map((k) => [k, { read: value, write: value, delete: value }])) as Permissions

export const ROLE_TEMPLATES: Record<string, Permissions> = {
  admin: all(true),
  editor: all(true),
  viewer: Object.fromEntries(
    SECTION_KEYS.map((k) => [k, { read: true, write: false, delete: false }]),
  ) as Permissions,
}

export const isKnownRole = (role: unknown): role is 'admin' | 'editor' | 'viewer' =>
  typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLE_TEMPLATES, role)

export function templateForRole(role: unknown): Permissions {
  const base = isKnownRole(role) ? ROLE_TEMPLATES[role] : all(false)
  return structuredClone(base)
}

// write o delete implican read
export function normalizePermissions(perms: Permissions): Permissions {
  const out = structuredClone(perms)
  for (const key of SECTION_KEYS) {
    const s = out[key]
    if (s.write || s.delete) s.read = true
  }
  return out
}

export function hasStoredPermissions(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false
  return SECTION_KEYS.some((k) => {
    const s = (raw as any)[k]
    return s && typeof s === 'object' && PERMISSION_FLAGS.some((f) => typeof s[f] === 'boolean')
  })
}

// Permisos efectivos: admin todo; si no, los interruptores guardados, con la plantilla del rol como respaldo
export function resolvePermissions(user: { role?: unknown; permissions?: unknown } | null | undefined): Permissions {
  const role = user?.role
  if (!isKnownRole(role)) return all(false)
  if (role === 'admin') return all(true)
  const base = templateForRole(role)
  if (!hasStoredPermissions(user?.permissions)) return base
  const raw: any = user!.permissions
  for (const key of SECTION_KEYS) {
    for (const flag of PERMISSION_FLAGS) {
      if (typeof raw?.[key]?.[flag] === 'boolean') base[key][flag] = raw[key][flag]
    }
  }
  return normalizePermissions(base)
}

export function writableSections(user: { role?: unknown; permissions?: unknown } | null | undefined): SectionKey[] {
  const p = resolvePermissions(user)
  return SECTION_KEYS.filter((k) => p[k].write)
}
