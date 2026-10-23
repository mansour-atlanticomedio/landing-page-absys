import type { Role } from '@/lib/access'

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Lector (solo lectura)', value: 'viewer' },
]

export const LAST_ADMIN_DEMOTE_ERROR = 'No se puede quitar el rol de administrador al último administrador.'
export const LAST_ADMIN_DELETE_ERROR = 'No se puede eliminar al último administrador.'

// Primer usuario de una BD vacía: admin, si no nadie podría gestionar el panel
export function resolveRoleOnCreate(totalUsers: number, role?: string | null): string {
  if (totalUsers === 0) return 'admin'
  return role || 'viewer'
}

export function lastAdminDemoteError(args: { previousRole?: string | null; nextRole?: string | null; otherAdmins: number }): string | null {
  if (args.previousRole !== 'admin' || args.nextRole === 'admin') return null
  return args.otherAdmins === 0 ? LAST_ADMIN_DEMOTE_ERROR : null
}

export function lastAdminDeleteError(args: { role?: string | null; otherAdmins: number }): string | null {
  if (args.role !== 'admin') return null
  return args.otherAdmins === 0 ? LAST_ADMIN_DELETE_ERROR : null
}
