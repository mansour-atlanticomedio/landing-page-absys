import { CollectionConfig } from "payload";
import { sectionAccess, hideFromNonAdmins } from "@/lib/access";

export const Input: CollectionConfig = {
    slug: 'input',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Buscadores o campos de texto con título y texto de ejemplo.',
        useAsTitle: 'title'
    },
    access: sectionAccess('bloques'),
    labels: {
        singular: 'Entrada de texto',
        plural: 'Entrada de texto'
    },
    fields: [
        {
            name: 'title',
            label: 'Título',
            type: 'text'
        },
        {
            name: 'placeholder',
            label: 'Texto de ejemplo',
            type: 'text'
        }
    ]
}