import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import { Banner, Button, Card, Gutter } from '@payloadcms/ui'

const accesos = [
  { label: 'Inicio', description: 'Portada, noticias y bloques', href: '/admin/globals/home' },
  { label: 'Servicios', description: 'Servicios de la biblioteca', href: '/admin/globals/services' },
  { label: 'Formación', description: 'Guías y actividades', href: '/admin/globals/formation' },
  { label: 'Investigación', description: 'Apoyo a la investigación', href: '/admin/globals/investigation' },
  { label: 'Páginas', description: 'Quiénes somos, horarios, normativa y más', href: '/admin/collections/pages' },
  { label: 'Recursos electrónicos', description: 'Accesos destacados', href: '/admin/globals/electronic_resources' },
  { label: 'Plantilla', description: 'Encabezamiento, pie de página y enlaces externos', href: '/admin/globals/layout' },
]

async function ultimasPaginas(args: Pick<AdminViewServerProps, 'payload'> & { user?: unknown }) {
  try {
    const res = await args.payload.find({
      collection: 'pages',
      sort: '-updatedAt',
      limit: 5,
      depth: 0,
      pagination: false,
      user: args.user as never,
      overrideAccess: false,
    })
    return res.docs.map((d) => ({ id: d.id, title: d.title, updatedAt: d.updatedAt }))
  } catch {
    return []
  }
}

const formatoFecha = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

export default async function DashboardWelcome({ payload, user }: AdminViewServerProps) {
  const recientes = payload ? await ultimasPaginas({ payload, user }) : []

  return (
    <Gutter className="unam-welcome">
      <h2 className="unam-welcome__title">Bienvenido al panel de la Biblioteca</h2>
      <p className="unam-welcome__text">
        Elige la página que quieres editar. Los cambios se publican al pulsar Guardar.
      </p>

      <Banner type="info">
        ¿Primera vez aquí? Empieza por una página de la lista, edita el texto o la imagen y pulsa Guardar.
      </Banner>

      <div className="unam-welcome__actions">
        <Button el="link" to="/admin/collections/media/create" buttonStyle="primary" size="medium">
          Subir imagen
        </Button>
        <Button el="anchor" url="/biblioteca" newTab buttonStyle="secondary" size="medium">
          Ver la web
        </Button>
      </div>

      <h3 className="unam-welcome__subtitle">Páginas de la web</h3>
      <ul className="unam-welcome__grid">
        {accesos.map((a) => (
          <li key={a.href}>
            <Card title={a.label} titleAs="h4" href={a.href} buttonAriaLabel={`Editar ${a.label}: ${a.description}`} />
            <span className="unam-welcome__desc">{a.description}</span>
          </li>
        ))}
      </ul>

      {recientes.length > 0 ? (
        <>
          <h3 className="unam-welcome__subtitle">Últimas páginas editadas</h3>
          <ul className="unam-welcome__summary">
            {recientes.map((p) => (
              <li key={p.id} className="unam-welcome__summary-item">
                <Link className="unam-welcome__label" href={`/admin/collections/pages/${p.id}`}>
                  {p.title}
                </Link>
                <span className="unam-welcome__desc">{formatoFecha.format(new Date(p.updatedAt))}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Gutter>
  )
}
