import { GlobalConfig } from "payload";

export const Repositories: GlobalConfig = {
    slug: 'repository',
    label: 'Repositorios',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false
        },
        {
            name: 'layout',
            label: 'Bloque',
            labels: {
                singular: 'bloque',
                plural: 'bloques'
            },
            type: 'blocks',
            blocks: [
                {
                    admin: {
                        images: {
                            thumbnail: '/images/blocks/cta_thumbnail.jpeg'
                        }
                    },
                    slug: 'cta_block',
                    labels: {
                        singular: 'CTA',
                        plural: 'CTA'
                    },
                    fields: [
                        {
                            name: 'cta_relation',
                            label: 'Seccion de Inscripcion',
                            type: 'relationship',
                            relationTo: 'cta',
                            hasMany: true,
                        },
                    ]
                },

            ]
        },
    ]
}