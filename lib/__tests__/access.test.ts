import { describe, expect, it } from 'vitest'
import {
  adminOnly,
  adminOnlyGlobal,
  anyone,
  contentAccess,
  contentAccessPublic,
  contentGlobal,
  isAdmin,
  isAdminField,
  isAdminOrSelfReader,
  isAdminOrSelfUser,
  isEditor,
  isPanelUser,
  publicReadAdminWrite,
} from '../access'
import { lastAdminDeleteError, lastAdminDemoteError, resolveRoleOnCreate } from '../users-roles'

const as = (user: any) => ({ req: { user } }) as any

const admin = { id: 1, collection: 'users', role: 'admin' }
const editor = { id: 2, collection: 'users', role: 'editor' }
const viewer = { id: 4, collection: 'users', role: 'viewer' }
const sinRol = { id: 5, collection: 'users', role: null }
const lector = { id: 7, collection: 'loginCampus_service' }
const antiguo = { id: 3, collection: 'loginAbsys_service' }

describe('isAdmin', () => {
  it('acepta solo a la collection users', () => {
    expect(isAdmin(as(admin))).toBe(true)
    expect(isAdmin(as(lector))).toBe(false)
    expect(isAdmin(as(antiguo))).toBe(false)
    expect(isAdmin(as(null))).toBe(false)
    expect(isAdmin(as(undefined))).toBe(false)
  })
})

describe('anyone', () => {
  it('deja pasar a todos', () => {
    expect(anyone(as(null))).toBe(true)
  })
})

describe('isAdminOrSelfReader', () => {
  it('admin lee todo, lector solo su id, anónimo nada', () => {
    expect(isAdminOrSelfReader(as(admin))).toBe(true)
    expect(isAdminOrSelfReader(as(lector))).toEqual({ id: { equals: 7 } })
    expect(isAdminOrSelfReader(as(null))).toBe(false)
  })
})

describe('conjuntos de access', () => {
  it('adminOnly cierra todo a lectores', () => {
    for (const fn of Object.values(adminOnly)) expect(fn(as(lector))).toBe(false)
    for (const fn of Object.values(adminOnlyGlobal)) expect(fn(as(lector))).toBe(false)
  })
  it('publicReadAdminWrite deja leer a todos y escribir solo a admins', () => {
    expect(publicReadAdminWrite.read(as(null))).toBe(true)
    expect(publicReadAdminWrite.create(as(lector))).toBe(false)
    expect(publicReadAdminWrite.update(as(null))).toBe(false)
    expect(publicReadAdminWrite.delete(as(admin))).toBe(true)
  })
})

describe('roles del panel', () => {
  it('isAdmin / isEditor / isPanelUser por rol', () => {
    expect([admin, editor, viewer, sinRol, lector, null].map((u) => isAdmin(as(u)))).toEqual([true, false, false, false, false, false])
    expect([admin, editor, viewer, sinRol, lector, null].map((u) => isEditor(as(u)))).toEqual([true, true, false, false, false, false])
    expect([admin, editor, viewer, sinRol, lector, null].map((u) => isPanelUser(as(u)))).toEqual([true, true, true, false, false, false])
  })
  it('contentAccess: viewer lee pero no escribe', () => {
    expect(contentAccess.read(as(viewer))).toBe(true)
    expect(contentAccess.create(as(viewer))).toBe(false)
    expect(contentAccess.update(as(viewer))).toBe(false)
    expect(contentAccess.delete(as(viewer))).toBe(false)
    expect(contentAccess.update(as(editor))).toBe(true)
    expect(contentAccess.read(as(sinRol))).toBe(false)
    expect(contentAccess.read(as(lector))).toBe(false)
  })
  it('contentAccessPublic y contentGlobal', () => {
    expect(contentAccessPublic.read(as(null))).toBe(true)
    expect(contentAccessPublic.create(as(editor))).toBe(true)
    expect(contentAccessPublic.create(as(viewer))).toBe(false)
    expect(contentGlobal.read(as(viewer))).toBe(true)
    expect(contentGlobal.update(as(viewer))).toBe(false)
    expect(contentGlobal.update(as(editor))).toBe(true)
    expect(contentGlobal.read(as(lector))).toBe(false)
  })
  it('adminOnly cierra todo a editor y viewer', () => {
    for (const u of [editor, viewer, sinRol]) {
      for (const fn of Object.values(adminOnly)) expect(fn(as(u))).toBe(false)
      for (const fn of Object.values(adminOnlyGlobal)) expect(fn(as(u))).toBe(false)
    }
  })
  it('isAdminOrSelfUser: admin todo, resto solo su ficha', () => {
    expect(isAdminOrSelfUser(as(admin))).toBe(true)
    expect(isAdminOrSelfUser(as(editor))).toEqual({ id: { equals: 2 } })
    expect(isAdminOrSelfUser(as(viewer))).toEqual({ id: { equals: 4 } })
    expect(isAdminOrSelfUser(as(sinRol))).toBe(false)
    expect(isAdminOrSelfUser(as(lector))).toBe(false)
    expect(isAdminOrSelfUser(as(null))).toBe(false)
  })
  it('isAdminField solo admin', () => {
    expect(isAdminField({ req: { user: admin } } as any)).toBe(true)
    expect(isAdminField({ req: { user: editor } } as any)).toBe(false)
  })
  it('isAdminOrSelfReader: un editor no lee lectores', () => {
    expect(isAdminOrSelfReader(as(editor))).toBe(false)
  })
})

describe('roles: reglas puras', () => {
  it('el primer usuario es admin', () => {
    expect(resolveRoleOnCreate(0, 'viewer')).toBe('admin')
    expect(resolveRoleOnCreate(0)).toBe('admin')
    expect(resolveRoleOnCreate(3, 'editor')).toBe('editor')
    expect(resolveRoleOnCreate(3)).toBe('viewer')
  })
  it('no se degrada ni borra al último admin', () => {
    expect(lastAdminDemoteError({ previousRole: 'admin', nextRole: 'viewer', otherAdmins: 0 })).toMatch(/último/)
    expect(lastAdminDemoteError({ previousRole: 'admin', nextRole: 'viewer', otherAdmins: 1 })).toBeNull()
    expect(lastAdminDemoteError({ previousRole: 'admin', nextRole: 'admin', otherAdmins: 0 })).toBeNull()
    expect(lastAdminDemoteError({ previousRole: 'editor', nextRole: 'viewer', otherAdmins: 0 })).toBeNull()
    expect(lastAdminDeleteError({ role: 'admin', otherAdmins: 0 })).toMatch(/último/)
    expect(lastAdminDeleteError({ role: 'admin', otherAdmins: 2 })).toBeNull()
    expect(lastAdminDeleteError({ role: 'editor', otherAdmins: 0 })).toBeNull()
  })
})
