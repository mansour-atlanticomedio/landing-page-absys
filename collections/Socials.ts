import { CollectionConfig } from "payload";

export const Socials : CollectionConfig = {
    slug: 'socials',
    fields: [
        {
            name: 'icon',
            type: 'text'
        },
        {
            name: 'link',
            type: 'text'
        }
    ]
}