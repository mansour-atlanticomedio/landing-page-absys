import type { Block } from 'payload'

export const NoticeBlock: Block = {
    slug: 'notice_block',
    interfaceName: 'NoticeBlock',
    labels: { singular: 'Aviso', plural: 'Avisos' },
    fields: [
        { name: 'title', label: 'Título', type: 'text' },
        { name: 'text', label: 'Texto', type: 'textarea' },
    ],
}
