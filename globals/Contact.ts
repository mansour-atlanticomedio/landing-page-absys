import type { GlobalConfig } from "payload";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const Contact: GlobalConfig = {
    slug: 'contact',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Página de contacto: cabecera.'
    },
    access: sectionGlobal('paginas'),
    label: "Contacto",
    fields: [
        {
            name: 'hero',
            label: 'Sección principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        }
    ]
}