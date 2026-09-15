import type { GlobalConfig } from "payload";

export const HorariosContacto: GlobalConfig = {
    slug: 'horarios_contacto',
    label: 'Horarios, Ubicación y Contacto',
    fields: [
        {
            name: 'hero',
            label: 'Seccion Principal',
            type: 'relationship',
            relationTo: 'hero',
            hasMany: false,
        },
        {
            name: 'edificio_nombre',
            label: 'Nombre del edificio',
            type: 'text',
        },
        {
            name: 'edificio_subtitulo',
            label: 'Subtítulo del edificio (ej. campus)',
            type: 'text',
        },
        {
            name: 'horario',
            label: 'Horario de atención',
            type: 'relationship',
            relationTo: 'schedule',
            hasMany: false,
        },
        {
            name: 'direccion_linea1',
            label: 'Dirección — línea 1',
            type: 'text',
        },
        {
            name: 'direccion_linea2',
            label: 'Dirección — línea 2',
            type: 'text',
        },
        {
            name: 'telefono',
            label: 'Teléfono',
            type: 'text',
        },
        {
            name: 'email',
            label: 'Correo de contacto',
            type: 'text',
        },
        {
            name: 'mapa_url',
            label: 'Enlace "Cómo llegar" (Google Maps)',
            type: 'text',
        },
        {
            name: 'mapa_embed_url',
            label: 'URL del iframe embed del mapa',
            type: 'text',
        },
        {
            name: 'ayuda_cta',
            label: '¿Necesitas ayuda adicional? (CTA)',
            type: 'relationship',
            relationTo: 'cta',
            hasMany: false,
        },
    ],
}
