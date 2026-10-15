import type { AdminViewServerProps } from 'payload'
import { Banner, Button, Card, Gutter, Pill } from '@payloadcms/ui'

const accesos = [
  { label: 'Inicio', description: 'Portada, noticias y bloques', href: '/admin/globals/home' },
  { label: 'Servicios', description: 'Servicios de la biblioteca', href: '/admin/globals/services' },
  { label: 'Formación', description: 'Guías y actividades', href: '/admin/globals/formation' },
  { label: 'Investigación', description: 'Apoyo a la investigación', href: '/admin/globals/investigation' },
  { label: 'Horarios y contacto', description: 'Horario, dirección y mapa', href: '/admin/globals/horarios_contacto' },
  { label: 'Quiénes somos', description: 'Presentación de la biblioteca', href: '/admin/globals/quienes_somos' },
  { label: 'Recursos electrónicos', description: 'Accesos destacados', href: '/admin/globals/electronic_resources' },
  { label: 'Cabecera y pie', description: 'Menú, enlaces y redes', href: '/admin/globals/layout' },
]

const grupos = [
  { label: 'Imágenes', description: 'Fotos y logos subidos', slugs: ['media'] },
  {
    label: 'Bloques de contenido',
    description: 'Noticias, preguntas, ponentes y más',
    slugs: ['speakers', 'statistics', 'about', 'features', 'timeline', 'cta', 'faq', 'news', 'blogs', 'electronic_resources_access', 'schedule', 'partners'],
  },
  { label: 'Cabeceras', description: 'Cabeceras y carruseles', slugs: ['hero', 'hero_carrusel'] },
]

async function contar(payload: AdminViewServerProps['payload'], slug: string) {
  try {
    const res = await payload.count({ collection: slug as never, overrideAccess: true })
    return res.totalDocs
  } catch {
    return 0
  }
}

export default async function DashboardWelcome({ payload }: { payload?: AdminViewServerProps['payload'] }) {
  const resumen = payload
    ? await Promise.all(
        grupos.map(async (g) => {
          const counts = await Promise.all(g.slugs.map((s) => contar(payload, s)))
          return { ...g, total: counts.reduce((a, b) => a + b, 0) }
        }),
      )
    : []

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
        <Button el="link" to="/biblioteca/admin/collections/media/create" buttonStyle="primary" size="medium">
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
            <Card title={a.label} titleAs="h4" href={`/biblioteca${a.href}`} buttonAriaLabel={`Editar ${a.label}: ${a.description}`} />
            <span className="unam-welcome__desc">{a.description}</span>
          </li>
        ))}
      </ul>

      {resumen.length > 0 ? (
        <>
          <h3 className="unam-welcome__subtitle">Resumen de contenido</h3>
          <ul className="unam-welcome__summary">
            {resumen.map((g) => (
              <li key={g.label} className="unam-welcome__summary-item">
                <Pill pillStyle="success" size="small">
                  {g.total}
                </Pill>
                <span className="unam-welcome__label">{g.label}</span>
                <span className="unam-welcome__desc">{g.description}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Gutter>
  )
}
