import type { CollectionConfig } from "payload";
import { adminOnly } from "@/lib/access";

export const Schedule: CollectionConfig = {
    slug: 'schedule',
    admin: {
        group: 'Bloques de contenido',
        description: 'Horarios de apertura por días y franjas.',
        useAsTitle: 'title'
    },
    access: adminOnly,
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
            admin: {
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'scheduleType',
                            contentFields: { day: './day', hours: './hours' },
                            options: [
                                { value: 'regular', title: 'Normal', description: 'Horario habitual, texto en gris' },
                                { value: 'closed', title: 'Cerrado', description: 'Texto en rojo' },
                                { value: 'extended', title: 'Horario ampliado', description: 'Texto en verde azulado' },
                                { value: 'holiday', title: 'Vacaciones', description: 'Texto en ámbar' },
                            ],
                        },
                    },
                },
            },
                },
            ],
        },
    ],
}
