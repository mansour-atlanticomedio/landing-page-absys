import type { CollectionConfig } from "payload";
import { adminOnly } from "@/lib/access";

export const Timeline: CollectionConfig = {
    slug: 'timeline',
    admin: {
        group: 'Bloques de contenido',
        description: 'Calendarios o líneas del tiempo con días y eventos.',
        useAsTitle: 'title'
    },
    access: adminOnly,
    labels: {
        singular: 'Línea del tiempo',
        plural: 'Línea del tiempo'
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text'
        },
        {
            name: 'calendar',
            label: 'Calendario',
            labels: {
                singular: "Calendario",
                plural: "Calendario",
            },
            type: 'array',
            admin: {
                components: {
                    RowLabel: {
                        path: '/components/admin/ItemRowLabel',
                        clientProps: { field: 'title', fallbackField: 'day', singular: 'Día' },
                    },
                },
            },

            fields: [
                {
                    name: 'day',
                    label: 'Día',
                    type: 'text'
                },
                {
                    name: 'title',
                    label: 'Título',
                    type: 'text'
                },
                {
                    name: 'events',
                    label: 'Eventos',
                    type: 'array',
                    fields: [
                        {
                            name: 'title',
                            label: 'Título',
                            type: 'text'
                        },
                        {
                            name: 'description',
                            label: 'Descripcion',
                            type: 'richText'
                        },
                    ]
                }
            ]
        }
    ]
}
