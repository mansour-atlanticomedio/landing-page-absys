import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { getTranslation } from '@payloadcms/translations'
import { Button, Gutter } from '@payloadcms/ui'

const accesos = [
  { label: 'Inicio', description: 'Portada, noticias y bloques', href: '/admin/globals/home', slug: 'home', type: 'globals' },
  { label: 'Servicios', description: 'Servicios de la biblioteca', href: '/admin/globals/services', slug: 'services', type: 'globals' },
  { label: 'Formación', description: 'Guías y actividades', href: '/admin/globals/formation', slug: 'formation', type: 'globals' },
  { label: 'Investigación', description: 'Apoyo a la investigación', href: '/admin/globals/investigation', slug: 'investigation', type: 'globals' },
  { label: 'Páginas', description: 'Quiénes somos, horarios, FAQ y más', href: '/admin/collections/pages', slug: 'pages', type: 'collections' },
  { label: 'Recursos electrónicos', description: 'Accesos destacados y categorías', href: '/admin/globals/electronic_resources', slug: 'electronic_resources', type: 'globals' },
  { label: 'Plantilla', description: 'Encabezamiento, pie de página y enlaces externos', href: '/admin/globals/layout', slug: 'layout', type: 'globals' },
  { label: 'Textos de cookies', description: 'Aviso de cookies y preferencias', href: '/admin/globals/cookies', slug: 'cookies', type: 'globals' },
] as const

type Entity = {
  type: 'collections' | 'globals'
  slug: string
  label: string
  description?: string
  canCreate: boolean
  count: number | null
}

type Group = { label: string; entities: Entity[] }

const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export default async function DashboardWelcome({ payload, user, i18n, initPageResult }: AdminViewServerProps) {
  const permissions = initPageResult?.permissions
  const visible = initPageResult?.visibleEntities
  const t = (value: unknown, fallback = '') => {
    if (typeof value === 'function') return String((value as (a: unknown) => unknown)({ i18n, t: i18n.t }))
    return value ? getTranslation(value as never, i18n) : fallback
  }

  const count = async (collection: string, where?: Record<string, unknown>) => {
    try {
      const res = await payload.count({ collection: collection as never, where: where as never, user: user as never, overrideAccess: false })
      return res.totalDocs
    } catch {
      return null
    }
  }

  const rawEntities = [
    ...payload.config.collections.map((c) => ({ type: 'collections' as const, config: c as any })),
    ...payload.config.globals.map((g) => ({ type: 'globals' as const, config: g as any })),
  ].filter(({ type, config }) => {
    if (config.admin?.group === false) return false
    if (!(visible as any)?.[type]?.includes(config.slug)) return false
    return Boolean(permissions?.[type]?.[config.slug]?.read)
  })

  const entities: (Entity & { group: string })[] = await Promise.all(
    rawEntities.map(async ({ type, config }) => ({
      type,
      slug: config.slug as string,
      group: t(config.admin?.group, 'Otros'),
      label: type === 'collections' ? t(config.labels?.plural, config.slug) : t(config.label, config.slug),
      description: typeof config.admin?.description === 'string' ? config.admin.description : undefined,
      canCreate: type === 'collections' && Boolean((permissions?.collections as any)?.[config.slug]?.create),
      count: type === 'collections' ? await count(config.slug) : null,
    })),
  )

  const groups: Group[] = []
  for (const { group, ...entity } of entities) {
    const found = groups.find((g) => g.label === group)
    if (found) found.entities.push(entity)
    else groups.push({ label: group, entities: [entity] })
  }

  const canRead = (type: 'collections' | 'globals', slug: string) => Boolean((permissions as any)?.[type]?.[slug]?.read) && (visible as any)?.[type]?.includes(slug)
  const canCreate = (slug: string) => Boolean((permissions?.collections as any)?.[slug]?.create)

  const recientes = canRead('collections', 'pages')
    ? await payload
        .find({ collection: 'pages', sort: '-updatedAt', limit: 5, depth: 0, pagination: false, user: user as never, overrideAccess: false })
        .then((r) => r.docs.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt, status: (d as any)._status as string | undefined })))
        .catch(() => [])
    : []

  const adminGroups = ['Usuarios', 'Sistema', 'Piezas antiguas', 'Servicios internos']
  const paginas = accesos.filter((a) => canRead(a.type, a.slug))
  const mainGroups = groups.filter((g) => g.label !== 'Páginas' && !adminGroups.includes(g.label))
  const advancedGroups = groups.filter((g) => adminGroups.includes(g.label))

  const chips = (g: Group) => (
    <div key={g.label} className="unam-dash__row">
      <span className="unam-dash__row-title">{g.label}</span>
      <div className="unam-dash__chips">
        {g.entities.map((e) => (
          <Link key={`${e.type}-${e.slug}`} href={`/admin/${e.type}/${e.slug}`} className="unam-dash__chip" title={e.description}>
            {e.label}
            {e.count !== null && <span className="unam-dash__count">{e.count}</span>}
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <Gutter className="unam-welcome unam-dash">
      <h2 className="unam-welcome__title">Bienvenido al panel de la Biblioteca</h2>
      <p className="unam-welcome__text">Elige qué quieres editar. Los cambios se publican al pulsar Guardar.</p>

      <div className="unam-welcome__actions">
        {canCreate('media') && (
          <Button el="link" to="/admin/collections/media/create" buttonStyle="primary" size="medium">
            Subir imagen
          </Button>
        )}
        {canCreate('pages') && (
          <Button el="link" to="/admin/collections/pages/create" buttonStyle="secondary" size="medium">
            Nueva página
          </Button>
        )}
        <Button el="anchor" url="/biblioteca" newTab buttonStyle="secondary" size="medium">
          Ver la web
        </Button>
      </div>

      {paginas.length > 0 && (
        <>
          <h3 className="unam-dash__heading">Páginas</h3>
          <ul className="unam-dash__cards">
            {paginas.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="unam-dash__card" aria-label={`Editar ${a.label}: ${a.description}`}>
                  <span className="unam-welcome__label">{a.label}</span>
                  <span className="unam-welcome__desc">{a.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {mainGroups.length > 0 && (
        <div className="unam-dash__rows">{mainGroups.map(chips)}</div>
      )}

      {recientes.length > 0 && (
        <>
          <h3 className="unam-dash__heading">Editado recientemente</h3>
          <ul className="unam-dash__recent">
            {recientes.slice(0, 3).map((p) => (
              <li key={p.id}>
                <Link href={`/admin/collections/pages/${p.id}`} className="unam-welcome__label">
                  {p.title}
                </Link>
                <span className="unam-welcome__desc">
                  {formatoFecha.format(new Date(p.updatedAt))}
                  {p.status === 'draft' ? ' · borrador' : ''}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {(user as any)?.role === 'admin' && advancedGroups.length > 0 && (
        <details className="unam-dash__advanced">
          <summary>Administración</summary>
          {advancedGroups.map(chips)}
        </details>
      )}
    </Gutter>
  )
}
