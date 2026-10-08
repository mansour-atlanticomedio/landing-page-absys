import type { CollectionConfig } from "payload";
import { appIcons } from './Icons.ts'
import { adminOnly } from "@/lib/access";

export const Features : CollectionConfig = {
    slug: 'features',
    access: adminOnly,
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
            maxRows: 6,
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