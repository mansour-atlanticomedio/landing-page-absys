import Link from 'next/link'

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

export default function DashboardWelcome() {
  return (
    <section className="unam-welcome">
      <h2 className="unam-welcome__title">Bienvenido al panel de la Biblioteca</h2>
      <p className="unam-welcome__text">
        Elige la página que quieres editar. Los cambios se publican al pulsar Guardar.
      </p>
      <ul className="unam-welcome__grid">
        {accesos.map((a) => (
          <li key={a.href}>
            <Link className="unam-welcome__card" href={a.href}>
              <span className="unam-welcome__label">{a.label}</span>
              <span className="unam-welcome__desc">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
