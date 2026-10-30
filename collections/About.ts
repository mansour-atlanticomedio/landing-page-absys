import type { CollectionConfig } from "payload";
import { sectionAccess, hideFromNonAdmins } from "@/lib/access";

export const About : CollectionConfig = {
    slug: 'about',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Bloques de texto informativo con título y artículo.',
        useAsTitle: 'title'
    },
    access: sectionAccess('bloques'),
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