import type { GlobalConfig } from "payload";

export const Contact: GlobalConfig = {
    slug: 'contact',
    label: "Contacto",
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        }
    ]
}