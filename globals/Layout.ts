import { GlobalConfig } from "payload";
import { ENLACES_EXTERNOS_KEYS } from "@/lib/links";
import { contentGlobal } from "@/lib/access";

export const Layout : GlobalConfig = {
    slug: 'layout',
    admin: {
        group: 'Navegación y pie',
        description: 'Elige la cabecera y el pie del sitio y gestiona el registro de enlaces externos.'
    },
    access: contentGlobal,
    label: 'Plantilla',
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Cabecera y pie',
                    admin: { description: 'Elige la cabecera y el pie del sitio.' },
                    fields: [
                        {
                            name: 'header',
                            label: 'Encabezamiento',
                            type: 'relationship',
                            relationTo: 'header'
                        },
                        {
                            name: 'footer',
                            label: 'Pie de pagina',
                            type: 'relationship',
                            relationTo: 'footer'
                        },
                    ],
                },
                {
                    label: 'Enlaces externos',
                    admin: { description: 'Registro de enlaces a sitios externos.' },
                    fields: [
                        {
                            name: 'enlaces_externos',
                            label: 'Enlaces externos',
                            type: 'array',
                            admin: {
                                description: 'Registro de enlaces a sitios externos (repositorio, catálogo, redes...) editable sin tocar código. Se consultan por "key" desde lib/links.ts',
                            },
                            fields: [
                                {
                                    name: 'key',
                                    label: 'Identificador',
                                    type: 'select',
                                    required: true,
                                    options: ENLACES_EXTERNOS_KEYS.map(({ key, label }) => ({ label, value: key })),
                                    admin: {
                                        description: 'Identificador que usa el código para buscarlo (ver lib/links.ts)',
                                    },
                                },
                                {
                                    name: 'label',
                                    label: 'Nombre',
                                    type: 'text',
                                    required: true,
                                },
                                {
                                    name: 'url',
                                    label: 'URL',
                                    type: 'text',
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]
}