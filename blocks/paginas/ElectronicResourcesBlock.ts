import type { Block } from 'payload'
import { appIcons } from '@/collections/Icons'
import { enlaceFields } from '@/collections/fields/enlace'

const rowLabel = (field: string, singular: string) => ({
    components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field, singular } } },
})

export const ElectronicResourcesBlock: Block = {
    slug: 'eres_content_block',
    interfaceName: 'ElectronicResourcesContentBlock',
    labels: { singular: 'Contenido de Recursos electrónicos', plural: 'Contenido de Recursos electrónicos' },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Accesos destacados',
                    fields: [
                        { name: 'featured_title', label: 'Título de la sección', type: 'text' },
                        {
                            name: 'featured',
                            label: 'Accesos destacados',
                            labels: { singular: 'Acceso', plural: 'Accesos' },
                            type: 'array',
                            maxRows: 6,
                            admin: rowLabel('title', 'Acceso'),
                            fields: [
                                { name: 'icon', label: 'Icono', type: 'select', options: appIcons },
                                { name: 'title', label: 'Título', type: 'text', required: true },
                                { name: 'description', label: 'Descripción', type: 'textarea' },
                                { name: 'cta', label: 'Texto del enlace', type: 'text' },
                                { name: 'link', label: 'Enlace', type: 'text' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Acceso remoto',
                    fields: [
                        {
                            name: 'remote',
                            label: 'Acceso remoto',
                            type: 'group',
                            fields: [
                                { name: 'title', label: 'Título', type: 'text' },
                                { name: 'description', label: 'Descripción', type: 'textarea' },
                                {
                                    name: 'points',
                                    label: 'Puntos con check',
                                    labels: { singular: 'Punto', plural: 'Puntos' },
                                    type: 'array',
                                    admin: { ...rowLabel('text', 'Punto'), description: 'Frases cortas que se muestran con un check verde.' },
                                    fields: [{ name: 'text', label: 'Texto', type: 'text', required: true }],
                                },
                                { name: 'portal_title', label: 'Título de la tarjeta del portal', type: 'text' },
                                { name: 'portal_description', label: 'Descripción de la tarjeta del portal', type: 'textarea' },
                                { name: 'portal_button_label', label: 'Texto del botón', type: 'text' },
                                { name: 'portal_button_link', label: 'Enlace del botón', type: 'text' },
                            ],
                        },
                        {
                            name: 'problem',
                            label: 'Botón de problema de acceso',
                            type: 'group',
                            admin: { description: 'Botón al final de la página. Si no tiene texto, no se muestra.' },
                            fields: [{ name: 'text', label: 'Texto del botón', type: 'text' }, ...enlaceFields({ defaultTipo: 'registro' })],
                        },
                    ],
                },
                {
                    label: 'Recursos por tipo',
                    fields: [
                        {
                            name: 'categories_title',
                            label: 'Título de la sección por tipo',
                            type: 'text',
                            admin: { description: 'Encabezado de la sección con pestañas (por ejemplo "Recursos por tipo").' },
                        },
                        {
                            name: 'cats',
                            label: 'Categorías de recursos',
                            labels: { singular: 'Categoría', plural: 'Categorías' },
                            type: 'array',
                            admin: { ...rowLabel('name', 'Categoría'), description: 'Cada categoría es una pestaña. Si no hay ninguna con recursos, la sección no aparece.' },
                            fields: [
                                { name: 'name', label: 'Nombre', type: 'text', required: true },
                                {
                                    name: 'items',
                                    label: 'Recursos',
                                    labels: { singular: 'Recurso', plural: 'Recursos' },
                                    type: 'array',
                                    admin: rowLabel('name', 'Recurso'),
                                    fields: [
                                        { name: 'name', label: 'Nombre', type: 'text', required: true },
                                        { name: 'description', label: 'Descripción', type: 'text' },
                                        {
                                            name: 'access',
                                            label: 'Tipo de acceso',
                                            type: 'select',
                                            defaultValue: 'subscription',
                                            options: [
                                                { label: 'Suscripción', value: 'subscription' },
                                                { label: 'Acceso abierto', value: 'open' },
                                            ],
                                        },
                                        {
                                            name: 'link',
                                            label: 'Enlace',
                                            type: 'text',
                                            admin: { description: 'Opcional. Si se rellena, el nombre del recurso se convierte en enlace.' },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
