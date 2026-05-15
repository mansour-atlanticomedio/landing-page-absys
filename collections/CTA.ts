import { CollectionConfig } from "payload";

export const CTA : CollectionConfig = {
    slug: 'cta',
    labels: {
        singular: 'CTA',
        plural: 'CTA'
    },
    fields : [
        {
            name: 'title',
            label: 'Titulo',
            type: 'text'
        },
        {
            name: 'subtitle',
            label: 'Subtitulo',
            type: 'text'
        },
        {
            name: 'button_cta',
            label: 'Texto del boton de accion',
            type: 'text'
        },
    ]
}