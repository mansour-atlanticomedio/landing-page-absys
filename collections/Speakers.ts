import type { CollectionConfig } from "payload";
import { iconsSocialMedia } from "./Icons.ts";

export const Speakers: CollectionConfig = {
    slug: 'speakers',
    labels: {
        singular: 'Ponentes',
        plural: 'Ponentes'
    },
    fields: [
        {
            name: 'title',
            label: 'Titulo',
            type: 'text'
        },
        {
            name: 'people',
            label: 'Ponentes',
            labels: {
                singular: "Ponente",
                plural: "Ponentes"
            },
            type: 'array',
            fields: [
                {
                    name: 'photo',
                    label: 'Foto',
                    type: 'upload',
                    relationTo: 'media',
                    required: true
                },
                {
                    name: 'name',
                    label: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'role',
                    label: 'Rol',
                    type: 'text'
                },
                {
                    name: 'entity',
                    label: 'Entidad',
                    type: 'text'
                },
                {
                    name: 'description',
                    label: 'Descripcion',
                    type: 'richText'
                },
                {
                    name: 'socials',
                    label: 'Redes Sociales',
                    type: 'array',
                    fields: [
                        {
                            type: 'row',
                            fields: [

                                {
                                    admin: {
                                        width: '30%',
                                    },
                                    name: 'icon',
                                    type: 'select',
                                    label: 'Icono',
                                    options: iconsSocialMedia
                                },
                                {
                                    name: 'url',
                                    label: 'Enlace',
                                    type: 'text'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}