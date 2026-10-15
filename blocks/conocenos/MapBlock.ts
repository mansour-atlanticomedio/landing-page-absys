import type { Block } from 'payload'

export const MapBlock: Block = {
    slug: 'map_block',
    interfaceName: 'MapBlock',
    labels: { singular: 'Mapa', plural: 'Mapas' },
    fields: [
        { name: 'title', label: 'Título', type: 'text' },
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
}
