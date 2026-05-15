import { CollectionConfig } from "payload";

export const TimeStamp : CollectionConfig = {
    slug: 'timestamp',
    fields: [
        {
            name: 'title',
            type: 'text'
        },
        {
            name: 'description',
            type: 'text'
        },
    ]
}
export const Timeline : CollectionConfig = {
    slug: 'timeline',
    fields: [
        {
            name: 'title',
            type: 'text'
        },
        {
            name: 'calendar',
            type: 'array',
            fields: [
                {
                    name: 'day',
                    type: 'text'
                },
                {
                    name: 'title',
                    type: 'text'
                },
                {
                    name: 'timestamp',
                    type: 'relationship',
                    relationTo: 'timestamp',
                    hasMany: true
                }
            ]
        }
    ]
}
