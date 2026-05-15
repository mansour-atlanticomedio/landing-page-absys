import { CollectionConfig } from "payload";

export const Speakers: CollectionConfig = {
    slug: 'speakers',
    fields: [
        {
            name: 'title',
            type: 'text'
        },
        {
            name: 'speakers_people',
            type: 'array',
            fields: [
                {
                    name: 'name',
                    type: 'text'
                },
                {
                    name: 'photo',
                    type: 'upload',
                    relationTo: 'media',
                    required: true
                },
                {
                    name: 'description',
                    type: 'richText'
                },
                {
                    name: 'socials',
                    type: 'relationship',
                    relationTo: 'socials',
                    hasMany: true
                }
            ]
        }
    ]
}