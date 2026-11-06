import { getPayload } from 'payload'
import config from '@payload-config'
import { lexicalFromText } from '@/lib/rich-text'
import { resolveEnlaceExterno } from '@/lib/links'
import { findOrCreateMedia } from '../seeds/lib/media'

process.env.PAYLOAD_MIGRATING = 'true'

const QUIENES_SOMOS = `La Biblioteca de la Universidad del Atlántico Medio es un servicio esencial de apoyo al aprendizaje, la docencia y la investigación, orientado a facilitar el acceso a la información, el conocimiento y los recursos académicos necesarios para el desarrollo de la actividad universitaria. Su misión es contribuir a la excelencia académica mediante la gestión eficiente de colecciones, recursos electrónicos y servicios especializados que favorezcan el estudio, la generación de conocimiento y la formación continua de nuestra comunidad.
Para garantizar el adecuado funcionamiento de este servicio, la Biblioteca cuenta con una Coordinación de Biblioteca, responsable de la planificación, organización y desarrollo de sus recursos y servicios, así como con personal auxiliar de apoyo, encargado de la atención a los usuarios y de las tareas técnicas y administrativas necesarias para su correcto funcionamiento. De este modo, la Biblioteca se configura como un espacio dinámico de referencia para la comunidad universitaria, comprometido con la calidad, la innovación y la mejora continua de sus servicios.`

const SERVICIOS_TITULO = 'Servicios de la Biblioteca Universitaria'
const SERVICIOS_INTRO =
  'La Biblioteca de la Universidad del Atlántico Medio pone a disposición de la comunidad académica una cartera integral de servicios orientada a respaldar la excelencia en la docencia, favorecer el aprendizaje autónomo y potenciar la investigación científica e institucional.'
const CONTACTO = '/conocenos/horarios-ubicacion-y-contacto'
const CORREO = 'mailto:biblioteca@atlanticomedio.es'

const servicios = (opac: string) => [
  { icon: 'Search', title: 'Consulta de fondos', text: 'Consulta el catálogo para localizar los libros y recursos disponibles y comprobar su ubicación y disponibilidad.', action_label: 'Ir al catálogo', action_href: '/recursos/catalogo' },
  { icon: 'BookOpen', title: 'Préstamo', text: 'Los miembros autorizados de la comunidad universitaria podrán solicitar en préstamo los materiales disponibles, de acuerdo con las condiciones establecidas por la Biblioteca.', action_label: 'Consultar condiciones y normativas', action_href: '/conocenos/normativa-y-condiciones-de-uso' },
  { icon: 'RefreshCw', title: 'Renovación de fondos', text: 'Los préstamos podrán renovarse siempre que se cumplan las condiciones del servicio y el material no haya sido solicitado por otra persona.', action_label: 'Ir a Mi Cuenta', action_href: '/prestamos' },
  { icon: 'Bookmark', title: 'Reservas', text: 'Mecanismo de solicitud anticipada para obras que se encuentran temporalmente prestadas, garantizando el turno riguroso de entrega a su devolución.', action_label: 'Catálogo General (OPAC)', action_href: opac },
  { icon: 'Headphones', title: 'Atención de consultas', text: 'La Biblioteca puede ayudarte a localizar recursos, utilizar el catálogo, acceder a las plataformas disponibles y resolver dudas relacionadas con sus servicios.', action_label: 'Contactar', action_href: CONTACTO },
  { icon: 'GraduationCap', title: 'Apoyo a la Formación Académica (Grado y Posgrado)', text: 'Asistencia técnica en la localización de fuentes bibliográficas especializadas, orientación metodológica en la gestión de referencias y fomento de las competencias informacionales.' },
  { icon: 'FlaskConical', title: 'Apoyo al Personal Docente e Investigador (PDI)', text: 'Gestión centralizada de la bibliografía recomendada para las guías docentes de las titulaciones, asesoramiento en la difusión de la producción científica y soporte para el depósito en el Repositorio Institucional.' },
  { icon: 'BookPlus', title: 'Sugerencias de Adquisición (Desideratas)', text: 'Canal institucional a disposición de estudiantes y PDI para proponer la incorporación de nuevas monografías u obras de referencia que enriquezcan el fondo bibliográfico de la institución.', action_label: 'Formulario de propuesta', action_href: '/adquisiciones/solicitud-compra' },
  { icon: 'Laptop', title: 'Préstamo de Equipamiento Tecnológico', text: 'Puesta a disposición de equipos informáticos para el desarrollo de actividades académicas dentro de las dependencias de la biblioteca.' },
  { icon: 'Printer', title: 'Servicios de Reprografía e Impresión', text: 'Dotación de soportes para la reproducción de documentos, garantizando en todo momento el estricto cumplimiento de la legislación vigente en materia de Propiedad Intelectual.' },
  { icon: 'Info', title: 'Información y Asistencia Bibliográfica', text: 'Servicio personalizado de orientación presencial y telemática para la resolución de incidencias en el uso de los recursos de información y plataformas virtuales.', action_label: 'Horarios, ubicación y contacto', action_href: CONTACTO },
]

