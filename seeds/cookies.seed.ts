// seeds/cookies.seed.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { DEFAULT_COOKIE_TEXTS } from '@/lib/cookie-texts'

const payload = await getPayload({ config })

try {
  const existing = (await payload.findGlobal({ slug: 'cookies', depth: 0 })) as { createdAt?: string }

  // Si ya se guardó desde el admin no se pisan los textos editados, salvo con SEED_COOKIES_RESET=1
  if (existing.createdAt && process.env.SEED_COOKIES_RESET !== '1') {
    console.log('cookies: ya hay textos guardados, no se tocan (SEED_COOKIES_RESET=1 para restablecerlos)')
  } else {
    await payload.updateGlobal({
      slug: 'cookies',
      data: DEFAULT_COOKIE_TEXTS,
      depth: 0,
    })
    console.log('cookies: textos por defecto sembrados')
  }
} catch (err: any) {
  console.error('Error en seed cookies: ', JSON.stringify(err.data?.errors ?? err, null, 2))
}

process.exit(0)
