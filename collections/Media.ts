import type { CollectionConfig } from 'payload'
import { publicReadAdminWrite } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
    admin: {
        group: 'Medios',
        description: 'Imágenes del sitio. Sube aquí las fotos y logos y descríbelas en el texto alternativo.',
        components: {
            beforeList: ['/components/admin/MediaListHelp'],
        }
    },
  labels: {
    singular: 'Imagen',
    plural: 'Galeria de Imagenes'
  },
  access: publicReadAdminWrite,
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
}
