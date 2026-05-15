import { CollectionConfig } from "payload"

export const Hero : CollectionConfig = {
    slug: 'hero',
    labels: {
        singular: 'Hero',
        plural: 'Hero'
    },
    fields: [
        {
            name: 'background_image',
            label: 'Imagen de fondo',
            type: 'upload',
            relationTo: 'media',
            required: true
        },
        {
            name: 'pretitle',
            label: 'Pretítulo',
            type: 'text',
        },
        {
            name: 'title',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            name: 'subtitle',
            label: 'Subtitulo',
            type: 'text',
        },
        {
            name: 'button_cta',
            label: 'Texto del boton',
            type: 'text'
        }
    ]
}