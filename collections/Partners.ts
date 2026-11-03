import type { CollectionConfig } from "payload";
import { sectionAccess, hideFromNonAdmins } from "@/lib/access";

export const PartnersCollection : CollectionConfig = {
    slug: 'partners',
    admin: {
        group: 'Piezas antiguas',
        hidden: hideFromNonAdmins,
        description: 'Logotipos de entidades colaboradoras y patrocinadores.'
    },
    access: sectionAccess('bloques'),
    labels: {
        singular: 'Patrocinador',
        plural: 'Patrocinadores',
    },
    fields: [
        {
            name: 'partners_item',
            label: 'Patrocinadores',
            labels: {
                singular: 'patrocinador',
                plural: 'patrocinadores',
            },
            type: 'array',
            admin: { components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'name', singular: 'Patrocinador' } } } },
            fields: [
                {
                    name: 'name',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'image',
                    label: 'Imagen',
                    type: 'relationship',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'link',
                    label: 'Enlace',
                    type: 'text'
                },
            ]
        }
    ]
}