import type { Block } from 'payload'

export const ImageTextBlock: Block = {
    slug: 'image_text_block',
    interfaceName: 'ImageTextBlock',
    labels: { singular: 'Imagen con texto', plural: 'Imágenes con texto' },
    fields: [
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
        { name: 'title', label: 'Título', type: 'text' },
        {
            name: 'text',
            label: 'Texto',
            type: 'richText',
            admin: { description: 'Texto con formato (negritas, listas, enlaces...).' },
        },
        {
            name: 'image_position',
            label: 'Posición de la imagen',
            type: 'select',
            defaultValue: 'left',
            options: [
                { label: 'Izquierda', value: 'left' },
                { label: 'Derecha', value: 'right' },
            ],
            admin: {
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'imagePosition',
                            options: [
                                { value: 'left', title: 'Izquierda', description: 'Imagen a la izquierda y texto a la derecha' },
                                { value: 'right', title: 'Derecha', description: 'Texto a la izquierda e imagen a la derecha' },
                            ],
                        },
                    },
                },
            },
        },
    ],
}
