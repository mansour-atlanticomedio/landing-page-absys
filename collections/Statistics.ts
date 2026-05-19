import { CollectionConfig } from "payload";
import { appIcons } from "./Icons";

export const Statistics: CollectionConfig = {
    slug: 'statistics',
    labels: {
        singular: 'Estadísticas',
        plural: 'Estadísticas'
    },
    fields: [
        {
            name: 'stadistic_item',
            labels: {
                singular: 'Estadistica',
                plural: 'Estadistica',
            },
            type: 'array',
            label: 'Lista de estadisticas',
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