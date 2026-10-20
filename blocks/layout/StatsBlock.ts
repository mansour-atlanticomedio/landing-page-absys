import type { Block } from 'payload'

export const StatsBlock: Block = {
    slug: 'stats_block',
    labels: { singular: 'Estadística', plural: 'Estadísticas' },
    fields: [
        {
            name: 'stats_relation',
            type: 'relationship',
            relationTo: 'statistics',
            hasMany: true,
        },
    ],
}
