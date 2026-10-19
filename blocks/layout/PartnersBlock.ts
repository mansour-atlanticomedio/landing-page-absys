import type { Block } from 'payload'

export const PartnersBlock: Block = {
    slug: 'partners_block',
    labels: { singular: 'Patrocinador', plural: 'Patrocinadores' },
    fields: [
        {
            name: 'partners_relation',
            type: 'relationship',
            relationTo: 'partners',
            hasMany: true,
        },
    ],
}
