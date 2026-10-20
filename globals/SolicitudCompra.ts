import type { GlobalConfig } from "payload";
import { contentGlobal } from "@/lib/access";

export const SolicitudCompra: GlobalConfig = {
    slug: 'solicitud_compra',
    admin: {
        group: 'Páginas',
        description: 'Cabecera de la página de solicitud de compra de libros.'
    },
    access: contentGlobal,
    label: 'Solicitud de compra',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
    ]
}
