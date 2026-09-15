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

try {
  await payload.updateGlobal({
    slug: 'about_us',
    data: {
      horarios: [
        { images: heroImage.id },
      ],
    },
  })
} catch (err: any) {
  console.log('Error en updateGlobal about_us (horarios): ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
