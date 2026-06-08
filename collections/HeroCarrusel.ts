import { CollectionConfig } from "payload";

export const HeroCarrusel : CollectionConfig = {
    slug: 'hero_carrusel',
    labels: {
        singular: 'Seccion de Carrusel Principal',
        plural: 'Seccion de Carrusel Principal'
    },
    fields: [
        {
            name: 'items',
            label: 'Items',
            labels: {
                singular: 'item',
                plural: 'items'
            },
            type: 'array',
            fields: [
                {
                    name: 'title',
                    label: 'Titulo',
                    type: 'text'
                },
                {
                    name: 'description',
                    label: 'Descripcion',
                    type: 'text'
                },
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'upload',
                    relationTo: 'media'
                }
            ]
        }
    ]
} 