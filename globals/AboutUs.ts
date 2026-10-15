import { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";
import { conocenosBlocks } from "@/blocks/conocenos";

export const AboutUs : GlobalConfig = {
    slug: 'about_us',
    admin: {
        group: 'Páginas',
        hidden: true,
        description: "Obsoleto: ahora son páginas en 'Páginas'."
    },
    access: adminOnlyGlobal,
    label: "Conócenos",
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    name: 'quienes_somos',
                    label: 'Quiénes somos',
                    admin: { description: 'Página Quiénes somos: cabecera y bloques de contenido.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            name: 'layout',
                            label: 'Contenido',
                            labels: { singular: 'Bloque', plural: 'Bloques' },
                            type: 'blocks',
                            blocks: conocenosBlocks,
                            admin: { description: 'Añade, ordena y elimina los bloques de contenido de esta página.', initCollapsed: true },
                        },
                    ],
                },
                {
                    name: 'horarios',
                    label: 'Horarios y contacto',
                    admin: { description: 'Página de horarios, ubicación y contacto: cabecera y bloques de contenido.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            name: 'layout',
                            label: 'Contenido',
                            labels: { singular: 'Bloque', plural: 'Bloques' },
                            type: 'blocks',
                            blocks: conocenosBlocks,
                            admin: { description: 'Añade, ordena y elimina los bloques de contenido de esta página.', initCollapsed: true },
                        },
                    ],
                },
                {
                    name: 'normativa',
                    label: 'Normativa',
                    admin: { description: 'Página de normativa y condiciones de uso: cabecera y bloques de contenido.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            name: 'layout',
                            label: 'Contenido',
                            labels: { singular: 'Bloque', plural: 'Bloques' },
                            type: 'blocks',
                            blocks: conocenosBlocks,
                            admin: { description: 'Añade, ordena y elimina los bloques de contenido de esta página.', initCollapsed: true },
                        },
                    ],
                },
            ],
        },
    ]
}
