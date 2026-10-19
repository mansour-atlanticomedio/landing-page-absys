import type { Block } from 'payload'

export const SpeakersBlock: Block = {
    slug: 'speakers_block',
    labels: { singular: 'Ponentes', plural: 'Ponentes' },
    fields: [
        {
            name: 'speakers_relation',
            type: 'relationship',
            relationTo: 'speakers',
            hasMany: true,
        },
    ],
}
