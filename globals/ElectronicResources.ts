import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const ElectronicResources: GlobalConfig = {
    slug: 'electronic_resources',
    admin: {
        group: 'Páginas',
        description: 'Página de recursos electrónicos: cabecera y accesos destacados.'
    },
    access: adminOnlyGlobal,
    label: 'Recursos Electrónicos',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
        {
            name: 'accesos_destacados',
            label: 'Accesos Directos Destacados',
            type: 'relationship',
            relationTo: 'electronic_resources_access',
            hasMany: false
        },
    ]
}
