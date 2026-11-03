import { getPayload } from 'payload'
import config from '@payload-config'

type Source = { global: 'home' | 'repository'; slug: string; title: string; carousel: boolean }

const SOURCES: Source[] = [
  { global: 'home', slug: 'inicio', title: 'Inicio', carousel: true },
  { global: 'repository', slug: 'repositorios', title: 'Repositorios', carousel: false },
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
    const hasContent = Boolean(global.hero) || Boolean(global.hero_carrusel) || (global.layout ?? []).length > 0
    if (!hasContent) {
      console.log(`${source.slug}: el global "${source.global}" está vacío, no hay nada que copiar (ejecuta antes npm run seed)`)
      continue
    }

    if (source.carousel && global.hero_carrusel) {
      const carousel: any = await payload.findByID({ collection: 'hero_carrusel', id: idOf(global.hero_carrusel), depth: 0 })
      layout.push({ blockType: 'hero_carousel_inline_block', ...clean(carousel) })
    }

    for (const block of global.layout ?? []) {
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
      hero_variant: 'banner',
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
