import { BASE_PATH } from '@/lib/auth/redirects'

// next/image no antepone el basePath a las rutas de public/, así que la imagen de respaldo lo lleva puesto
export const HERO_FALLBACK_IMAGE = `${BASE_PATH}/images/app/campus.jpg`
