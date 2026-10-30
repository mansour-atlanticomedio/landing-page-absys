import type { CollectionConfig } from "payload"
import { sectionAccessPublic } from "@/lib/access";

export const Hero: CollectionConfig = {
    slug: 'hero',
    admin: {
        group: 'Contenido',
        description: 'Cabeceras con imagen de fondo, título y botón que se reutilizan en las páginas.',
        useAsTitle: 'title'
    },
    access: sectionAccessPublic('bloques'),
    labels: {
        singular: 'Sección principal',
        plural: 'Sección principal'
    },
    fields: [
        {
            name: 'background_image',
            label: 'Imagen de fondo',
            type: 'upload',
            relationTo: 'media',
            required: true
        },
        {
            name: 'pretitle',
            label: 'Pretítulo',
            type: 'text',
        },
        {

            name: 'title',
            label: 'Título',
            type: 'text',
            required: true
        },
        {
            name: 'subtitle',
            label: 'Subtitulo',
            type: 'text',
        },
        {
            name: 'button_cta',
            label: 'Texto del boton (Opcional)',
            type: 'text'
        },
        {
            name: 'input_placeholder',
            label: 'Texto del input (Opcional)',
            type: 'text'
        },
    ]
}