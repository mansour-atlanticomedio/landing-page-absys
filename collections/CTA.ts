import type { CollectionConfig } from "payload";
import { contentAccess } from "@/lib/access";

export const CTA: CollectionConfig = {
    slug: 'cta',
    access: contentAccess,
    admin: {
        group: 'Bloques de contenido',
        description: 'Llamadas a la acción: título, subtítulo y botón con enlace.',
        useAsTitle: 'title'
    },
    labels: {
        singular: 'Sección de inscripción',
        plural: 'Sección de inscripción'
    },
    fields: [
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