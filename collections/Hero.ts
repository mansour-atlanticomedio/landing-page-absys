import { CollectionConfig } from "payload"

export const Hero: CollectionConfig = {
    slug: 'hero',
    admin: {
        useAsTitle: 'title'
    },
    access: {
        read: () => true,
    },
    labels: {
        singular: 'Seccion Principal',
        plural: 'Seccion Principal'
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
            label: 'Texto del boton (Opcional)',
            type: 'text'
        },
        {
            name: 'input_placeholder',
            label: 'Texto del input (Opcional)',
            type: 'text'
        },
    ]
}