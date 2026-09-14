// seeds/electronicResources.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const heroImage = await payload.create({
  collection: 'media',
  data: { alt: 'Recursos electrónicos' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const heroDoc = await payload.create({
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Recursos Electrónicos',
    subtitle:
      'Acceda a nuestra extensa colección de plataformas digitales, bases de datos especializadas y literatura científica. Un entorno virtual diseñado para impulsar la excelencia académica y facilitar su investigación desde cualquier lugar.',
  },
})

const accesosDoc = await payload.create({
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
        link: '#',
      },
      {
        icon: 'Star',
        title: 'Web of Science',
        description:
          'Base de datos referencial y multidisciplinar que proporciona acceso a información de investigación global, permitiendo análisis de impacto y tendencias científicas.',
        cta: 'Acceder a base de datos',
        link: '#',
      },
      {
        icon: 'Microscope',
        title: 'Scopus',
        description:
          'La mayor base de datos de citas y resúmenes de literatura científica revisada por pares. Herramienta esencial para el seguimiento y evaluación de la investigación académica.',
        cta: 'Acceder a literatura',
        link: '#',
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
