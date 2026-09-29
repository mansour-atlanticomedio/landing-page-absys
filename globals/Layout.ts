import { GlobalConfig } from "payload";

export const Layout : GlobalConfig = {
    slug: 'layout',
    label: 'Plantilla',
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
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Sin espacios, en minúsculas (ej: opac, dspace, instagram) — es lo que usa el código para buscarlo',
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
        }
    ]
}