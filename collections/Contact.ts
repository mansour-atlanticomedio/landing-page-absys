import { CollectionConfig } from "payload";

export const Contact: CollectionConfig = {
    slug: 'contact',
    labels: {
        singular: 'Contacto',
        plural: 'Contacto'
    },
    fields: [
        {
            name: 'direction',
            label: 'Direccion',
            type: 'text'
        },
        {
            name: 'phone',
            label: 'Telefono',
            type: 'text'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'text'
        },
        {
            name: 'schedule',
            label: 'Horario',
            type: 'text'
        },

    ]
}