import type { Block } from 'payload'

export const ContactInfoBlock: Block = {
    slug: 'contact_info_block',
    interfaceName: 'ContactInfoBlock',
    labels: { singular: 'Información y contacto', plural: 'Información y contacto' },
    fields: [
        {
            type: 'collapsible',
            label: 'Edificio',
            admin: { initCollapsed: false },
            fields: [
                { name: 'title', label: 'Título del bloque de información', type: 'text', admin: { description: 'Ej. "Información General".' } },
                { name: 'building_name', label: 'Nombre del edificio', type: 'text' },
                { name: 'building_subtitle', label: 'Subtítulo del edificio (ej. campus)', type: 'text' },
            ],
        },
        {
            type: 'collapsible',
            label: 'Ubicación',
            admin: { initCollapsed: true },
            fields: [
                { name: 'location_title', label: 'Título del bloque de ubicación', type: 'text' },
                { name: 'address_line1', label: 'Dirección — línea 1', type: 'text' },
                { name: 'address_line2', label: 'Dirección — línea 2', type: 'text' },
                { name: 'directions_button_label', label: 'Texto del botón "Cómo llegar"', type: 'text' },
            ],
        },
        {
            type: 'collapsible',
            label: 'Contacto',
            admin: { initCollapsed: true },
            fields: [
                { name: 'contact_title', label: 'Título del bloque de contacto', type: 'text' },
                { name: 'phone', label: 'Teléfono', type: 'text' },
                { name: 'email', label: 'Correo de contacto', type: 'text' },
                { name: 'contact_button_label', label: 'Texto del botón "Contactar"', type: 'text' },
            ],
        },
    ],
}