const RECOMENDADOS: [RegExp, string][] = [
  [/^elibro/i, '/recursos/recursos-electronicos'],
  [/^busca informaci/i, '/investigacion'],
  [/^cita correctamente/i, '/formacion'],
]

const payload = await getPayload({ config }).catch((err) => {
  console.error('No se pudo iniciar Payload:', err?.message ?? err)
  console.error('Aplica antes las migraciones (este script nunca modifica el esquema).')
  process.exit(1)
})

const editPage = async (slug: string, edit: (page: any) => Promise<any | null> | any | null) => {
  try {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const page: any = found.docs[0]
    if (!page) return console.log(`${slug}: no existe, se omite (ejecuta antes content:globals-a-paginas)`)
    const data = await edit(page)
    if (!data) return console.log(`${slug}: ya estaba al día`)
    await payload.update({ collection: 'pages', id: page.id, data: { ...data, _status: 'published' }, draft: false })
    console.log(`${slug}: actualizada`)
  } catch (err: any) {
    console.error(`Error en ${slug}:`, JSON.stringify(err.data?.errors ?? err.message ?? err, null, 2))
  }
}

const layoutGlobal: any = await payload.findGlobal({ slug: 'layout', depth: 0 })
const opac = resolveEnlaceExterno(layoutGlobal?.enlaces_externos, 'opac', 'https://biblioteca-unam.absys.cloud/opac')
const dspace = resolveEnlaceExterno(layoutGlobal?.enlaces_externos, 'dspace', '')

await editPage('conocenos/quienes-somos', (page) => {
  if ((page.layout ?? []).some((b: any) => b.blockType === 'rich_text_block')) return null
  return { layout: [{ blockType: 'rich_text_block', content: lexicalFromText(QUIENES_SOMOS) }, ...page.layout] }
})

await editPage('inicio', async (page) => {
  if (page.hero_variant === 'carousel' && page.hero_carousel) return null
  const inline = (page.layout ?? []).find((b: any) => b.blockType === 'hero_carousel_inline_block')
  const home: any = await payload.findGlobal({ slug: 'home' as never, depth: 0 }).catch(() => null)
  let carouselId = home?.hero_carrusel ?? null
  if (!carouselId && inline?.items?.length) {
    const items = inline.items.map(({ id, ...item }: any) => item)
    carouselId = (await payload.create({ collection: 'hero_carrusel', data: { title: 'Carrusel de inicio', items } as any })).id
  }
  if (!carouselId) return null
  return {
    hero_variant: 'carousel',
    hero_carousel: carouselId,
    layout: (page.layout ?? []).filter((b: any) => b.blockType !== 'hero_carousel_inline_block'),
  }
})

await editPage('conocenos/normativa-y-condiciones-de-uso', (page) => {
  let changed = false
  const layout = (page.layout ?? []).map((b: any) => {
    if (b.blockType !== 'rules_cards_block') return b
    return {
      ...b,
      cards: (b.cards ?? []).map((c: any) => {
        if (!/pr[eé]stamos y renovaciones/i.test(c.title ?? '') || !c.badge) return c
        changed = true
        return { ...c, badge: null }
      }),
    }
  })
  return changed ? { layout } : null
})

await editPage('inicio', (page) => {
  let changed = false
  const layout = (page.layout ?? []).map((b: any) => {
    if (b.blockType !== 'news_inline_block') return b
    return {
      ...b,
      newsItems: (b.newsItems ?? []).map((n: any) => {
        const next = { ...n }
        if (/^cat[aá]logo institucional$/i.test(n.title ?? '')) next.title = 'Catálogo'
        if (!n.link && /^repositorio acad/i.test(n.title ?? '') && dspace) next.link = dspace
        const recomendado = RECOMENDADOS.find(([re]) => re.test(n.title ?? ''))
        if (!n.link && recomendado) next.link = recomendado[1]
        if (next.title !== n.title || next.link !== n.link) changed = true
        return next
      }),
    }
  })
  return changed ? { layout } : null
})

await editPage('investigacion', (page) => {
  let changed = false
  const layout = (page.layout ?? []).map((b: any) => {
    if (b.blockType !== 'investigation_content_block' || b.support_button_link === CORREO) return b
    changed = true
    return { ...b, support_button_link: CORREO }
  })
  return changed ? { layout } : null
})

await editPage('servicios', async (page) => {
  const cards = servicios(opac)
  const current = (page.layout ?? []).find((b: any) => b.blockType === 'service_cards_block')
  const heroData = { title: SERVICIOS_TITULO, subtitle: lexicalFromText(SERVICIOS_INTRO) }
  let heroId = page.hero
  if (heroId) {
    await payload.update({ collection: 'hero', id: heroId, data: heroData as any })
  } else {
    const image = await findOrCreateMedia(payload, { file: 'campus.jpg', alt: SERVICIOS_TITULO })
    heroId = (await payload.create({ collection: 'hero', data: { ...heroData, background_image: image.id } as any })).id
  }
  if (current?.cards?.length === cards.length && page.hero) return null
  const others = (page.layout ?? []).filter((b: any) => b.blockType !== 'service_cards_block')
  return {
    hero: heroId,
    layout: [{ ...(current ?? { blockType: 'service_cards_block' }), cards, show_suggestion: false }, ...others],
  }
})

process.exit(0)
