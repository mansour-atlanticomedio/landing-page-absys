// seeds/aboutUs.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import path from 'path'

const payload = await getPayload({ config })

const campus = await payload.create({
  collection: 'media',
  data: { alt: 'Campus' },
  filePath: path.resolve(process.cwd(), 'seeds/assets/campus.jpg'),
})

await payload.updateGlobal({
  slug: 'about_us',
  data: {
    quienes_somos: [
      { images: campus.id },
    ],
    horarios: [
      { images: campus.id },
    ],
    normativa: [
      { images: campus.id },
    ],
  },
})