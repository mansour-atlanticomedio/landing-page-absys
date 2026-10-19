import type { Block } from 'payload'

export const CardsFeaturesBlock: Block = {
    slug: 'cards_features_block',
    interfaceName: 'CardsFeaturesBlock',
    labels: { singular: 'Tarjetas con icono', plural: 'Tarjetas con icono' },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text',
            admin: { description: 'Título visible encima de las tarjetas. Déjalo vacío si no quieres título.' },
        },
        {
            name: 'features',
            label: 'Conjunto de tarjetas',
            type: 'relationship',
            relationTo: 'features',
            hasMany: false,
            admin: { description: 'Elige el conjunto de tarjetas (icono, título y descripción) que se mostrará.' },
        },
        {
            name: 'style',
            label: 'Estilo de fondo',
            type: 'select',
            defaultValue: 'default',
            options: [
                { label: 'Fondo blanco', value: 'default' },
                { label: 'Fondo gris claro', value: 'muted' },
            ],
            admin: {
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'cardsStyle',
                            contentFields: { title: 'title' },
                            options: [
                                { value: 'default', title: 'Fondo blanco', description: 'Tarjetas con borde en rejilla de tres' },
                                { value: 'muted', title: 'Fondo oscuro', description: 'Tarjetas apiladas sobre fondo azul marino' },
                            ],
                        },
                    },
                },
            },
        },
        {
            name: 'image',
            label: 'Imagen lateral (opcional)',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Si la añades, aparece junto a las tarjetas.' },
        },
    ],
}
