import type { Block } from 'payload'

export const ScheduleBlock: Block = {
    slug: 'schedule_block',
    interfaceName: 'ScheduleBlock',
    labels: { singular: 'Horario', plural: 'Horarios' },
    fields: [
        { name: 'title', label: 'Título', type: 'text', admin: { description: 'Ej. "Horario de atención".' } },
        {
            name: 'schedule',
            label: 'Horario',
            type: 'relationship',
            relationTo: 'schedule',
            hasMany: false,
            admin: { description: 'Elige el horario que se mostrará en este bloque.' },
        },
    ],
}
