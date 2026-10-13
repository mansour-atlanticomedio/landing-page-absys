import type { GlobalConfig } from "payload";

export const SolicitudCompra: GlobalConfig = {
    slug: 'solicitud_compra',
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
