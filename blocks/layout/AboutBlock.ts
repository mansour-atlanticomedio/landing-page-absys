import type { Block } from 'payload'

export const AboutBlock: Block = {
    slug: 'about_block',
    labels: { singular: 'Sobre Nosotros', plural: 'Sobre Nosotros' },
    fields: [
        {
            name: 'about_relation',
            type: 'relationship',
            relationTo: 'about',
            hasMany: true,
        },
    ],
}
