import type { GlobalConfig } from "payload";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const Library : GlobalConfig = {
    slug: 'library',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Obsoleto: Biblioteca ahora se edita en Páginas > Biblioteca.'
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