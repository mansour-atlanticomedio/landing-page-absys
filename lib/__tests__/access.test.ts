import { describe, expect, it } from 'vitest'
import { adminOnly, adminOnlyGlobal, anyone, isAdmin, isAdminOrSelfReader, publicReadAdminWrite } from '../access'

const as = (user: any) => ({ req: { user } }) as any

const admin = { id: 1, collection: 'users' }
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
