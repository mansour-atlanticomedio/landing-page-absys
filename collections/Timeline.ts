import { CollectionConfig } from "payload";

export const Timeline: CollectionConfig = {
    slug: 'timeline',
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
