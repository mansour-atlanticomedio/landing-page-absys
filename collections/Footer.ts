import { CollectionConfig } from "payload";

export const Footer : CollectionConfig = {
    slug: 'footer',
    fields: [
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name: 'sublogo',
            type: 'text'
        },
        {
            name: 'social-media',
            type: 'array',
            fields: [
                {
                    name: 'icon',
                    label: 'Icono',
                    type: 'text'
                },
                {
                    name: 'link',
                    label: 'Enlace',
                    type: 'text'
                }
            ]
        }
    ]
}