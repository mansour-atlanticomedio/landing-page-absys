import type { Block } from 'payload'

export const FaqSectionBlock: Block = {
    slug: 'faq_section_block',
    interfaceName: 'FaqSectionBlock',
    labels: { singular: 'Preguntas frecuentes', plural: 'Preguntas frecuentes' },
    fields: [
        {
            name: 'faq',
            label: 'Preguntas frecuentes',
            type: 'relationship',
            relationTo: 'faq',
            hasMany: false,
            required: true,
            admin: { description: 'Elige el listado de preguntas (por ejemplo "Préstamos"). Se edita en Contenido > Preguntas frecuentes.' },
        },
        {
            name: 'show_search',
            label: 'Mostrar buscador general',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                description:
                    'Si lo marcas en cualquier listado, la página muestra un único buscador (encima del primer listado) que busca en todos los temas de la página.',
            },
        },
        {
            name: 'open_first',
            label: 'Abrir la primera pregunta',
            type: 'checkbox',
            defaultValue: false,
        },
    ],
}
