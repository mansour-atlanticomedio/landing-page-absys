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
            maxRows: 8,
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
    ],
}
