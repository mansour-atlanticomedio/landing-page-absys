import { CollectionConfig } from "payload";

export const FAQ : CollectionConfig = {
    slug: 'faq',
    labels: {
        singular: "FAQ",
        plural: "FAQ"
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