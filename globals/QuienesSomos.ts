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
            type: 'tabs',
            tabs: [
                {
                    label: 'Cabecera',
                    admin: { description: 'Sección principal e imagen de la página.' },
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
                    ],
                },
                {
                    label: 'Ayudas',
                    admin: { description: 'Tarjetas de cómo podemos ayudarte.' },
                    fields: [
                        {
                            name: 'ayudas',
                            label: '¿Cómo podemos ayudarte?',
                            type: 'relationship',
                            relationTo: 'features',
                            hasMany: false
                        },
                    ],
                },
                {
                    label: 'Dirigidos',
                    admin: { description: 'Tarjetas de a quién se dirigen los servicios.' },
                    fields: [
                        {
                            name: 'dirigidos',
                            label: 'A quién se dirigen nuestros servicios',
                            type: 'relationship',
                            relationTo: 'features',
                            hasMany: false
                        },
                    ],
                },
            ],
        },
    ]
}
