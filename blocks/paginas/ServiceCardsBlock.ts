import type { Block } from 'payload'
import { SERVICE_ICON_OPTIONS } from '@/lib/service-icons'

export const ServiceCardsBlock: Block = {
    slug: 'service_cards_block',
    interfaceName: 'ServiceCardsBlock',
    labels: { singular: 'Tarjetas de servicios', plural: 'Tarjetas de servicios' },
    fields: [
        {
            name: 'cards',
            label: 'Servicios',
            labels: { singular: 'Servicio', plural: 'Servicios' },
            type: 'array',
            minRows: 1,
            maxRows: 14,
            admin: {
                components: {
                    RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'title', singular: 'Servicio' } },
                },
            },
            fields: [
                { name: 'icon', label: 'Icono', type: 'select', options: SERVICE_ICON_OPTIONS, defaultValue: 'Search', required: true },
                { name: 'title', label: 'Título', type: 'text', required: true },
                { name: 'text', label: 'Descripción', type: 'textarea', required: true },
                { name: 'badge', label: 'Etiqueta (opcional)', type: 'text', admin: { description: 'Ej. "Próximamente".' } },
                { name: 'action_label', label: 'Texto del botón (opcional)', type: 'text' },
                { name: 'action_href', label: 'Enlace del botón', type: 'text', admin: { description: 'Ruta de la web (/recursos/catalogo) o una URL completa.' } },
                { name: 'wide', label: 'Ocupar todo el ancho', type: 'checkbox', defaultValue: false },
            ],
        },
        {
            type: 'collapsible',
            label: 'Panel lateral: Mi cuenta',
            admin: { initCollapsed: true, description: 'El texto y el botón cambian según el lector haya iniciado sesión o no.' },
            fields: [
                { name: 'account_title', label: 'Título', type: 'text' },
                { name: 'account_text_in', label: 'Texto con sesión', type: 'textarea' },
                { name: 'account_text_out', label: 'Texto sin sesión', type: 'textarea' },
                { name: 'account_button_in', label: 'Botón con sesión', type: 'text' },
                { name: 'account_button_out', label: 'Botón sin sesión', type: 'text' },
            ],
        },
        {
            type: 'collapsible',
            label: 'Panel lateral: Solicitud de compra',
            admin: { initCollapsed: true },
            fields: [
                { name: 'show_suggestion', label: 'Mostrar este panel', type: 'checkbox', defaultValue: true },
                { name: 'suggestion_title', label: 'Título', type: 'text' },
                { name: 'suggestion_text', label: 'Texto', type: 'textarea' },
                { name: 'suggestion_button', label: 'Botón', type: 'text' },
                { name: 'suggestion_hint', label: 'Aviso sin sesión', type: 'text' },
            ],
        },
    ],
}
