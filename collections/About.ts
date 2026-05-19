import { CollectionConfig } from "payload";

export const About : CollectionConfig = {
    slug: 'about',
    labels: {
        singular: 'Información',
        plural: 'Información'
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text'
        },
        {
            name: 'article',
            label: 'Artículo',
            type: 'richText'
        }
    ]
}