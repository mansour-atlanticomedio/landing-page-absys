import type { Block } from 'payload'

export const HelpCtaBlock: Block = {
    slug: 'help_cta_block',
    interfaceName: 'HelpCtaBlock',
    labels: { singular: 'Llamada a la acción', plural: 'Llamadas a la acción' },
    fields: [
        {
            name: 'cta',
            label: 'Llamada a la acción',
            type: 'relationship',
            relationTo: 'cta',
            hasMany: false,
            admin: { description: 'Elige la llamada a la acción (título, subtítulo y botón) que se mostrará.' },
        },
    ],
}
