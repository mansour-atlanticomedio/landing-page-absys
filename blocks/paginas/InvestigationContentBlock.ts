import type { Block } from 'payload'
import { appIcons } from '@/collections/Icons'

const rowLabel = (field: string, singular: string) => ({
    components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field, singular } } },
})

export const InvestigationContentBlock: Block = {
    slug: 'investigation_content_block',
    interfaceName: 'InvestigationContentBlock',
    labels: { singular: 'Contenido de Investigación', plural: 'Contenido de Investigación' },
    fields: [
        { name: 'quick_title', label: 'Accesos rápidos: título', type: 'text' },
        {
            name: 'quick',
            label: 'Accesos rápidos',
            labels: { singular: 'Acceso', plural: 'Accesos' },
            type: 'array',
            maxRows: 6,
            admin: rowLabel('title', 'Acceso'),
            fields: [
                { name: 'icon', label: 'Icono', type: 'select', options: appIcons, required: true },
                { name: 'title', label: 'Título', type: 'text', required: true },
            ],
        },
        {
            name: 'cards',
            label: 'Tarjetas de contenido',
            labels: { singular: 'Tarjeta', plural: 'Tarjetas' },
            type: 'array',
            maxRows: 8,
            admin: rowLabel('title', 'Tarjeta'),
            fields: [
                { name: 'icon', label: 'Icono', type: 'select', options: appIcons, required: true },
                { name: 'title', label: 'Título', type: 'text', required: true },
                { name: 'description', label: 'Descripción', type: 'textarea' },
                { name: 'cta', label: 'Texto del enlace', type: 'text' },
                { name: 'link', label: 'Enlace', type: 'text' },
            ],
        },
        { name: 'support_title', label: 'Solicitar apoyo: título', type: 'text' },
        { name: 'support_text', label: 'Solicitar apoyo: texto', type: 'textarea' },
        { name: 'support_button_label', label: 'Solicitar apoyo: texto del botón', type: 'text' },
        { name: 'support_button_link', label: 'Solicitar apoyo: enlace del botón', type: 'text' },
    ],
}
