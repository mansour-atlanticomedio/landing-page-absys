import { describe, expect, it } from 'vitest'
import { buildBreadcrumbs } from '../breadcrumbs'

const navbar = [
  { name: 'Inicio', href: '/', items: [] },
  { name: 'Conócenos', href: null, items: [{ label: 'Quiénes somos', href: '/conocenos/quienes-somos' }] },
  { name: 'Servicios', href: '/servicios', items: [] },
  { name: 'Recursos', href: null, items: [{ label: 'Catálogo', href: '/recursos/catalogo' }] },
]
const titles = { 'preguntas-frecuentes': 'Preguntas frecuentes', 'recursos/recursos-electronicos': 'Recursos electrónicos' }

describe('buildBreadcrumbs', () => {
  it('no hay migas en la portada ni en las rutas del sistema', () => {
    for (const p of ['/', '/login', '/auth/campus', '/admin/collections/pages', '/api/pages']) {
      expect(buildBreadcrumbs(p, navbar, titles)).toEqual([])
    }
  })
  it('usa la etiqueta del menú y no enlaza el nivel sin página', () => {
    const crumbs = buildBreadcrumbs('/conocenos/quienes-somos', navbar, titles)
    expect(crumbs.map((c) => c.label)).toEqual(['Inicio', 'Conócenos', 'Quiénes somos'])
    expect(crumbs.map((c) => c.linkable)).toEqual([true, false, true])
  })
  it('toma el título de la página del CMS si no está en el menú', () => {
    expect(buildBreadcrumbs('/preguntas-frecuentes', navbar, titles).map((c) => c.label)).toEqual(['Inicio', 'Preguntas frecuentes'])
    expect(buildBreadcrumbs('/recursos/recursos-electronicos', navbar, titles).map((c) => c.label)).toEqual(['Inicio', 'Recursos', 'Recursos electrónicos'])
  })
  it('legibiliza el segmento si no hay etiqueta y tolera la barra final', () => {
    expect(buildBreadcrumbs('/servicios/nuevo-servicio/', navbar, titles).map((c) => c.label)).toEqual(['Inicio', 'Servicios', 'Nuevo servicio'])
  })
})
