import type { Access, FieldAccess } from 'payload'
import { resolvePermissions, type PermissionFlag, type SectionKey } from '@/lib/permissions'

export const ROLES = ['admin', 'editor', 'viewer'] as const
export type Role = (typeof ROLES)[number]

const roleOf = (user: any): Role | null => (user?.collection === 'users' && ROLES.includes(user.role) ? user.role : null)

// Usuarios del panel (collection `users`) con rol admin; un rol ausente no da permisos
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'

// Admin o editor: pueden escribir contenido
export const isEditor: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  return role === 'admin' || role === 'editor'
}

// Cualquier usuario del panel con rol válido, incluido el de solo lectura
export const isPanelUser: Access = ({ req: { user } }) => roleOf(user) !== null

export const isAdminField: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

export const anyone: Access = () => true

// Solo para la collection de lectores (`loginCampus_service`): el filtro por id no distingue collections, no reutilizar en otra
export const isAdminOrSelfReader: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return roleOf(user) === 'admin'
  return { id: { equals: user.id } }
}

// Solo para `users`: el admin ve a todos, el resto únicamente su propia ficha
export const isAdminOrSelfUser: Access = ({ req: { user } }) => {
  const role = roleOf(user)
  if (!role) return false
  if (role === 'admin') return true
  return { id: { equals: user!.id } }
}

// Contenido que se sirve público, pero que solo editan los admins (collections de servicio)
export const publicReadAdminWrite = {
  read: anyone,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const adminOnly = {
  read: isAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const adminOnlyGlobal = {
  read: isAdmin,
  update: isAdmin,
}

const can = (section: SectionKey, flag: PermissionFlag): Access => ({ req: { user } }) => {
  const role = roleOf(user)
  if (!role) return false
  if (role === 'admin') return true
  return resolvePermissions(user as any)[section][flag]
}

// Contenido de una sección del panel: los permisos salen de los interruptores del usuario (o de la plantilla de su rol)
export const sectionAccess = (section: SectionKey) => ({
  read: can(section, 'read'),
  create: can(section, 'write'),
  update: can(section, 'write'),
  delete: can(section, 'delete'),
})

// Igual, pero la lectura es pública (media, hero, header...)
export const sectionAccessPublic = (section: SectionKey) => ({
  ...sectionAccess(section),
  read: anyone,
})

export const sectionGlobal = (section: SectionKey) => ({
  read: can(section, 'read'),
  update: can(section, 'write'),
})
