import type { GlobalConfig } from "payload";

export const QuienesSomos: GlobalConfig = {
    slug: 'quienes_somos',
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
