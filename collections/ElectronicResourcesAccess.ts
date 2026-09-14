import type { CollectionConfig } from "payload";
import { appIcons } from './Icons.ts'

export const ElectronicResourcesAccess: CollectionConfig = {
    slug: 'electronic_resources_access',
    labels: {
        singular: 'Acceso Destacado',
        plural: 'Accesos Destacados'
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text',
        },
        {
            name: 'accesos',
            label: 'Accesos',
            labels: {
                singular: 'Acceso',
                plural: 'Accesos'
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
                    required: true,
                },
                {
                    name: 'description',
                    label: 'Descripción',
                    type: 'textarea',
                },
                {
                    name: 'cta',
                    label: 'Texto del botón',
                    type: 'text',
                },
                {
                    name: 'link',
                    label: 'Enlace',
                    type: 'text',
                },
            ]
        }
    ]
}
