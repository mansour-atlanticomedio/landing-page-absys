import type { Block } from 'payload'
import { appIcons } from '@/collections/Icons'

export const RulesCardsBlock: Block = {
    slug: 'rules_cards_block',
    interfaceName: 'RulesCardsBlock',
    labels: { singular: 'Tarjetas de normativa', plural: 'Tarjetas de normativa' },
    fields: [
        {
            name: 'cards',
            label: 'Tarjetas',
            type: 'array',
            maxRows: 6,
            admin: { description: 'Hasta 6 tarjetas con las normas principales.', initCollapsed: true },
            fields: [
                { name: 'icon', label: 'Icono', type: 'select', options: appIcons, required: true },
                { name: 'title', label: 'Título', type: 'text', required: true },
                {
                    name: 'badge',
                    label: 'Etiqueta (opcional)',
                    type: 'text',
                    admin: { description: 'Ej. "Próximamente". Se muestra como insignia en la tarjeta.' },
                },
                { name: 'description', label: 'Descripción', type: 'textarea' },
                {
                    name: 'points',
                    label: 'Lista de puntos',
                    type: 'array',
                    admin: { initCollapsed: true },
                    fields: [{ name: 'text', label: 'Texto', type: 'text', required: true }],
                },
                { name: 'note_title', label: 'Título de la nota destacada', type: 'text' },
                { name: 'note_text', label: 'Texto de la nota destacada', type: 'textarea' },
            ],
        },
    ],
}
