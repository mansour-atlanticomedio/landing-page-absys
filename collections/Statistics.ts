import type { CollectionConfig } from "payload";
import { appIcons } from "./Icons.ts";
import { sectionAccess, hideFromNonAdmins } from "@/lib/access";

export const Statistics: CollectionConfig = {
    slug: 'statistics',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Cifras destacadas con icono y descripción.'
    },
    access: sectionAccess('bloques'),
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
            admin: { components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'description', singular: 'Estadística' } } } },
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
                    label: 'Descripción',
                    type: 'text',
                },
            ]
        }
    ]

}