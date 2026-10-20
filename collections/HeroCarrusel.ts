import { CollectionConfig } from "payload";
import { contentAccess } from "@/lib/access";

export const HeroCarrusel : CollectionConfig = {
    slug: 'hero_carrusel',
    admin: {
        group: 'Bloques de contenido',
        description: 'Carruseles de diapositivas con imagen, título y descripción para la parte superior de una página.'
    },
    access: contentAccess,
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