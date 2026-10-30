import type { Block } from 'payload'

export const FeaturesBlock: Block = {
    slug: 'features_block',
    labels: { singular: 'Caracteristicas', plural: 'Caracteristicas' },
    fields: [
        {
            name: 'features_relation',
            label: 'Características a mostrar',
            type: 'relationship',
            relationTo: 'features',
            hasMany: true,
        },
    ],
}
