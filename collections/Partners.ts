import type { CollectionConfig } from "payload";

export const PartnersCollection : CollectionConfig = {
    slug: 'partners',
    labels: {
        singular: 'Patrocinador',
        plural: 'Patrocinadores',
    },
    fields: [
        {
            name: 'partners_item',
            label: 'Patrocinadores',
            labels: {
                singular: 'patrocinador',
                plural: 'patrocinadores',
            },
            type: 'array',
            fields: [
                {
                    name: 'name',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'relationship',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'link',
                    label: 'Enlace',
                    type: 'text'
                },
            ]
        }
    ]
}