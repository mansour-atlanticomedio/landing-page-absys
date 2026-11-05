import type { Block } from 'payload'

export const TableBlock: Block = {
    slug: 'table_block',
    interfaceName: 'TableBlock',
    labels: { singular: 'Tabla', plural: 'Tablas' },
    fields: [
        { name: 'title', label: 'Título (opcional)', type: 'text' },
        {
            name: 'columns',
            label: 'Columnas',
            labels: { singular: 'Columna', plural: 'Columnas' },
            type: 'array',
            minRows: 1,
            maxRows: 8,
            admin: {
                description: 'Encabezados de la tabla, de izquierda a derecha.',
                components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'label', singular: 'Columna' } } },
            },
            fields: [{ name: 'label', label: 'Encabezado', type: 'text', required: true }],
        },
        {
            name: 'rows',
            label: 'Filas',
            labels: { singular: 'Fila', plural: 'Filas' },
            type: 'array',
            admin: { description: 'Cada fila lleva una celda por columna, en el mismo orden.' },
            fields: [
                {
                    name: 'cells',
                    label: 'Celdas',
                    labels: { singular: 'Celda', plural: 'Celdas' },
                    type: 'array',
                    maxRows: 8,
                    admin: { components: { RowLabel: { path: '/components/admin/ItemRowLabel', clientProps: { field: 'text', singular: 'Celda' } } } },
                    fields: [{ name: 'text', label: 'Texto', type: 'text' }],
                },
            ],
        },
    ],
}
