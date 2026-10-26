// seeds/pages.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'
import { upsertDoc } from './lib/upsert'

const payload = await getPayload({ config })

const media = async (alt: string, file: string) => findOrCreateMedia(payload, { file, alt })

try {
  const quienesImg = await media('Quiénes somos', 'quienes_somos.jpg')
  const campusImg = await media('Campus', 'campus.jpg')
  const horariosImg = await media('Horarios, ubicación y contacto', 'campus.jpg')
  const normativaImg = await media('Normativa y condiciones de uso', 'campus.jpg')

  const quienesHero = await upsertDoc(payload, {
    collection: 'hero',
    data: {
      background_image: quienesImg.id,
      title: 'Quiénes somos',
      subtitle:
        'La Biblioteca Universitaria es un servicio de apoyo al aprendizaje, la docencia y la investigación, comprometido con la excelencia académica y el desarrollo integral de nuestra comunidad.',
    },
  })

  const ayudas = await upsertDoc(payload, {
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

  const dirigidos = await upsertDoc(payload, {
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

  const horariosHero = await upsertDoc(payload, {
    collection: 'hero',
    data: {
      background_image: horariosImg.id,
      title: 'Horarios, ubicación y contacto',
      subtitle:
        'Encuentra toda la información necesaria para visitar nuestras instalaciones o ponerte en contacto con el equipo de la Biblioteca Universitaria.',
    },
  })

  const horario = await upsertDoc(payload, {
    collection: 'schedule',
    data: {
      title: 'Horario de atención — Biblioteca',
      schedule: [
        { day: 'Lunes a viernes', hours: '08:00 - 20:00', type: 'regular' },
        { day: 'Sábados', hours: '09:00 - 14:00', type: 'regular' },
        { day: 'Domingos y festivos', hours: 'Cerrado', type: 'closed' },
      ],
    },
  })

  const ayudaCta = await upsertDoc(payload, {
    collection: 'cta',
    data: {
      title: '¿Necesitas ayuda adicional?',
      subtitle: 'Consulta nuestras preguntas frecuentes o solicita una cita con un bibliotecario.',
      button_cta: 'Ver FAQs',
      button_link: '/conocenos/horarios-ubicacion-y-contacto',
    },
  })

  const normativaHero = await upsertDoc(payload, {
    collection: 'hero',
    data: {
      background_image: normativaImg.id,
      title: 'Normativa y condiciones de uso',
      subtitle:
        'La Biblioteca Universitaria proporciona espacios, colecciones y servicios para apoyar el aprendizaje, la docencia y la investigación. El uso responsable de estos recursos garantiza un entorno óptimo para toda la comunidad académica.',
    },
  })

  const quienesSomos = {
    title: 'Quiénes somos',
    hero_variant: 'split',
    hero: quienesHero.id,
    layout: [
          { blockType: 'cards_features_block', title: '¿Cómo podemos ayudarte?', features: ayudas.id, style: 'default' },
          {
            blockType: 'cards_features_block',
            title: 'A quién se dirigen nuestros servicios',
            features: dirigidos.id,
            style: 'muted',
            image: campusImg.id,
          },
    ],
  }

  const horarios = {
    title: 'Horarios, ubicación y contacto',
    hero_variant: 'simple',
    hero: horariosHero.id,
    layout: [
          {
            blockType: 'contact_info_block',
            title: 'Información General',
            building_name: 'Edificio EMU de Usos Múltiples',
            building_subtitle: '🏛 Campus Universitario',
            location_title: 'Ubicación',
            address_line1: 'Edificio EMU de Usos Múltiples',
            address_line2: 'Carretera de Quilmes, 37',
            directions_button_label: 'Cómo llegar',
            contact_title: 'Contacto Directo',
            phone: '+34 828 019 019',
            email: 'biblioteca@atlanticomedio.es',
            contact_button_label: 'Contactar con la Biblioteca',
          },
          { blockType: 'schedule_block', title: 'Horario de atención', schedule: horario.id },
          {
            blockType: 'map_block',
            title: 'Ubicación',
            map_url:
              'https://www.google.com/maps?ll=28.069492,-15.451801&z=16&t=m&hl=es&gl=ES&mapclient=embed&cid=2474455529394761746',
            map_embed_url:
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2562.3405726995734!2d-15.452000045269175!3d28.06915669043545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc409577ccdecaa7%3A0x225708319a137012!2sUniversidad%20del%20Atl%C3%A1ntico%20Medio%20(UNAM)!5e0!3m2!1ses!2ses!4v1784738876377!5m2!1ses!2ses',
          },
          { blockType: 'help_cta_block', cta: ayudaCta.id },
    ],
  }

  const normativa = {
    title: 'Normativa y condiciones de uso',
    hero_variant: 'simple',
    hero: normativaHero.id,
    layout: [
          {
            blockType: 'rules_cards_block',
            cards: [
              {
                icon: 'Users',
                title: 'Personas usuarias',
                description:
                  'Tienen acceso a los servicios de la Biblioteca todos los miembros de la comunidad universitaria (estudiantes, PDI, PTGAS). Otras personas pueden acceder en condiciones específicas según los convenios vigentes, requiriendo acreditación mediante la tarjeta universitaria o documento equivalente.',
              },
              {
                icon: 'FileText',
                title: 'Préstamos y renovaciones',
                badge: 'Próximamente',
                description:
                  'Información detallada sobre plazos, límites de ejemplares y procesos de renovación estará disponible en esta sección en la próxima actualización de la normativa.',
              },
              {
                icon: 'Library',
                title: 'Espacios y recursos',
                points: [
                  { text: 'Mantener un ambiente de estudio silencioso en las salas de lectura generales.' },
                  { text: 'Respetar las normas de uso de las salas de trabajo en grupo (reserva previa necesaria).' },
                  { text: 'No consumir alimentos o bebidas (excepto agua en envases con cierre) en las zonas de estudio.' },
                  { text: 'Hacer un uso adecuado de los equipos informáticos y de reproducción.' },
                ],
              },
              {
                icon: 'Monitor',
                title: 'Recursos electrónicos',
                description:
                  'El acceso a las bases de datos, revistas y libros electrónicos suscritos está sujeto a las licencias de uso firmadas con los proveedores.',
                note_title: 'Restricciones importantes:',
                note_text:
                  'Se prohíbe la descarga masiva de contenidos y el uso de los recursos para fines comerciales o ajenos a las actividades académicas de la institución.',
              },
            ],
          },
          {
            blockType: 'notice_block',
            title: 'Responsabilidad sobre los materiales',
            text: 'Las personas usuarias son responsables de la conservación de los fondos y equipamientos de la Biblioteca. El deterioro, mutilación o pérdida de las obras prestadas obligará a su reposición o, en caso de estar agotadas, al pago de su valor estimado o a la entrega de una obra de similares características.',
          },
          { blockType: 'download_block', button_label: 'Descargar normativa completa (PDF)' },
        ],
  }

  const pages = [
    { slug: 'conocenos/quienes-somos', ...quienesSomos },
    { slug: 'conocenos/horarios-ubicacion-y-contacto', ...horarios },
    { slug: 'conocenos/normativa-y-condiciones-de-uso', ...normativa },
  ]

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
    })
    const data = { ...page, _status: 'published' } as any
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data, draft: false })
    } else {
      await payload.create({ collection: 'pages', data, draft: false })
    }
  }
} catch (err: any) {
  console.log('Error en seed de pages: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
