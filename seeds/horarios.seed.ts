// seeds/horarios.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const heroImage = await payload.create({
  collection: 'media',
  data: { alt: 'Horarios, ubicación y contacto' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

const heroDoc = await payload.create({
  collection: 'hero',
  data: {
    background_image: heroImage.id,
    title: 'Horarios, ubicación y contacto',
    subtitle:
      'Encuentra toda la información necesaria para visitar nuestras instalaciones o ponerte en contacto con el equipo de la Biblioteca Universitaria.',
  },
})

const horarioDoc = await payload.create({
  collection: 'schedule',
  data: {
    title: 'Horario de atención — Biblioteca',
    schedule: [
      { day: 'Lunes a viernes', hours: '08:00 - 20:00', type: 'regular' },
      { day: 'Sábados', hours: '09:00 - 14:00', type: 'regular' },
      { day: 'Domingos y festivos', hours: 'Cerrado', type: 'closed' },
      { day: 'Período de exámenes', hours: '08:00 - 22:00', type: 'extended' },
      { day: 'Vacaciones', hours: '09:00 - 15:00', type: 'holiday' },
    ],
  },
})

const ayudaCtaDoc = await payload.create({
  collection: 'cta',
  data: {
    title: '¿Necesitas ayuda adicional?',
    subtitle: 'Consulta nuestras preguntas frecuentes o solicita una cita con un bibliotecario.',
    button_cta: 'Ver FAQs',
    button_link: '/contacto',
  },
})

try {
  await payload.updateGlobal({
    slug: 'horarios_contacto',
    data: {
      hero: heroDoc.id,
      edificio_nombre: 'Edificio EMU de Usos Múltiples',
      edificio_subtitulo: '🏛 Campus Universitario',
      horario: horarioDoc.id,
      direccion_linea1: 'Edificio EMU de Usos Múltiples',
      direccion_linea2: 'Carretera de Quilmes, 37',
      telefono: '+34 828 019 019',
      email: 'biblioteca@atlanticomedio.es',
      mapa_url:
        'https://www.google.com/maps?ll=28.069492,-15.451801&z=16&t=m&hl=es&gl=ES&mapclient=embed&cid=2474455529394761746',
      mapa_embed_url:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.3405726995734!2d-15.452000045269175!3d28.06915669043545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc409577ccdecaa7%3A0x225708319a137012!2sUniversidad%20del%20Atl%C3%A1ntico%20Medio%20(UNAM)!5e0!3m2!1ses!2ses!4v1784738876377!5m2!1ses!2ses',
      ayuda_cta: ayudaCtaDoc.id,
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal horarios_contacto: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
