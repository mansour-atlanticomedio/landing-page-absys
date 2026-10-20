import type { CollectionConfig } from "payload";
import { contentAccess } from "@/lib/access";

export const About : CollectionConfig = {
    slug: 'about',
    admin: {
        group: 'Bloques de contenido',
        description: 'Bloques de texto informativo con título y artículo.',
        useAsTitle: 'title'
    },
    access: contentAccess,
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