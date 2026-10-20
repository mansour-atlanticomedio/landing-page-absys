import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const Library : GlobalConfig = {
    slug: 'library',
    admin: {
        group: 'Páginas',
        description: 'Página de la biblioteca: cabecera.'
    },
    access: adminOnlyGlobal,
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