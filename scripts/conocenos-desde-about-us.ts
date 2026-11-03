import { getPayload } from 'payload'
import config from '@payload-config'

const CONOCENOS_PAGES = [
  { tab: 'quienes_somos', slug: 'conocenos/quienes-somos', title: 'Quiénes somos', hero_variant: 'split' },
  { tab: 'horarios', slug: 'conocenos/horarios-ubicacion-y-contacto', title: 'Horarios, ubicación y contacto', hero_variant: 'simple' },
  { tab: 'normativa', slug: 'conocenos/normativa-y-condiciones-de-uso', title: 'Normativa y condiciones de uso', hero_variant: 'simple' },
] as const

const stripIds = (value: any, key?: string): any => {
  if (key === 'text') return value
  if (Array.isArray(value)) return value.map((item) => stripIds(item))
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === 'id') continue
      out[k] = stripIds(v, k)
    }
    return out
  }
  return value
}

const payload = await getPayload({ config })
const aboutUs: any = await payload.findGlobal({ slug: 'about_us' as any, depth: 0 })

for (const page of CONOCENOS_PAGES) {
  try {
    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, depth: 0, draft: true })
    if (existing.docs.length > 0) {
      console.log(`${page.slug}: ya existe, no se toca`)
      continue
    }
    const source = aboutUs?.[page.tab] ?? {}
    const hero = source.hero && typeof source.hero === 'object' ? source.hero.id : source.hero
    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        hero: hero ?? null,
        hero_variant: page.hero_variant,
        layout: stripIds(source.layout ?? []),
        _status: 'published',
      } as any,
      draft: false,
    })
    console.log(`${page.slug}: creada`)
  } catch (err: any) {
    console.error(`Error con ${page.slug}:`, JSON.stringify(err.data?.errors ?? err, null, 2))
  }
}

process.exit(0)
