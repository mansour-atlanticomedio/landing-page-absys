import { CollectionConfig } from "payload";

export const About : CollectionConfig = {
    slug: 'about',
    labels: {
        singular: {
            es: 'Información',
            en: 'About Info'
        },
        plural: {
            es: 'Información',
            en: 'About Info',
        }
    },
    fields: [
        {
            name: 'title',
            label: {
                es: 'Título',
                en: 'Title'
            },
            type: 'text',
            localized: true
        },
        {
            name: 'article',
            label:  {
                es: 'Artículo',
                en: 'Article'
            },
            type: 'richText',
            localized: true
        }
    ]
}