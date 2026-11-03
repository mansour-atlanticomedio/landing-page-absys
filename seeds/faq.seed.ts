// seeds/faq.seed.ts
import { lexicalFromText } from '@/lib/rich-text'
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'
import { upsertDoc } from './lib/upsert'

const payload = await getPayload({ config })

const topics = [
  {
    title: 'Préstamos y renovaciones',
    faqs: [
      ['¿Cómo sé qué libros tengo prestados?', 'Entra con tu cuenta del campus y consulta el apartado de préstamos: verás cada ejemplar con su fecha de devolución y si se puede renovar.'],
      ['¿Puedo renovar un préstamo?', 'Sí, desde tu cuenta siempre que el ejemplar no esté reservado por otra persona y no haya vencido. Si no puedes renovarlo, escríbenos y lo revisamos.'],
      ['¿Qué pasa si me retraso en la devolución?', 'Devuelve el ejemplar cuanto antes en el mostrador. Las condiciones de las demoras están recogidas en la normativa de la biblioteca.'],
    ],
  },
  {
    title: 'Acceso y cuenta',
    faqs: [
      ['¿Cómo inicio sesión?', 'Con tu usuario del campus. No necesitas crear una cuenta aparte: se genera automáticamente la primera vez que entras.'],
      ['No puedo entrar, ¿qué hago?', 'Comprueba que accedes con tu correo institucional. Si el problema continúa, contacta con nosotros indicando tu nombre y el momento en que ocurrió.'],
    ],
  },
  {
    title: 'Recursos electrónicos',
    faqs: [
      ['¿Puedo consultar los recursos electrónicos desde casa?', 'Sí. Accede con tu usuario del campus desde la página de recursos electrónicos y sigue las instrucciones de acceso remoto.'],
      ['Un recurso no me deja acceder, ¿cómo lo comunico?', 'Usa el botón "Comunicar un problema de acceso" de la página de recursos electrónicos e indica el recurso y el error que ves.'],
    ],
  },
  {
    title: 'Adquisiciones y sugerencias',
    faqs: [
      ['¿Cómo pido que compréis un libro?', 'Rellena el formulario de solicitud de compra con los datos del libro. Puedes proponer varios a la vez y recibirás una confirmación por correo.'],
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
      subtitle: lexicalFromText('Respuestas rápidas sobre préstamos, acceso, recursos electrónicos y adquisiciones.'),
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

  const data = {
    title: 'Preguntas frecuentes',
    slug: 'preguntas-frecuentes',
    meta_description: 'Respuestas a las dudas más habituales sobre préstamos, acceso, recursos electrónicos y adquisiciones de la Biblioteca.',
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
