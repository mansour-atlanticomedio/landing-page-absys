import type { Block } from 'payload'

export const RichTextBlock: Block = {
    slug: 'rich_text_block',
    interfaceName: 'RichTextBlock',
    labels: { singular: 'Texto', plural: 'Textos' },
    fields: [
        { name: 'title', label: 'Título (opcional)', type: 'text' },
        { name: 'content', label: 'Texto', type: 'richText', required: true },
    ],
}
