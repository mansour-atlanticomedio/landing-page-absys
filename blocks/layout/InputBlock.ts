import type { Block } from 'payload'

export const InputBlock: Block = {
    slug: 'input_block',
    labels: { singular: 'Entrada de texto', plural: 'Entrada de texto' },
    fields: [
        {
            name: 'input_relation',
            type: 'relationship',
            relationTo: 'input',
            hasMany: true,
        },
    ],
}
