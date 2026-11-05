import { CollectionConfig } from "payload";
import { sectionAccess } from "@/lib/access";

export const HeroCarrusel : CollectionConfig = {
    slug: 'hero_carrusel',
    admin: {
        group: 'Contenido',
        description: 'Carruseles de diapositivas con imagen, título y descripción para la parte superior de una página.'
    },
    access: sectionAccess('bloques'),
    labels: {
        singular: 'Carrusel principal',
        plural: 'Carrusel principal'
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
            admin: { components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'title', singular: 'Diapositiva' } } } },
            fields: [
                {
                    name: 'title',
                    label: 'Título',
                    type: 'text'
                },
                {
                    name: 'description',
                    label: 'Descripción',
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