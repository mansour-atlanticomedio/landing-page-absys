import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ROLE_TEMPLATES,
  SECTION_BY_SLUG,
  SECTION_KEYS,
  SECTIONS,
  normalizePermissions,
  resolvePermissions,
  templateForRole,
  writableSections,
} from '../permissions'

const root = join(__dirname, '..', '..')

const files = ['collections', 'globals'].flatMap((dir) =>
  readdirSync(join(root, dir))
    .filter((f) => f.endsWith('.ts'))
    .map((f) => ({ file: `${dir}/${f}`, src: readFileSync(join(root, dir, f), 'utf8') })),
)

const SIN_SECCION = ['Servicios internos', 'Usuarios y accesos']

describe('catálogo', () => {
  it('cada sección del mapa existe en el catálogo', () => {
    for (const s of Object.values(SECTION_BY_SLUG)) expect(SECTION_KEYS).toContain(s)
    expect(SECTIONS.map((s) => s.key)).toEqual([...SECTION_KEYS])
  })
  it('el mapa coincide con admin.group y con la fábrica usada en cada fichero', () => {
    const labels = Object.fromEntries(SECTIONS.map((s) => [s.label, s.key]))
    const vistos = new Set<string>()
    for (const { file, src } of files) {
      const slug = src.match(/^\s{0,6}slug: ['"](\w+)['"]/m)?.[1]
      const group = src.match(/group: ['"]([^'"]+)['"]/)?.[1]
      const factory = src.match(/section(?:Access|AccessPublic|Global)\('(\w+)'\)/)?.[1]
      if (!slug || !group) continue
      if (SIN_SECCION.includes(group)) {
        expect(factory, file).toBeUndefined()
        expect(SECTION_BY_SLUG[slug], file).toBeUndefined()
        continue
      }
      expect(labels[group], `${file}: grupo ${group}`).toBeDefined()
      expect(SECTION_BY_SLUG[slug], `${file}: ${slug} falta en el mapa`).toBe(labels[group])
      expect(factory, `${file}: usa la sección del mapa`).toBe(SECTION_BY_SLUG[slug])
      vistos.add(slug)
    }
    for (const slug of Object.keys(SECTION_BY_SLUG)) expect(vistos.has(slug), `${slug} no existe`).toBe(true)
  })
  it('ninguna collection o global usa los conjuntos antiguos', () => {
    for (const { file, src } of files) expect(src, file).not.toMatch(/contentAccess|contentGlobal/)
  })
})

describe('plantillas y resolución', () => {
  it('admin todo, editor todo, viewer solo ver', () => {
    for (const k of SECTION_KEYS) {
      expect(ROLE_TEMPLATES.admin[k]).toEqual({ read: true, write: true, delete: true })
      expect(ROLE_TEMPLATES.editor[k]).toEqual({ read: true, write: true, delete: true })
      expect(ROLE_TEMPLATES.viewer[k]).toEqual({ read: true, write: false, delete: false })
    }
  })
  it('rol ausente o desconocido: sin permisos', () => {
    for (const u of [null, undefined, {}, { role: 'root' }, { role: null }]) {
      for (const k of SECTION_KEYS) expect(resolvePermissions(u as any)[k]).toEqual({ read: false, write: false, delete: false })
    }
    expect(templateForRole('x').paginas.read).toBe(false)
  })
  it('sin permisos guardados cae a la plantilla (null, vacío, todo null)', () => {
    expect(resolvePermissions({ role: 'viewer' }).medios.write).toBe(false)
    expect(resolvePermissions({ role: 'editor', permissions: null }).medios.delete).toBe(true)
    expect(resolvePermissions({ role: 'editor', permissions: {} }).medios.delete).toBe(true)
    expect(
      resolvePermissions({ role: 'editor', permissions: { medios: { read: null, write: null, delete: null } } }).medios.write,
    ).toBe(true)
  })
  it('el admin ignora los interruptores', () => {
    const p = resolvePermissions({ role: 'admin', permissions: { medios: { read: false, write: false, delete: false } } })
    expect(p.medios).toEqual({ read: true, write: true, delete: true })
  })
  it('write o delete fuerzan read', () => {
    const p = resolvePermissions({ role: 'viewer', permissions: { medios: { read: false, write: true, delete: false } } })
    expect(p.medios).toEqual({ read: true, write: true, delete: false })
    const q = normalizePermissions({ ...templateForRole('viewer'), bloques: { read: false, write: false, delete: true } })
    expect(q.bloques.read).toBe(true)
  })
  it('los guardados prevalecen y los nulos usan la plantilla', () => {
    const p = resolvePermissions({ role: 'editor', permissions: { medios: { read: true, write: false, delete: null } } })
    expect(p.medios).toEqual({ read: true, write: false, delete: true })
  })
  it('writableSections', () => {
    expect(writableSections({ role: 'viewer' })).toEqual([])
    expect(writableSections({ role: 'editor' })).toEqual([...SECTION_KEYS])
    expect(writableSections({ role: 'viewer', permissions: { paginas: { write: true } } })).toEqual(['paginas'])
  })
})
