// seeds/solicitudCompra.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'

const payload = await getPayload({ config })

try {
  const heroImage = await findOrCreateMedia(payload, { file: 'campus.jpg', alt: 'Solicitud de compra' })

  const heroDoc = await payload.create({
    collection: 'hero',
    data: {
      background_image: heroImage.id,
      pretitle: 'Adquisiciones',
      title: 'Solicitud de compra',
      subtitle:
        'Propón la adquisición de libros u obras que necesites para tu docencia, estudio o investigación',
    },
  })

  await payload.updateGlobal({
    slug: 'solicitud_compra',
    data: {
      hero: heroDoc.id,
    },
  })
} catch (err: any) {
  console.error('Error en seed solicitud_compra: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
