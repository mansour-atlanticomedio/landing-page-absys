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
        cta: 'Acceder a literatura',
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
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal electronic_resources: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
