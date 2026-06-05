import { CollectionConfig } from "payload";

export const Input: CollectionConfig = {
    slug: 'input',
    labels: {
        singular: 'Entrada de texto',
        plural: 'Entrada de texto'
    },
    fields: [
        {
            name: 'title',
            label: 'Titulo',
            type: 'text'
        },
        {
            name: 'placeholder',
            label: 'Texto de ejemplo',
            type: 'text'
        }
    ]
}