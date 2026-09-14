// seeds/formation.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const heroImage = await payload.create({
  collection: 'media',
  data: { alt: 'Formación' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const heroDoc = await payload.create({
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Formación',
    subtitle:
      'La Biblioteca ofrece recursos de apoyo para desarrollar las competencias necesarias para buscar, evaluar, utilizar y comunicar información académica de manera eficaz, crítica y responsable.',
  },
})

const citarCtaDoc = await payload.create({
  collection: 'cta',
  data: {
    title: 'Citar correctamente y evitar el plagio',
    subtitle:
      'Citar permite reconocer las ideas, datos y materiales procedentes de otras fuentes, diferenciar las aportaciones propias y facilitar que otras personas puedan localizar la información original.\nAnota los datos bibliográficos durante la búsqueda, utiliza el estilo de citación requerido y revisa que todas las citas aparezcan recogidas en la lista final de referencias.',
    button_cta: 'Recomendaciones sobre citación y plagio',
    button_link: '#',
  },
})

const guiasTutorialesDoc = await payload.create({
  collection: 'electronic_resources_access',
  data: {
    title: 'Guías y tutoriales',
    accesos: [
      {
        icon: 'BookOpen',
        title: 'Acceder a guías y tutoriales disponibles',
        description: 'Colección de recursos de autoaprendizaje',
        link: '#',
      },
    ],
  },
})

try {
  await payload.updateGlobal({
    slug: 'formation',
    data: {
      hero: heroDoc.id,
      buscar_parrafo_1:
        'Una búsqueda eficaz comienza con la definición clara del tema, la selección de palabras clave y la elección del recurso más adecuado.',
      buscar_parrafo_2:
        'Antes de utilizar una fuente, revisa su autoría, actualidad, procedencia, finalidad y relación con el tema que estás trabajando.',
      enlaces_rapidos: [
        { label: 'Recomendaciones sobre búsqueda y evaluación', link: '#' },
        { label: 'Acceso a Recursos electrónicos', link: '/recursos/recursos-electronicos' },
      ],
      citar_cta: citarCtaDoc.id,
      guias_tutoriales: guiasTutorialesDoc.id,
      actividades_texto:
        'La Biblioteca podrá organizar sesiones y talleres relacionados con el uso del catálogo, las bases de datos, la búsqueda de información y la citación académica.',
      actividades_estado:
        'Actualmente no hay actividades formativas programadas. Las nuevas sesiones se anunciarán en esta página.',
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal formation: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
