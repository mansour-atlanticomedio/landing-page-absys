import { APIError, type CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelfUser } from '@/lib/access'
import {
  ROLE_OPTIONS,
  lastAdminDeleteError,
  lastAdminDemoteError,
  resolveRoleOnCreate,
} from '@/lib/users-roles'

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
        return { ...data, role: resolveRoleOnCreate(totalDocs, data?.role) }
      },
    ],
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
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
  ],
}
