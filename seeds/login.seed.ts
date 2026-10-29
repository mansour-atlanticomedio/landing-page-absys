// seeds/login.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { findOrCreateMedia } from './lib/media'

const payload = await getPayload({ config })

const image = await findOrCreateMedia(payload, { file: 'campus.jpg', alt: 'Campus de la Universidad Atlántico Medio' })

try {
  const existing = await payload.find({ collection: 'login_page', limit: 1, depth: 0 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'login_page', id: existing.docs[0].id, data: { imageLogin: image.id }, depth: 0 })
  } else {
    await payload.create({ collection: 'login_page', data: { imageLogin: image.id }, depth: 0 })
  }
} catch (err: any) {
  console.log('Error en login_page: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
