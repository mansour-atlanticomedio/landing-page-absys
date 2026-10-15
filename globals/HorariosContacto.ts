import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";

export const HorariosContacto: GlobalConfig = {
    slug: 'horarios_contacto',
    admin: {
        group: 'Páginas',
        description: 'Página de horarios, ubicación y contacto: edificio, horario, dirección y mapa.'
    },
    access: adminOnlyGlobal,
    label: 'Horarios, Ubicación y Contacto',
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Cabecera',
                    admin: { description: 'Sección principal de la página.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Seccion Principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                    ],
                },
                {
                    label: 'Edificio y horario',
                    admin: { description: 'Nombre del edificio y horario de atención.' },
                    fields: [
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
                    ],
                },
                {
                    label: 'Contacto y dirección',
                    admin: { description: 'Dirección postal, teléfono y correo.' },
                    fields: [
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
                    ],
                },
                {
                    label: 'Mapa',
                    admin: { description: 'Enlace y mapa incrustado de ubicación.' },
                    fields: [
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
                    ],
                },
                {
                    label: 'Ayuda',
                    admin: { description: 'Llamada a la acción de ayuda adicional.' },
                    fields: [
                        {
                            name: 'ayuda_cta',
                            label: '¿Necesitas ayuda adicional? (CTA)',
                            type: 'relationship',
                            relationTo: 'cta',
                            hasMany: false,
                        },
                    ],
                },
            ],
        },
    ],
}
