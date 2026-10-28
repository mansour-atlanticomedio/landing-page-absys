import { APIError, type CollectionConfig, type Field } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelfUser } from '@/lib/access'
import {
  ROLE_OPTIONS,
  lastAdminDeleteError,
  lastAdminDemoteError,
  resolveRoleOnCreate,
} from '@/lib/users-roles'
import {
  PERMISSION_FLAGS,
  PERMISSION_FLAG_LABELS,
  SECTIONS,
  hasStoredPermissions,
  normalizePermissions,
  resolvePermissions,
  templateForRole,
} from '@/lib/permissions'

const permissionsField: Field = {
  name: 'permissions',
  label: 'Permisos por sección',
  type: 'group',
  saveToJWT: true,
  access: { create: isAdminField, update: isAdminField },
  admin: {
    description:
      'Qué puede hacer este usuario en cada sección. Al cambiar el rol se restablecen a la plantilla del nuevo rol. "Crear y editar" y "Eliminar" implican "Ver". Servicios internos y Usuarios y accesos son siempre solo para administradores.',
    condition: (data) => data?.role !== 'admin',
  },
  hooks: {
    // Sin interruptores guardados (usuarios anteriores a esta función) se muestran los de la plantilla del rol
    afterRead: [
      ({ value, data, siblingData }) => {
        const role = (data ?? siblingData)?.role
        if (hasStoredPermissions(value)) return value
        return role && role !== 'admin' ? templateForRole(role) : value
      },
    ],
  },
  fields: SECTIONS.map(({ key, label }) => ({
    name: key,
    label,
    type: 'group' as const,
    fields: [
      {
        type: 'row' as const,
        fields: PERMISSION_FLAGS.map((flag) => ({
          name: flag,
          label: PERMISSION_FLAG_LABELS[flag],
          type: 'checkbox' as const,
        })),
      },
    ],
  })),
}

const countOtherAdmins = async (req: any, excludeId?: number | string) => {
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
    where: excludeId === undefined
      ? { role: { equals: 'admin' } }
      : { and: [{ role: { equals: 'admin' } }, { id: { not_equals: excludeId } }] },
  })
  return totalDocs as number
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
        group: 'Usuarios y accesos',
        description: 'Personas con acceso a este panel de administración.',
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'updatedAt'],
  },
  // `unlock` por defecto lo permite cualquier usuario autenticado: un lector podría resetear el bloqueo de un admin
  access: {
    read: isAdminOrSelfUser,
    create: isAdmin,
    update: isAdminOrSelfUser,
    delete: isAdmin,
    unlock: isAdmin,
  },
  auth: true,
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        const role = resolveRoleOnCreate(totalDocs, data?.role)
        return { ...data, role, permissions: templateForRole(role) }
      },
      ({ data, originalDoc, operation }) => {
        if (operation !== 'update' || !data?.role || data.role === originalDoc?.role) return data
        return { ...data, permissions: templateForRole(data.role) }
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        if (data?.permissions && hasStoredPermissions(data.permissions)) {
          data.permissions = normalizePermissions(resolvePermissions({ role: 'viewer', permissions: data.permissions }) as any)
        }
        if (operation !== 'update' || !originalDoc) return data
        const nextRole = data?.role ?? originalDoc.role
        const error = lastAdminDemoteError({
          previousRole: originalDoc.role,
          nextRole,
          otherAdmins: originalDoc.role === 'admin' && nextRole !== 'admin' ? await countOtherAdmins(req, originalDoc.id) : 1,
        })
        if (error) throw new APIError(error, 400, undefined, true)
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const doc: any = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: true, req })
        const error = lastAdminDeleteError({
          role: doc?.role,
          otherAdmins: doc?.role === 'admin' ? await countOtherAdmins(req, id) : 1,
        })
        if (error) throw new APIError(error, 400, undefined, true)
      },
    ],
  },
  fields: [
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      saveToJWT: true,
      options: ROLE_OPTIONS,
      access: {
        // Sin usuario solo llega el alta del primer admin (create-first-user); el resto lo cierra el access de la collection
        create: (args) => !args.req.user || isAdminField(args),
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
        description: 'Administrador: todo. Editor: edita el contenido. Lector: solo consulta.',
      },
    },
    permissionsField,
  ],
}
