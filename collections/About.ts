import { CollectionConfig } from "payload";

export const About : CollectionConfig = {
    slug: 'about',
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