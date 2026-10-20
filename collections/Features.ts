import type { CollectionConfig } from "payload";
import { appIcons } from './Icons.ts'
import { contentAccess } from "@/lib/access";

export const Features : CollectionConfig = {
    slug: 'features',
    admin: {
        group: 'Bloques de contenido',
        description: 'Conjuntos de tarjetas con icono, título y descripción.',
        useAsTitle: 'title'
    },
    access: contentAccess,
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