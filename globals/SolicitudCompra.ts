import type { GlobalConfig } from "payload";
import { sectionGlobal, hideFromNonAdmins } from "@/lib/access";

export const SolicitudCompra: GlobalConfig = {
    slug: 'solicitud_compra',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Obsoleto: Solicitud de compra ahora se edita en Páginas > Solicitud de compra.'
    },
    access: sectionGlobal('paginas'),
    label: 'Solicitud de compra',
    fields: [
        {
            name: 'hero',
            label: 'Sección principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
    ]
}
