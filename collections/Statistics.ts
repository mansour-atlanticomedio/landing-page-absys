import type { CollectionConfig } from "payload";
import { appIcons } from "./Icons.ts";

export const Statistics: CollectionConfig = {
    slug: 'statistics',
    labels: {
        singular: 'Estadísticas',
        plural: 'Estadísticas'
    },
    fields: [
        {
            name: 'stats',
            labels: {
                singular: 'Estadistica',
                plural: 'Estadistica',
            },
            type: 'array',
            label: 'Listado de estadisticas',
            minRows: 1,
            maxRows: 4,
            fields: [
                {
                    name: 'icon',
                    label: 'Icono',
                    type: 'select',
                    options: appIcons,
                    required: true,
                },
                {
                    name: 'value',
                    label: 'Valor',
                    type: 'number',
                },
                {
                    name: 'description',
                    label: 'Descripcion',
                    type: 'text',
                },
            ]
        }
    ]

}