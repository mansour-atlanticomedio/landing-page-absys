import type { CollectionConfig } from "payload";
import { appIcons } from "./Icons.ts";
import { adminOnly } from "@/lib/access";

export const Statistics: CollectionConfig = {
    slug: 'statistics',
    admin: {
        group: 'Bloques de contenido',
        description: 'Cifras destacadas con icono y descripción.'
    },
    access: adminOnly,
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