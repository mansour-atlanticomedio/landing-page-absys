import type { CollectionConfig } from 'payload'
import { publicReadAdminWrite } from '@/lib/access'
import { blockDeleteIfMediaInUse } from '@/lib/media-usage'

export const Media: CollectionConfig = {
  slug: 'media',
    admin: {
        group: 'Medios',
        description: 'Imágenes y documentos PDF del sitio. Sube aquí las fotos, logos y PDFs y descríbelos en el texto alternativo.',
        components: {
            beforeList: ['/components/admin/MediaListHelp'],
        }
    },
  labels: {
    singular: 'Imagen',
    plural: 'Galeria de Imagenes'
  },
  access: publicReadAdminWrite,
  hooks: {
    beforeDelete: [blockDeleteIfMediaInUse],
  },
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
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
  },
}
