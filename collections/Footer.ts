import { CollectionConfig } from "payload";
import { appIcons, iconsSocialMedia } from "./Icons";

export const Footer: CollectionConfig = {
    slug: 'footer',
    labels: {
        singular: 'Pie de pagina',
        plural: 'pie de pagina'
    },
    fields: [
        {
            name: 'type',
            label: 'Tipo',
            type: 'select',
            defaultValue: '0',
            options: [
                { label: 'Estilo Horizontal', value: '0' },
                { label: 'Estilo Vertical', value: '1' },
                { label: 'Estilo Simple', value: '2' },
            ],
        },
        {
            name: 'logo',
            label: 'Logo',
            type: 'upload',
            relationTo: 'media'
        },
        {
            name: 'social_medias',
            label: 'Redes Sociales',
            labels: {
                singular: 'Redes Sociales',
                plural: 'redes sociales'
            },
            type: 'array',
            fields: [
                {
                    name: 'icon',
                    label: 'Icono',
                    type: 'select',
                    options: iconsSocialMedia
                },
                {
                    name: 'link',
                    label: 'Enlace',
                    type: 'text'
                }
            ]
        },
        {
            name: 'seccion_info',
            label: 'Seccion de Informacion',
            type: 'array',
            fields: [
                {
                    name: 'title',
                    label: 'Título',
                    type: 'text'
                },
                {
                    name: 'information',
                    label: 'Informacion',
                    type: 'array',
                    fields: [
                        {
                            name: 'icon',
                            label: 'Icono',
                            type: 'select',
                            options: appIcons
                        },
                        {
                            name: 'label',
                            label: 'Etiqueta',
                            type: 'text'
                        },
                        {
                            name: 'url',
                            label: 'Enlace',
                            type: 'text'
                        }
                    ]
                }
            ]
        },
        {
            name: 'legal_advice',
            label: 'Enlace Aviso Legal',
            type: 'text'
        },
        {
            name: 'privacy_policie',
            label: 'Enlace Política de privacidad',
            type: 'text'
        },
        {
            name: 'privacy_cookies',
            label: 'Enlace Política de Cookies',
            type: 'text'
        }
    ]
}