import type { CollectionConfig } from "payload";
import { sectionAccess } from "@/lib/access";

export const NewsCollection: CollectionConfig = {
    slug: 'news',
    admin: {
        group: 'Bloques de contenido',
        description: 'Bloques de noticias con imagen, etiqueta y enlace.',
        components: {
            beforeList: ['/components/admin/NewsListHelp'],
        },
        useAsTitle: 'title'
    },
    access: sectionAccess('bloques'),
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
            name: 'visible_cards',
            label: 'Cartas visibles',
            type: 'number'
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
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'newsStyle',
                            contentFields: { title: 'title', visible_cards: 'visible_cards', itemTitle: 'newsItems.0.title', tag: 'newsItems.0.tag', description: 'newsItems.0.description' },
                            options: [
                                { value: '0', title: 'Clásico', description: 'Imagen arriba, etiqueta y texto debajo' },
                                { value: '1', title: 'Enmarcado', description: 'Tarjeta con borde y la imagen redondeada dentro' },
                                { value: '2', title: 'Horizontal', description: 'Imagen a la izquierda y texto a la derecha' },
                                { value: '3', title: 'Texto sobre imagen', description: 'Imagen a toda la tarjeta con el título encima' },
                            ],
                        },
                    },
                },
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
            admin: {
                components: {
                    RowLabel: {
                        path: '/components/admin/ItemRowLabel',
                        clientProps: { field: 'title', singular: 'Noticia' },
                    },
                },
            },
            labels: {
                singular: 'Noticia',
                plural: 'Noticias'
            },
            fields: [
                {
                    name: 'tag',
                    label: 'Etiqueta (Tag)',
                    type: 'text',
                    required: false,
                    admin: {
                        placeholder: 'EJ: EVENTO, EXPOSICIÓN...'
                    }
                },
                {
                    name: 'link',
                    label: 'Enlace de la Noticia',
                    type: 'text',
                    required: false,
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