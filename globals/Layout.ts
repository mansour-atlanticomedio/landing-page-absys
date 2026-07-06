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
        }
    ]
}