// seeds/faq.seed.ts
import { lexicalFromText } from '@/lib/rich-text'
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'
import { upsertDoc } from './lib/upsert'

const payload = await getPayload({ config })

const SAMPLE_TOPICS = ['Préstamos y renovaciones', 'Acceso y cuenta', 'Recursos electrónicos', 'Adquisiciones y sugerencias']

const topics = [
  {
    title: 'Acceso y carné universitario',
    faqs: [
      ['¿Quién puede utilizar los servicios de la biblioteca?', 'Todos los miembros de la comunidad universitaria de la UNAM (estudiantes matriculados, PDI y PAS) tienen acceso automático a los servicios presenciales y digitales acreditándose con su carné universitario o credencial digital.'],
      ['¿Cómo puedo acceder a los recursos electrónicos desde fuera del campus?', 'Puedes acceder a través de tu cuenta institucional en el portal de la biblioteca o mediante el acceso al Catálogo y Recursos electrónicos, introduciendo tus credenciales de la universidad cuando el sistema lo requiera.'],
    ],
  },
  {
    title: 'Préstamos, renovaciones y reservas',
    faqs: [
      ['¿Cómo puedo renovar mis libros prestados?', 'Puedes renovar tus préstamos accediendo a la sección "Mi Cuenta" en la web de la biblioteca o a través del catálogo online antes de que expire la fecha de devolución, siempre y cuando el ejemplar no haya sido reservado por otro usuario.'],
      ['¿Qué hago si el libro que necesito ya está prestado?', 'Puedes realizar una reserva a través del catálogo online (biblioteca-unam.absys.cloud/opac). En cuanto el ejemplar sea devuelto y esté disponible, el sistema te lo notificará.'],
      ['¿Puedo proponer la compra de un libro que no está en la biblioteca (Desiderata)?', 'Sí. Si eres estudiante o profesor y consideras que falta un manual o bibliografía esencial para tu docencia o estudio, puedes proponer su adquisición enviando un correo a biblioteca@atlanticomedio.es.'],
    ],
  },
  {
    title: 'Instalaciones, horarios y espacios',
    faqs: [
      ['¿Cuáles son los horarios de apertura y de préstamo?', 'Horario general de apertura: lunes a viernes de 08:00 a 19:30 h.\nHorario de servicio de préstamo: lunes a viernes de 10:30 a 19:30 h.'],
      ['¿Dónde se encuentra ubicada exactamente la biblioteca?', 'Estamos situados en la Carretera de Quílmes, 37 (35017 Tafira Baja, Las Palmas de Gran Canaria).'],
      ['¿Hay espacios habilitados para el trabajo en grupo?', 'Sí, disponemos de espacios de estudio y salas de trabajo en grupo equipadas. Puedes consultar las condiciones específicas de reserva y uso en el apartado de normativa o directamente con el personal.'],
    ],
  },
  {
    title: 'Investigación y apoyo académico',
    faqs: [
      ['¿Cómo me puede ayudar la biblioteca en mi Trabajo de Fin de Grado (TFG) o Tesis?', 'Ofrecemos apoyo especializado en la búsqueda bibliográfica avanzada, gestión de referencias bibliográficas, uso del Repositorio Institucional y asesoramiento sobre pautas de publicación y citación ética.'],
      ['¿Dónde debo depositar mi TFG o Tesis una vez defendido?', 'Los trabajos se depositan a través del Repositorio Institucional de la UNAM siguiendo las directrices y plantillas oficiales facilitadas por la universidad y la propia biblioteca.'],
    ],
  },
  {
    title: 'Contacto y ayuda',
    faqs: [
      ['¿Cómo puedo contactar con el personal si tengo una duda urgente?', 'Teléfono: +34 828 019 019\nCorreo electrónico: biblioteca@atlanticomedio.es\nPresencialmente: en el mostrador de préstamo durante nuestro horario de atención.'],
    ],
  },
] as const

try {
  const heroImage = await findOrCreateMedia(payload, { file: 'campus.jpg', alt: 'Preguntas frecuentes' })
  const heroDoc = await upsertDoc(payload, {
    collection: 'hero',
    data: {
      background_image: heroImage.id,
      title: 'Preguntas frecuentes',
      subtitle: lexicalFromText('Respuestas rápidas sobre acceso, préstamos, instalaciones, investigación y contacto.'),
    },
  })

  const faqDocs: any[] = []
  for (const topic of topics) {
    faqDocs.push(
      await upsertDoc(payload, {
        collection: 'faq',
        data: {
          title: topic.title,
          faqs: topic.faqs.map(([question, answer]) => ({ question, answer: lexicalFromText(answer) })),
        },
      }),
    )
  }

  // Los temas de ejemplo de la primera versión dejan de usarse
  await payload.delete({ collection: 'faq', where: { title: { in: SAMPLE_TOPICS } } })

  const data = {
    title: 'Preguntas frecuentes',
    slug: 'preguntas-frecuentes',
    meta_description: 'Respuestas a las dudas más habituales sobre acceso, préstamos, instalaciones, investigación y contacto de la Biblioteca.',
    hero_variant: 'simple',
    hero: heroDoc.id,
    layout: faqDocs.map((doc, i) => ({ blockType: 'faq_section_block', faq: doc.id, show_search: i === 0, open_first: false })),
    _status: 'published',
  } as any

  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: data.slug } }, limit: 1, depth: 0 })
  if (existing.docs[0]) await payload.update({ collection: 'pages', id: existing.docs[0].id, data, draft: false })
  else await payload.create({ collection: 'pages', data, draft: false })
} catch (err: any) {
  console.error('Error en seed faq: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
