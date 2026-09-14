import type { GlobalConfig } from "payload";

export const ElectronicResources: GlobalConfig = {
    slug: 'electronic_resources',
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
