import type { Block } from 'payload'

export const FaqBlock: Block = {
    slug: 'faq_block',
    labels: { singular: 'FAQ', plural: 'FAQ' },
    fields: [
        {
            name: 'faq_relation',
            type: 'relationship',
            relationTo: 'faq',
            hasMany: true,
        },
    ],
}
