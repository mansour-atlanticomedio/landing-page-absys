import { CollectionConfig } from "payload";

export const CTA : CollectionConfig = {
    slug: 'cta',
    labels: {
        singular: 'Sección de inscripción',
        plural: 'Sección de inscripción'
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
            label: 'Texto del boton de inscripcion',
            type: 'text'
        },
        {
            name: 'button_link',
            label: 'Enlace del boton',
            type: 'text'
        },
    ]
}