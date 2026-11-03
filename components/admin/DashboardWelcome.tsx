import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { getTranslation } from '@payloadcms/translations'
import { Banner, Button, Card, Gutter, Pill } from '@payloadcms/ui'

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

const resumenSlugs = [
  { slug: 'pages', label: 'Páginas' },
  { slug: 'media', label: 'Imágenes' },
  { slug: 'news', label: 'Noticias' },
  { slug: 'faq', label: 'Listados de FAQ' },
  { slug: 'loginCampus_service', label: 'Lectores del campus' },
] as const

type Entity = {
  type: 'collections' | 'globals'
  slug: string
  label: string
  description?: string
  canRead: boolean
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
      canRead: true,
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

  const resumen = await Promise.all(
    resumenSlugs
      .filter(({ slug }) => canRead('collections', slug))
      .map(async ({ slug, label }) => ({
        slug,
        label,
        total: await count(slug),
        extra:
          slug === 'pages'
            ? `${(await count('pages', { _status: { equals: 'draft' } })) ?? 0} borradores`
            : undefined,
      })),
  )

  const recientes = canRead('collections', 'pages')
    ? await payload
        .find({ collection: 'pages', sort: '-updatedAt', limit: 5, depth: 0, pagination: false, user: user as never, overrideAccess: false })
        .then((r) => r.docs.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt, status: (d as any)._status as string | undefined })))
        .catch(() => [])
    : []

  const isAdmin = (user as any)?.role === 'admin'
  const paginas = accesos.filter((a) => canRead(a.type, a.slug))

  return (
    <Gutter className="unam-welcome">
      <h2 className="unam-welcome__title">Bienvenido al panel de la Biblioteca</h2>
      <p className="unam-welcome__text">Aquí tienes todo lo que puedes ver y editar. Los cambios se publican al pulsar Guardar.</p>

      <Banner type="info">
        ¿Primera vez aquí? Empieza por una página de la lista, edita el texto o la imagen y pulsa Guardar.
      </Banner>

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
        {isAdmin && canRead('collections', 'exports') && (
          <Button el="link" to="/admin/collections/exports/create" buttonStyle="secondary" size="medium">
            Exportar contenido
          </Button>
        )}
        {isAdmin && canRead('collections', 'imports') && (
          <Button el="link" to="/admin/collections/imports/create" buttonStyle="secondary" size="medium">
            Importar contenido
          </Button>
        )}
      </div>

      {resumen.length > 0 && (
        <>
          <h3 className="unam-welcome__subtitle">Resumen de contenido</h3>
          <ul className="unam-welcome__summary">
            {resumen.map((r) => (
              <li key={r.slug} className="unam-welcome__summary-item">
                <Link href={`/admin/collections/${r.slug}`} className="unam-welcome__stat">
                  <span className="unam-welcome__stat-number">{r.total ?? '–'}</span>
                  <span className="unam-welcome__label">{r.label}</span>
                  {r.extra && <span className="unam-welcome__desc">{r.extra}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {paginas.length > 0 && (
        <>
          <h3 className="unam-welcome__subtitle">Páginas de la web</h3>
          <ul className="unam-welcome__grid">
            {paginas.map((a) => (
              <li key={a.href}>
                <Card title={a.label} titleAs="h4" href={a.href} buttonAriaLabel={`Editar ${a.label}: ${a.description}`} />
                <span className="unam-welcome__desc">{a.description}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {recientes.length > 0 && (
        <>
          <h3 className="unam-welcome__subtitle">Últimas páginas editadas</h3>
          <ul className="unam-welcome__summary">
            {recientes.map((p) => (
              <li key={p.id} className="unam-welcome__summary-item">
                <Link className="unam-welcome__label" href={`/admin/collections/pages/${p.id}`}>
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

      {groups.length > 0 && <h3 className="unam-welcome__subtitle">Todo el contenido</h3>}
      {groups.map((g) => (
        <section key={g.label} className="unam-welcome__group">
          <h4 className="unam-welcome__group-title">{g.label}</h4>
          <ul className="unam-welcome__list">
            {g.entities.map((e) => (
              <li key={`${e.type}-${e.slug}`} className="unam-welcome__row">
                <Link href={`/admin/${e.type}/${e.slug}`} className="unam-welcome__row-main">
                  <span className="unam-welcome__label">{e.label}</span>
                  {e.description && <span className="unam-welcome__desc">{e.description}</span>}
                </Link>
                {e.count !== null && (
                  <Pill pillStyle="light-gray" size="small">
                    {e.count}
                  </Pill>
                )}
                {e.type === 'globals' && (
                  <Pill pillStyle="light" size="small">
                    Página única
                  </Pill>
                )}
                {e.canCreate && (
                  <Link href={`/admin/collections/${e.slug}/create`} className="unam-welcome__add" aria-label={`Crear en ${e.label}`}>
                    + Crear
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Gutter>
  )
}
