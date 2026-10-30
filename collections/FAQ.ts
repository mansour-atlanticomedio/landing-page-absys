import type { CollectionConfig } from "payload";
import { sectionAccess } from "@/lib/access";

export const FAQ : CollectionConfig = {
    slug: 'faq',
    admin: {
        group: 'Contenido',
        description: 'Listados de preguntas frecuentes con sus respuestas.',
        useAsTitle: 'title'
    },
    access: sectionAccess('bloques'),
    labels: {
        singular: "Preguntas Frecuentes",
        plural: "Preguntas Frecuentes"
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text'
        },
        {
            name: 'faqs',
            label: 'Preguntas',
            labels: {
                singular: "Pregunta",
                plural: "Preguntas"
            },
            type: 'array',
            admin: {
                components: {
                    RowLabel: {
                        path: '/components/admin/ItemRowLabel',
                        clientProps: { field: 'question', singular: 'Pregunta' },
                    },
                },
            },

            fields: [
                {
                    name: 'question',
                    label: "Pregunta",
                    type: 'text'
                },
                {
                    name: 'answer',
                    label: "Respuesta",
                    type: 'richText'
                },
            ]
        }
    ]
}