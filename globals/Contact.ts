import type { GlobalConfig } from "payload";
import { contentGlobal } from "@/lib/access";

export const Contact: GlobalConfig = {
    slug: 'contact',
    admin: {
        group: 'Páginas',
        description: 'Página de contacto: cabecera.'
    },
    access: contentGlobal,
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