import type { Block } from 'payload'

export const TimelineBlock: Block = {
    slug: 'timeline_block',
    labels: { singular: 'Linea del tiempo', plural: 'Linea del tiempo' },
    fields: [
        {
            name: 'timeline_relation',
            type: 'relationship',
            relationTo: 'timeline',
            hasMany: true,
        },
    ],
}
