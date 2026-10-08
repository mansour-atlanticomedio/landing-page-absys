import type { CollectionConfig } from 'payload'
import { adminOnly, isAdmin } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  // `unlock` por defecto lo permite cualquier usuario autenticado: un lector podría resetear el bloqueo de un admin
  access: { ...adminOnly, unlock: isAdmin },
  auth: true,
  fields: [
    
  ],
}
