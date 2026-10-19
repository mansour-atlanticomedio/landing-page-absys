import type { Block } from 'payload'

export const CtaBlock: Block = {
    slug: 'cta_block',
    labels: { singular: 'CTA', plural: 'CTA' },
    fields: [
        {
            name: 'cta_relation',
            type: 'relationship',
            relationTo: 'cta',
            hasMany: true,
        },
    ],
}
