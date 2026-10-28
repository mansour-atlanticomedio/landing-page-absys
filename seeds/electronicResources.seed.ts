// seeds/electronicResources.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'
import { upsertDoc } from './lib/upsert'

const payload = await getPayload({ config })

const heroImage = await findOrCreateMedia(payload, { file: 'campus.jpg', alt: 'Recursos electrónicos' })

const heroDoc = await upsertDoc(payload, {
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Recursos Electrónicos',
    subtitle:
      'Acceda a nuestra extensa colección de plataformas digitales, bases de datos especializadas y literatura científica. Un entorno virtual diseñado para impulsar la excelencia académica y facilitar su investigación desde cualquier lugar.',
  },
})

const accesosDoc = await upsertDoc(payload, {
  collection: 'electronic_resources_access',
  data: {
    title: 'Accesos Directos Destacados',
    accesos: [
      {
        icon: 'BookOpen',
        title: 'eLibro',
        description:
          'Plataforma líder de libros electrónicos en español. Acceso a miles de títulos de múltiples disciplinas académicas para lectura en línea o descarga.',
        cta: 'Acceder a plataforma',
        link: 'https://elibro.net/es/lc/atlanticomedio/inicio',
      },
      {
        icon: 'Star',
        title: 'Web of Science',
        description:
          'Base de datos referencial y multidisciplinar que proporciona acceso a información de investigación global, permitiendo análisis de impacto y tendencias científicas.',
        cta: 'Acceder a base de datos',
        link: 'https://www.recursoscientificos.fecyt.es/',
      },
      {
        icon: 'Microscope',
        title: 'Scopus',
        description:
          'La mayor base de datos de citas y resúmenes de literatura científica revisada por pares. Herramienta esencial para el seguimiento y evaluación de la investigación académica.',
        cta: 'Acceder a base de datos',
        link: 'https://www.scopus.com/pages/home#basic',
      },
    ],
  },
})

try {
  await payload.updateGlobal({
    slug: 'electronic_resources',
    data: {
      hero: heroDoc.id,
      accesos_destacados: accesosDoc.id,
      accesos_titulo: 'Accesos directos destacados',
      acceso_remoto: {
        titulo: 'Identificación y acceso remoto',
        descripcion:
          'Para acceder a los recursos electrónicos desde fuera del campus universitario, es necesario validar sus credenciales institucionales. El sistema le solicitará su usuario y contraseña corporativa.',
        puntos: [
          { texto: 'Utilice su correo electrónico institucional completo.' },
          { texto: 'La conexión a través de VPN no es requerida para la mayoría de las plataformas mediante acceso federado.' },
        ],
        portal_titulo: 'Portal de autenticación',
        portal_descripcion: 'Inicie sesión para habilitar el acceso integral a todos los recursos.',
        portal_boton_texto: 'Iniciar sesión institucional',
        portal_boton_enlace: '/login',
      },
      problema_acceso: {
        texto: 'Comunicar un problema de acceso',
        tipo: 'registro',
        enlace_key: 'soporte_recursos',
      },
      categorias_titulo: 'Recursos por tipo',
      categorias: [
        {
          nombre: 'Bases de datos',
          recursos: [
            { nombre: 'Scopus', descripcion: 'Resúmenes y citas de literatura científica', acceso: 'subscription' },
            { nombre: 'Web of Science', descripcion: 'Plataforma de investigación multidisciplinaria', acceso: 'subscription' },
            { nombre: 'JSTOR', descripcion: 'Colección de revistas académicas', acceso: 'subscription' },
            { nombre: 'SciELO', descripcion: 'Biblioteca científica electrónica', acceso: 'open' },
            { nombre: 'Redalyc', descripcion: 'Red de revistas científicas', acceso: 'open' },
            { nombre: 'DOAJ', descripcion: 'Revistas de acceso abierto', acceso: 'open' },
          ],
        },
        {
          nombre: 'Libros electrónicos',
          recursos: [
            { nombre: 'EBSCO eBooks', descripcion: 'Colección multidisciplinaria de libros digitales', acceso: 'subscription' },
            { nombre: 'SpringerLink', descripcion: 'Libros y capítulos de ciencia y tecnología', acceso: 'subscription' },
            { nombre: 'Project Gutenberg', descripcion: 'Libros de dominio público', acceso: 'open' },
          ],
        },
        {
          nombre: 'Recursos multimedia',
          recursos: [
            { nombre: 'Kanopy', descripcion: 'Streaming de películas y documentales', acceso: 'subscription' },
            { nombre: 'Naxos Music Library', descripcion: 'Música clásica en streaming', acceso: 'subscription' },
          ],
        },
      ],
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal electronic_resources: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
