import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ACCESOS_RAPIDOS_FALLBACK,
  CITAR_CTA_FALLBACK,
  CTA_FALLBACK,
  ENLACES_RAPIDOS_FALLBACK,
  FORMACION_ACTIVIDADES_ESTADO_FALLBACK,
  FORMACION_ACTIVIDADES_TEXTO_FALLBACK,
  FORMACION_BUSCAR_1_FALLBACK,
  FORMACION_BUSCAR_2_FALLBACK,
  GUIA_TUTORIAL_FALLBACK,
  SERVICIOS_FALLBACK,
  TARJETAS_FALLBACK,
} from '@/lib/page-fallbacks'

type Source = {
  global: string
  slug: string
  title: string
  variant: 'banner' | 'split' | 'simple'
  carousel?: boolean
  wrappers?: boolean
  build?: (global: any, helpers: { doc: (collection: string, id: any) => Promise<any> }) => Promise<any[]>
}

const SOURCES: Source[] = [
  { global: 'home', slug: 'inicio', title: 'Inicio', variant: 'banner', carousel: true, wrappers: true },
  { global: 'repository', slug: 'repositorios', title: 'Repositorios', variant: 'banner', wrappers: true },
  { global: 'library', slug: 'biblioteca', title: 'Biblioteca', variant: 'banner' },
  { global: 'solicitud_compra', slug: 'adquisiciones/solicitud-compra', title: 'Solicitud de compra', variant: 'banner' },
  {
    global: 'services',
    slug: 'servicios',
    title: 'Servicios',
    variant: 'split',
    build: async () => [{ blockType: 'service_cards_block', cards: SERVICIOS_FALLBACK }],
  },
  {
    global: 'formation',
    slug: 'formacion',
    title: 'Formación',
    variant: 'split',
    build: async (g, { doc }) => {
      const cta: any = g.citar_cta ? await doc('cta', g.citar_cta) : null
      const guide: any = g.guias_tutoriales ? (await doc('electronic_resources_access', g.guias_tutoriales))?.accesos?.[0] : null
      const links = g.enlaces_rapidos?.length ? g.enlaces_rapidos : ENLACES_RAPIDOS_FALLBACK
      return [
        {
          blockType: 'formation_content_block',
          search_paragraph_1: g.buscar_parrafo_1 || FORMACION_BUSCAR_1_FALLBACK,
          search_paragraph_2: g.buscar_parrafo_2 || FORMACION_BUSCAR_2_FALLBACK,
          quick_links: links.map((l: any) => ({ label: l.label, link: l.link })),
          cite_title: cta?.title || CITAR_CTA_FALLBACK.title,
          cite_text: cta?.subtitle || CITAR_CTA_FALLBACK.subtitle,
          cite_button_label: cta?.button_cta || CITAR_CTA_FALLBACK.button_cta,
          cite_button_link: cta?.button_link || CITAR_CTA_FALLBACK.button_link,
          guide_title: guide?.title || GUIA_TUTORIAL_FALLBACK.title,
          guide_description: guide ? guide.description || '' : GUIA_TUTORIAL_FALLBACK.description,
          guide_link: guide ? guide.link || '#' : GUIA_TUTORIAL_FALLBACK.link,
          activities_text: g.actividades_texto || FORMACION_ACTIVIDADES_TEXTO_FALLBACK,
          activities_status: g.actividades_estado || FORMACION_ACTIVIDADES_ESTADO_FALLBACK,
        },
      ]
    },
  },
  {
    global: 'electronic_resources',
    slug: 'recursos/recursos-electronicos',
    title: 'Recursos electrónicos',
    variant: 'split',
    build: async (g, { doc }) => {
      const featured: any = g.accesos_destacados ? await doc('electronic_resources_access', g.accesos_destacados) : null
      const remote = g.acceso_remoto ?? {}
      const problem = g.problema_acceso ?? {}
      return [
        {
          blockType: 'eres_content_block',
          featured_title: g.accesos_titulo,
          featured: (featured?.accesos ?? []).map((a: any) => ({ icon: a.icon, title: a.title, description: a.description, cta: a.cta, link: a.link })),
          remote: {
            title: remote.titulo,
            description: remote.descripcion,
            points: (remote.puntos ?? []).map((p: any) => ({ text: p.texto })),
            portal_title: remote.portal_titulo,
            portal_description: remote.portal_descripcion,
            portal_button_label: remote.portal_boton_texto,
            portal_button_link: remote.portal_boton_enlace,
          },
          problem: {
            text: problem.texto,
            tipo: problem.tipo,
            to: problem.to,
            ancla: problem.ancla,
            enlace_key: problem.enlace_key,
            url: problem.url,
            nueva_pestana: problem.nueva_pestana,
          },
          categories_title: g.categorias_titulo,
          cats: (g.categorias ?? []).map((c: any) => ({
            name: c.nombre,
            items: (c.recursos ?? []).map((r: any) => ({ name: r.nombre, description: r.descripcion, access: r.acceso, link: r.enlace })),
          })),
        },
      ]
    },
  },
  {
    global: 'investigation',
    slug: 'investigacion',
    title: 'Investigación',
    variant: 'split',
    build: async (g, { doc }) => {
      const quick: any = g.accesos_rapidos ? await doc('features', g.accesos_rapidos) : null
      const cards: any = g.tarjetas ? await doc('electronic_resources_access', g.tarjetas) : null
      const cta: any = g.cta ? await doc('cta', g.cta) : null
      const quickItems = quick?.feature?.length ? quick.feature : ACCESOS_RAPIDOS_FALLBACK
      const cardItems = cards?.accesos?.length ? cards.accesos : TARJETAS_FALLBACK
      return [
        {
          blockType: 'investigation_content_block',
          quick: quickItems.map((a: any) => ({ icon: a.icon, title: a.title })),
          cards: cardItems.map((t: any) => ({ icon: t.icon, title: t.title, description: t.description || '', cta: t.cta || '', link: t.link || '' })),
          support_title: cta?.title || CTA_FALLBACK.title,
          support_text: cta?.subtitle || CTA_FALLBACK.subtitle,
          support_button_label: cta?.button_cta || CTA_FALLBACK.button_cta,
          support_button_link: cta?.button_link || CTA_FALLBACK.button_link,
        },
      ]
    },
  },
]

