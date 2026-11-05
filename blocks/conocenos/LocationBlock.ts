import type { Block } from 'payload'

export const LocationBlock: Block = {
    slug: 'location_block',
    interfaceName: 'LocationBlock',
    labels: { singular: 'Horario, contacto y mapa', plural: 'Horario, contacto y mapa' },
    fields: [
        {
            type: 'collapsible',
            label: 'Tarjeta de información',
            admin: { initCollapsed: false },
            fields: [
                { name: 'title', label: 'Título de la tarjeta', type: 'text', admin: { description: 'Ej. "Información general".' } },
                { name: 'schedule_title', label: 'Título del horario', type: 'text', admin: { description: 'Ej. "Horario de atención".' } },
                {
                    name: 'schedule',
                    label: 'Horario',
                    type: 'relationship',
                    relationTo: 'schedule',
                    hasMany: false,
                    admin: { description: 'Elige el horario que se mostrará en la tarjeta.' },
                },
            ],
        },
        {
            type: 'collapsible',
            label: 'Ubicación y contacto',
            admin: { initCollapsed: true },
            fields: [
                { name: 'location_title', label: 'Título de la ubicación', type: 'text' },
                { name: 'address_line1', label: 'Dirección — línea 1', type: 'text' },
                { name: 'address_line2', label: 'Dirección — línea 2', type: 'text' },
                { name: 'directions_button_label', label: 'Texto del botón "Cómo llegar"', type: 'text' },
                { name: 'contact_title', label: 'Título del contacto', type: 'text' },
                { name: 'phone', label: 'Teléfono', type: 'text' },
                { name: 'email', label: 'Correo de contacto', type: 'text' },
                { name: 'contact_button_label', label: 'Texto del botón "Contactar"', type: 'text' },
            ],
        },
        {
            type: 'collapsible',
            label: 'Imagen y mapa',
            admin: { initCollapsed: true },
            fields: [
                { name: 'image', label: 'Imagen del edificio', type: 'upload', relationTo: 'media' },
                { name: 'building_name', label: 'Nombre del edificio', type: 'text', admin: { description: 'Se muestra sobre la imagen.' } },
                { name: 'building_subtitle', label: 'Subtítulo del edificio (ej. campus)', type: 'text' },
                {
                    name: 'map_url',
                    label: 'Enlace "Cómo llegar" (Google Maps)',
                    type: 'text',
                    admin: { description: 'Dirección que se abre al pulsar el botón "Cómo llegar".' },
                },
                {
                    name: 'map_embed_url',
                    label: 'URL del mapa incrustado',
                    type: 'text',
                    admin: { description: 'URL del iframe que genera Google Maps en Compartir > Insertar un mapa.' },
                },
            ],
        },
    ],
}
