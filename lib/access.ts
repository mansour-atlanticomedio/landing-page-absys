import type { Access } from 'payload'

// Solo los admins del CMS (collection `users`); los lectores del campus también son usuarios autenticados y no deben pasar
export const isAdmin: Access = ({ req: { user } }) => user?.collection === 'users'

export const anyone: Access = () => true

// Solo para la collection de lectores (`loginCampus_service`): el filtro por id no distingue collections, no reutilizar en otra
export const isAdminOrSelfReader: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'users') return true
  return { id: { equals: user.id } }
}

// Contenido que se sirve público, pero que solo editan los admins
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
