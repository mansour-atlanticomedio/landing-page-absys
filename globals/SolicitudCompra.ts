import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const SolicitudCompra: GlobalConfig = {
    slug: 'solicitud_compra',
    access: adminOnlyGlobal,
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
