import type { CollectionConfig } from "payload";

export const BlogsCollection: CollectionConfig = {
    slug: 'blogs',
    labels: {
        singular: 'Sección de Blog',
        plural: 'Secciones de Blogs'
    },
    fields: [
        {
            name: 'title',
            label: 'Título de la Sección',
            type: 'text',
            required: true,
            admin: {
                placeholder: 'Ej: Últimas publicaciones, Nuestro Blog...'
            }
        },
        {
            name: 'blogItems',
            label: 'Listado de Artículos',
            labels: {
                singular: 'Artículo',
                plural: 'Artículos'
            },
            type: 'array',
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: 'title',
                    label: 'Título del Artículo',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'blog',
                    label: 'Nombre del Blog / Fuente',
                    type: 'text',
                    required: true,
                    admin: {
                        placeholder: 'Ej: Inteling, Espacio Violeta...'
                    }
                },
                {
                    name: 'date',
                    label: 'Fecha de Publicación',
                    type: 'text', // Usamos 'text' para que puedas escribir exactamente "27 MAYO 2026" sin restricciones de formato de fecha estricto
                    required: true,
                    admin: {
                        placeholder: 'Ej: 27 MAYO 2026'
                    }
                }
            ]
        }
    ]
}