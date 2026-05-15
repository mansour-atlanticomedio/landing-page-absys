import { GlobalConfig } from "payload";

export const Contact: GlobalConfig = {
    slug: 'contact',
    label: "Contacto",
    fields: [
        {
            name: 'hero',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
        {
            name: 'contact_section',
            label: 'Contacto',
            type: 'relationship',
            relationTo: 'contact',
            hasMany: false
        }
    ]
}