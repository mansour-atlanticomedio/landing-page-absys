import type { Block } from 'payload'

export const FormationContentBlock: Block = {
    slug: 'formation_content_block',
    interfaceName: 'FormationContentBlock',
    labels: { singular: 'Contenido de Formación', plural: 'Contenido de Formación' },
    fields: [
        { name: 'search_paragraph_1', label: 'Buscar y evaluar información: párrafo 1', type: 'textarea' },
        { name: 'search_paragraph_2', label: 'Buscar y evaluar información: párrafo 2', type: 'textarea' },
        {
            name: 'quick_links',
            label: 'Enlaces rápidos',
            labels: { singular: 'Enlace', plural: 'Enlaces' },
            type: 'array',
            maxRows: 4,
            admin: {
                components: {
                    RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'label', singular: 'Enlace' } },
                },
            },
            fields: [
                { name: 'label', label: 'Texto', type: 'text', required: true },
                { name: 'link', label: 'Enlace', type: 'text', required: true },
            ],
        },
        { name: 'cite_title', label: 'Citar correctamente: título', type: 'text' },
        { name: 'cite_text', label: 'Citar correctamente: texto', type: 'textarea' },
        { name: 'cite_button_label', label: 'Citar correctamente: texto del botón', type: 'text' },
        { name: 'cite_button_link', label: 'Citar correctamente: enlace del botón', type: 'text' },
        { name: 'guide_title', label: 'Guías y tutoriales: título de la tarjeta', type: 'text' },
        { name: 'guide_description', label: 'Guías y tutoriales: descripción', type: 'text' },
        { name: 'guide_link', label: 'Guías y tutoriales: enlace', type: 'text' },
        { name: 'activities_text', label: 'Actividades formativas: texto', type: 'textarea' },
        { name: 'activities_status', label: 'Actividades formativas: estado actual', type: 'text' },
    ],
}
