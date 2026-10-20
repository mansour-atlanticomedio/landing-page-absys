import type { Block } from 'payload'

export const NewsBlock: Block = {
    slug: 'news_block',
    labels: { singular: 'Noticias', plural: 'Noticias' },
    fields: [
        {
            name: 'news_relation',
            type: 'relationship',
            relationTo: 'news',
            hasMany: true,
        },
    ],
}
