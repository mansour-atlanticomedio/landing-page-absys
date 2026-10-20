import { CollectionConfig } from "payload";
import { contentAccessPublic } from "@/lib/access";
import { enlaceFields } from "./fields/enlace";

export const Header: CollectionConfig = {
    slug: 'header',
    admin: {
        group: 'Navegación y pie',
        description: 'Cabecera del sitio: logo, teléfono, correo y menú de navegación.'
    },
    labels: {
        singular: "Encabezamiento",
        plural: "Encabezamiento",
    },
    access: contentAccessPublic,
    fields: [
        {
            name: 'logo',
            label: 'Logo de la aplicación',
            type: 'upload',
            relationTo: 'media',
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