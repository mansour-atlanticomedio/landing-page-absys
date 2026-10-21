import type { GlobalConfig } from "payload";
import { sectionGlobal } from "@/lib/access";

export const Library : GlobalConfig = {
    slug: 'library',
    admin: {
        group: 'Páginas',
        description: 'Página de la biblioteca: cabecera.'
    },
    access: sectionGlobal('paginas'),
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