import { GlobalConfig } from "payload";

export const Library : GlobalConfig = {
    slug: 'library',
    label: 'Biblioteca',
    fields: [
        {
            name: 'hero',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        }
    ]
}