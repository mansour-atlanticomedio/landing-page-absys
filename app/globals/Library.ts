import { CollectionSlug, GlobalConfig } from "payload";

export const Library : GlobalConfig = {
    slug: 'library',
    label: 'Biblioteca',
    fields: [
        {
            name: 'hero',
            type: 'relationship',
            relationTo: 'hero' as CollectionSlug,
            hasMany: false
        }
    ]
}