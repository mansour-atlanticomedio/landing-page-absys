import { CollectionConfig } from "payload";
import { enlaceFields } from "./fields/enlace";

export const Header: CollectionConfig = {
    slug: 'header',
    labels: {
        singular: "Encabezamiento",
        plural: "Encabezamiento",
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'logo',
            label: 'Logo de la aplicación',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'type',
            label: 'Tipo de encabezamiento',
            type: 'select',
            defaultValue: '0',
            options:  [
                { label: 'Estilo Clásico', value: '0' },
                { label: 'Estilo Moderno', value: '1' },
                { label: 'Estilo Minimalista', value: '2' },
            ],
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'phone',
                    label: 'Numero de Telefono',
                    type: 'text'
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email'
                },
            ]
        },
        {
            name: "navbar",
            label: 'Barra de navegacion',
            labels: {
                singular: "Barra de navegacion",
                plural: "barra de navegacion"
            },
            type: "array",
            fields: [
                {
                    name: "name",
                    label: 'Nombre',
                    type: "text"
                },
                ...enlaceFields(),
                {
                    name: "items",
                    label: 'Desplegable',
                    labels: {
                        singular: 'Desplegable',
                        plural: 'desplegable'
                    },
                    type: "array",
                    fields: [
                        {
                            name: 'label',
                            label: 'Etiqueta',
                            type: 'text'
                        },
                        ...enlaceFields()
                    ]
                },
            ]

        }

    ]
}