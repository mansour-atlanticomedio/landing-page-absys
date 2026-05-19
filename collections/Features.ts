import { CollectionConfig } from "payload";
import { appIcons } from './Icons'

export const Features : CollectionConfig = {
    slug: 'features',
    labels: {
        singular: 'Característica',
        plural: 'Características'
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text'
        },
        {
            name: 'feature',
            label: 'Características',
            labels: {
                singular: 'Característica',
                plural: 'Características'
            },
            type: 'array',
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
                    name: 'title',
                    label: 'Título',
                    type: 'text',
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