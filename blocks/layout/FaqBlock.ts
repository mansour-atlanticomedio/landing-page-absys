import type { Block } from 'payload'

export const FaqBlock: Block = {
    slug: 'faq_block',
    labels: { singular: 'FAQ', plural: 'FAQ' },
    fields: [
        {
            name: 'faq_relation',
            label: 'Preguntas frecuentes a mostrar',
            type: 'relationship',
            relationTo: 'faq',
            hasMany: true,
        },
    ],
}
