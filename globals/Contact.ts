import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const Contact: GlobalConfig = {
    slug: 'contact',
    admin: {
        group: 'Páginas',
        description: 'Página de contacto: cabecera.'
    },
    access: adminOnlyGlobal,
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