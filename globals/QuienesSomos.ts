import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const QuienesSomos: GlobalConfig = {
    slug: 'quienes_somos',
    admin: {
        group: 'Páginas',
        description: 'Página Quiénes somos: cabecera, imagen y tarjetas de servicios.'
    },
    access: adminOnlyGlobal,
    label: 'Quiénes Somos',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
        {
            name: 'imagen_dirigidos',
            label: 'Imagen "A quién se dirigen nuestros servicios"',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name: 'ayudas',
            label: '¿Cómo podemos ayudarte?',
            type: 'relationship',
            relationTo: 'features',
            hasMany: false
        },
        {
            name: 'dirigidos',
            label: 'A quién se dirigen nuestros servicios',
            type: 'relationship',
            relationTo: 'features',
            hasMany: false
        },
    ]
}
