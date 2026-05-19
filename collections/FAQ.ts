import { CollectionConfig } from "payload";

export const FAQ : CollectionConfig = {
    slug: 'faq',
    labels: {
        singular: "Preguntas Frecuentes",
        plural: "Preguntas Frecuentes"
    },
    fields: [
        {
            name: 'title',
            label: 'Titulo',
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