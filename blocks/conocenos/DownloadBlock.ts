import type { Block } from 'payload'

export const DownloadBlock: Block = {
    slug: 'download_block',
    interfaceName: 'DownloadBlock',
    labels: { singular: 'Descarga de documento', plural: 'Descargas de documentos' },
    fields: [
        { name: 'button_label', label: 'Texto del botón', type: 'text', admin: { description: 'Ej. "Descargar normativa completa (PDF)".' } },
        {
            name: 'file',
            label: 'Documento PDF',
            type: 'upload',
            relationTo: 'media',
            admin: { description: 'Si no hay documento, el botón no se muestra.' },
        },
    ],
}
