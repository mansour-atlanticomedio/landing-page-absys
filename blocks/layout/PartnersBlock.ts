import type { Block } from 'payload'

export const PartnersBlock: Block = {
    slug: 'partners_block',
    labels: { singular: 'Patrocinador', plural: 'Patrocinadores' },
    fields: [
        {
            name: 'partners_relation',
            label: 'Patrocinadores a mostrar',
            type: 'relationship',
            relationTo: 'partners',
            hasMany: true,
        },
    ],
}