const WRAPPERS: Record<string, { relation: string; collection: string; block: string }> = {
  stats_block: { relation: 'stats_relation', collection: 'statistics', block: 'stats_inline_block' },
  about_block: { relation: 'about_relation', collection: 'about', block: 'about_inline_block' },
  features_block: { relation: 'features_relation', collection: 'features', block: 'features_inline_block' },
  news_block: { relation: 'news_relation', collection: 'news', block: 'news_inline_block' },
  blogs_block: { relation: 'blogs_relation', collection: 'blogs', block: 'blogs_inline_block' },
  timeline_block: { relation: 'timeline_relation', collection: 'timeline', block: 'timeline_inline_block' },
  speakers_block: { relation: 'speakers_relation', collection: 'speakers', block: 'speakers_inline_block' },
  partners_block: { relation: 'partners_relation', collection: 'partners', block: 'partners_inline_block' },
  cta_block: { relation: 'cta_relation', collection: 'cta', block: 'cta_inline_block' },
  faq_block: { relation: 'faq_relation', collection: 'faq', block: 'faq_inline_block' },
  input_block: { relation: 'input_relation', collection: 'input', block: 'input_inline_block' },
}

const idOf = (value: any) => (value && typeof value === 'object' ? value.id : value)

function stripRowIds(value: any, insideArray = false): any {
  if (Array.isArray(value)) return value.map((item) => stripRowIds(item, true))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !(insideArray && key === 'id'))
        .map(([key, v]) => [key, key === 'root' ? v : stripRowIds(v, false)]),
    )
  }
  return value
}

const clean = (doc: Record<string, any>) => {
  const { id, createdAt, updatedAt, ...rest } = doc
  return stripRowIds(rest)
}

const force = process.argv.includes('--force')
const dry = process.argv.includes('--dry')

process.env.PAYLOAD_MIGRATING = 'true'

const payload = await getPayload({ config }).catch((err) => {
  console.error('No se pudo iniciar Payload:', err?.message ?? err)
  console.error('Ejecuta primero `npm run migrate` hasta que termine con "Done." (este script nunca modifica el esquema).')
  process.exit(1)
})

for (const source of SOURCES) {
  try {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: source.slug } }, limit: 1, depth: 0, draft: true })
    if (existing.docs[0] && !force) {
      console.log(`${source.slug}: ya existe, no se toca (usa --force para rehacerla)`)
      continue
    }

    const global: any = await payload.findGlobal({ slug: source.global as never, depth: 0, draft: false })
    const layout: any[] = []
    const hasContent = Boolean(source.build) || Boolean(global.hero) || Boolean(global.hero_carrusel) || (global.layout ?? []).length > 0
    if (!hasContent) {
      console.log(`${source.slug}: el global "${source.global}" está vacío, no hay nada que copiar (ejecuta antes npm run seed)`)
      continue
    }

    const helpers = { doc: (collection: string, id: any) => payload.findByID({ collection: collection as never, id: idOf(id), depth: 0 }) }
    if (source.build) layout.push(...(await source.build(global, helpers)))

    if (source.carousel && global.hero_carrusel) {
      const carousel: any = await payload.findByID({ collection: 'hero_carrusel', id: idOf(global.hero_carrusel), depth: 0 })
      layout.push({ blockType: 'hero_carousel_inline_block', ...clean(carousel) })
    }

    for (const block of source.wrappers ? global.layout ?? [] : []) {
      const wrapper = WRAPPERS[block.blockType]
      if (!wrapper) {
        console.log(`${source.slug}: bloque sin equivalente "${block.blockType}", se omite`)
        continue
      }
      const related = block[wrapper.relation]
      const first = Array.isArray(related) ? related[0] : related
      if (!first) continue
      const doc: any = await payload.findByID({ collection: wrapper.collection as never, id: idOf(first), depth: 0 })
      layout.push({ blockType: wrapper.block, ...clean(doc) })
    }

    const data: any = {
      title: source.title,
      slug: source.slug,
      hero: idOf(global.hero) ?? undefined,
      hero_variant: source.variant,
      layout,
      _status: 'published',
    }

    if (dry) {
      console.log(`${source.slug}: (simulación) ${layout.length} bloques →`, layout.map((b) => b.blockType).join(', '))
      continue
    }

    if (existing.docs[0]) await payload.update({ collection: 'pages', id: existing.docs[0].id, data, draft: false })
    else await payload.create({ collection: 'pages', data, draft: false })
    console.log(`${source.slug}: página creada con ${layout.length} bloques`)
  } catch (err: any) {
    console.error(`Error migrando ${source.global}:`, JSON.stringify(err.data?.errors ?? err, null, 2))
  }
}

process.exit(0)
