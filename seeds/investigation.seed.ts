// seeds/investigation.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const heroImage = await payload.create({
  collection: 'media',
  data: { alt: 'Apoyo a la investigación' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const heroDoc = await payload.create({
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Apoyo a la investigación',
    subtitle:
      'La Biblioteca reúne recursos y orientaciones para facilitar la búsqueda de información científica, la publicación y difusión de resultados, el acceso abierto y la gestión de la identidad investigadora. Este espacio se ampliará progresivamente con guías, documentos y enlaces adaptados a las necesidades del personal docente e investigador de la Universidad.',
  },
})

const accesosRapidosDoc = await payload.create({
  collection: 'features',
  data: {
    title: 'Accesos rápidos',
    feature: [
      { icon: 'Search', title: 'Buscar información' },
      { icon: 'Megaphone', title: 'Publicar y difundir' },
      { icon: 'Lock', title: 'Acceso abierto' },
      { icon: 'Fingerprint', title: 'Perfiles académicos' },
      { icon: 'BarChart3', title: 'Indicadores' },
    ],
  },
})

const tarjetasDoc = await payload.create({
  collection: 'electronic_resources_access',
  data: {
    title: 'Investigación: tarjetas de contenido',
    accesos: [
      {
        icon: 'Search',
        title: 'Buscar información científica',
        description:
          'Accede a recursos para localizar publicaciones, revisar antecedentes y desarrollar búsquedas bibliográficas de forma sistemática.',
        cta: 'Acceder a Recursos electrónicos',
        link: '/recursos/recursos-electronicos',
      },
      {
        icon: 'Megaphone',
        title: 'Publicar y difundir',
        description:
          'Consulta orientaciones para seleccionar revistas, revisar sus características, conocer sus condiciones de publicación y mejorar la difusión de los resultados.',
      },
      {
        icon: 'Lock',
        title: 'Acceso abierto y repositorio',
        description:
          'Encuentra información sobre repositorios, versiones de los documentos, licencias, derechos de autor y posibilidades de difusión en acceso abierto.',
        cta: 'Acceder al Repositorio institucional',
        link: 'http://172.23.2.44:4000/dspace',
      },
      {
        icon: 'Fingerprint',
        title: 'Firma, ORCID y perfiles académicos',
        description:
          'Consulta recomendaciones para utilizar una firma coherente, indicar correctamente la afiliación institucional y mantener actualizados los identificadores y perfiles académicos.',
      },
      {
        icon: 'BarChart3',
        title: 'Indicadores y evaluación de la investigación',
        description:
          'Accede a fuentes de información relacionadas con citación, impacto, acreditaciones y sexenios. La Biblioteca ofrece orientación sobre los recursos disponibles, pero no interpreta convocatorias ni garantiza resultados en los procesos de evaluación.',
      },
    ],
  },
})

const ctaDoc = await payload.create({
  collection: 'cta',
  data: {
    title: 'Solicitar apoyo',
    subtitle:
      'Puedes contactar con la Biblioteca para realizar consultas sobre búsqueda bibliográfica, acceso a bases de datos y utilización de los recursos disponibles.',
    button_cta: 'Solicitar apoyo',
    button_link: '/biblioteca/conocenos/horarios-ubicacion-y-contacto',
  },
})

try {
  await payload.updateGlobal({
    slug: 'investigation',
    data: {
      hero: heroDoc.id,
      accesos_rapidos: accesosRapidosDoc.id,
      tarjetas: tarjetasDoc.id,
      cta: ctaDoc.id,
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal investigation: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
