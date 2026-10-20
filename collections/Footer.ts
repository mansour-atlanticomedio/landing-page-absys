import { CollectionConfig } from "payload";
import { enlaceFields } from "./fields/enlace";
import { appIcons, iconsSocialMedia } from "./Icons";
import { contentAccess } from "@/lib/access";

export const Footer: CollectionConfig = {
    slug: 'footer',
    admin: {
        group: 'Navegación y pie',
        description: 'Pie de página: logo, redes sociales y secciones de información.'
    },
    access: contentAccess,
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
            ],
            admin: {
                components: {
                    Field: {
                        path: '/components/admin/fields/VisualSelectField',
                        clientProps: {
                            preview: 'footerType',
                            options: [
                                { value: '0', title: 'Horizontal', description: 'Logo y redes a la izquierda, columnas de información al lado' },
                                { value: '1', title: 'Vertical', description: 'Todo centrado y apilado en una sola columna' },
                            ],
                        },
                    },
                },
            },
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
                ...enlaceFields({ externalName: 'link', defaultTipo: 'externo' })
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
                        ...enlaceFields({ externalName: 'url', defaultTipo: 'externo' })
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