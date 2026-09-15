import type { CollectionConfig } from "payload";

export const Schedule: CollectionConfig = {
    slug: 'schedule',
    labels: {
        singular: 'Horario',
        plural: 'Horarios',
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text',
        },
        {
            name: 'schedule',
            label: 'Franjas horarias',
            labels: {
                singular: 'Franja',
                plural: 'Franjas',
            },
            type: 'array',
            minRows: 1,
            maxRows: 7,
            fields: [
                {
                    name: 'day',
                    label: 'Día(s)',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'hours',
                    label: 'Horas',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'type',
                    label: 'Tipo',
                    type: 'select',
                    defaultValue: 'regular',
                    options: [
                        { label: 'Normal', value: 'regular' },
                        { label: 'Cerrado', value: 'closed' },
                        { label: 'Horario ampliado', value: 'extended' },
                        { label: 'Vacaciones', value: 'holiday' },
                    ],
                },
            ],
        },
    ],
}
