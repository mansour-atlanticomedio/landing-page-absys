import type { CollectionConfig } from "payload";

export const NewsCollection: CollectionConfig = {
    slug: 'news',
    labels: {
        singular: 'Noticia',
        plural: 'Noticias'
    },
    fields: [
        {
            name: 'title',
            label: 'Titulo',
            type: 'text'
        },
        {
            name: 'style',
            label: 'Estilo de Diseño',
            type: 'select',
            options: [
                { label: 'Estilo 0: Clásico (Imagen arriba)', value: '0' },
                { label: 'Estilo 1: Card con Bordes (Enmarcado)', value: '1' },
                { label: 'Estilo 2: Horizontal (Imagen lateral)', value: '2' },
                { label: 'Estilo 3: Moderno Overlay (Texto sobre imagen)', value: '3' },
            ],
            admin: {
                description: 'Define cómo se verá la sección de noticias en el frontend.',
                // layout: "vertical",
            }
        },
        {
            name: 'newsItems',
            label: 'Listado de Noticias',
            type: 'array',
            minRows: 1,
            maxRows: 6,
            labels: {
                singular: 'Noticia',
                plural: 'Noticias'
            },
            fields: [
                {
                    name: 'tag',
                    label: 'Etiqueta (Tag)',
                    type: 'text',
                    required: true,
                    admin: {
                        placeholder: 'EJ: EVENTO, EXPOSICIÓN...'
                    }
                },
                {
                    name: 'title',
                    label: 'Título de la Noticia',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    label: 'Descripción / Resumen',
                    type: 'textarea',
                    required: true,
                },
                {
                    name: 'image',
                    label: 'Imagen de la Noticia',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
            ]
        }
    ]
}