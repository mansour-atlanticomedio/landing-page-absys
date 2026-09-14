// seeds/quienesSomos.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const heroImage = await payload.create({
  collection: 'media',
  data: { alt: 'Quiénes somos' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/quienes_somos.jpg'),
})

const dirigidosImage = await payload.create({
  collection: 'media',
  data: { alt: 'A quién se dirigen nuestros servicios' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const heroDoc = await payload.create({
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Quiénes somos',
    subtitle:
      'La Biblioteca Universitaria es un servicio de apoyo al aprendizaje, la docencia y la investigación, comprometido con la excelencia académica y el desarrollo integral de nuestra comunidad.',
  },
})

const ayudasDoc = await payload.create({
  collection: 'features',
  data: {
    title: '¿Cómo podemos ayudarte?',
    feature: [
      {
        icon: 'BookOpen',
        title: 'Apoyo al aprendizaje',
        description:
          'Proporcionamos espacios de estudio, recursos bibliográficos actualizados y asesoramiento personalizado para asegurar el éxito en tu trayectoria académica.',
      },
      {
        icon: 'User',
        title: 'Apoyo a la docencia',
        description:
          'Colaboramos con el profesorado en la creación de materiales, gestión de bibliografía recomendada y herramientas para la innovación educativa.',
      },
      {
        icon: 'Microscope',
        title: 'Apoyo a la investigación',
        description:
          'Ofrecemos servicios especializados en publicación científica, gestión de datos, métricas y acceso a bases de datos de alto impacto.',
      },
    ],
  },
})

const dirigidosDoc = await payload.create({
  collection: 'features',
  data: {
    title: 'A quién se dirigen nuestros servicios',
    feature: [
      {
        icon: 'BookOpen',
        title: 'Estudiantes',
        description:
          'Acceso a manuales, salas de trabajo en grupo, portátiles de préstamo y cursos de competencias informacionales.',
      },
      {
        icon: 'Briefcase',
        title: 'PDI (Personal Docente e Investigador)',
        description:
          'Asesoría en acreditaciones, repositorios institucionales, gestión de referencias y adquisición de recursos especializados.',
      },
      {
        icon: 'User',
        title: 'PAS (Personal de Administración y Servicios)',
        description:
          'Servicios de préstamo general, acceso a colecciones de ocio y recursos para el desarrollo profesional continuo.',
      },
    ],
  },
})

try {
  await payload.updateGlobal({
    slug: 'quienes_somos',
    data: {
      hero: heroDoc.id,
      imagen_dirigidos: dirigidosImage.id,
      ayudas: ayudasDoc.id,
      dirigidos: dirigidosDoc.id,
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal quienes_somos: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
