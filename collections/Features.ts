import { CollectionConfig } from "payload";

export const Features : CollectionConfig = {
    slug: 'features',
    fields: [
        {
            name: 'title',
            type: 'text'
        },
        {
            name: 'feature',
            type: 'array',
            minRows: 1,
            maxRows: 4,
            fields: [
                {
                    name: 'feature_icon',
                    label: 'Icono',
                    type: 'text',
                },
                {
                    name: 'title',
                    label: 'Titulo',
                    type: 'text',
                },
                {
                    name: 'description',
                    label: 'Descripcion',
                    type: 'text',
                },
            ]
        }
    ]
}