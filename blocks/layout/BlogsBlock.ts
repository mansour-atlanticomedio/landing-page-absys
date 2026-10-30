import type { Block } from 'payload'

export const BlogsBlock: Block = {
    slug: 'blogs_block',
    labels: { singular: 'Blogs', plural: 'Blogs' },
    fields: [
        {
            name: 'blogs_relation',
            label: 'Blogs a mostrar',
            type: 'relationship',
            relationTo: 'blogs',
            hasMany: true,
        },
    ],
}
