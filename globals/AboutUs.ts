import { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";
import { appIcons } from "@/collections/Icons";

export const AboutUs : GlobalConfig = {
    slug: 'about_us',
    admin: {
        group: 'Páginas',
        description: 'Sección Conócenos: Quiénes somos, Horarios y contacto, y Normativa.'
    },
    access: adminOnlyGlobal,
    label: "Conócenos",
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    name: 'quienes_somos',
                    label: 'Quiénes somos',
                    admin: { description: 'Página Quiénes somos: cabecera, imagen y tarjetas de servicios.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            name: 'imagen_dirigidos',
                            label: 'Imagen "A quién se dirigen nuestros servicios"',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'ayudas',
                            label: '¿Cómo podemos ayudarte?',
                            type: 'relationship',
                            relationTo: 'features',
                            hasMany: false,
                        },
                        {
                            name: 'dirigidos',
                            label: 'A quién se dirigen nuestros servicios',
                            type: 'relationship',
                            relationTo: 'features',
                            hasMany: false,
                        },
                    ],
                },
                {
                    name: 'horarios',
                    label: 'Horarios y contacto',
                    admin: { description: 'Página de horarios, ubicación y contacto.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            type: 'collapsible',
                            label: 'Edificio y horario',
                            admin: { initCollapsed: false },
                            fields: [
                                { name: 'info_titulo', label: 'Título del bloque de información', type: 'text' },
                                { name: 'edificio_nombre', label: 'Nombre del edificio', type: 'text' },
                                { name: 'edificio_subtitulo', label: 'Subtítulo del edificio (ej. campus)', type: 'text' },
                                { name: 'horario_titulo', label: 'Título del bloque de horario', type: 'text' },
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
                            type: 'collapsible',
                            label: 'Ubicación y contacto',
                            admin: { initCollapsed: true },
                            fields: [
                                { name: 'ubicacion_titulo', label: 'Título del bloque de ubicación', type: 'text' },
                                { name: 'direccion_linea1', label: 'Dirección — línea 1', type: 'text' },
                                { name: 'direccion_linea2', label: 'Dirección — línea 2', type: 'text' },
                                { name: 'contacto_titulo', label: 'Título del bloque de contacto', type: 'text' },
                                { name: 'telefono', label: 'Teléfono', type: 'text' },
                                { name: 'email', label: 'Correo de contacto', type: 'text' },
                                { name: 'boton_contactar', label: 'Texto del botón "Contactar"', type: 'text' },
                            ],
                        },
                        {
                            type: 'collapsible',
                            label: 'Mapa',
                            admin: { initCollapsed: true },
                            fields: [
                                { name: 'boton_como_llegar', label: 'Texto del botón "Cómo llegar"', type: 'text' },
                                { name: 'mapa_url', label: 'Enlace "Cómo llegar" (Google Maps)', type: 'text' },
                                { name: 'mapa_embed_url', label: 'URL del iframe embed del mapa', type: 'text' },
                            ],
                        },
                        {
                            name: 'ayuda_cta',
                            label: '¿Necesitas ayuda adicional? (CTA)',
                            type: 'relationship',
                            relationTo: 'cta',
                            hasMany: false,
                        },
                    ],
                },
                {
                    name: 'normativa',
                    label: 'Normativa',
                    admin: { description: 'Página de normativa y condiciones de uso.' },
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false,
                        },
                        {
                            name: 'tarjetas',
                            label: 'Tarjetas de normativa',
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
                                    name: 'puntos',
                                    label: 'Lista de puntos',
                                    type: 'array',
                                    admin: { initCollapsed: true },
                                    fields: [
                                        { name: 'texto', label: 'Texto', type: 'text', required: true },
                                    ],
                                },
                                { name: 'nota_titulo', label: 'Título de la nota destacada', type: 'text' },
                                { name: 'nota_texto', label: 'Texto de la nota destacada', type: 'textarea' },
                            ],
                        },
                        {
                            type: 'collapsible',
                            label: 'Responsabilidad sobre los materiales',
                            admin: { initCollapsed: true },
                            fields: [
                                { name: 'responsabilidad_titulo', label: 'Título', type: 'text' },
                                { name: 'responsabilidad_texto', label: 'Texto', type: 'textarea' },
                            ],
                        },
                        {
                            type: 'collapsible',
                            label: 'Descarga de la normativa',
                            admin: { initCollapsed: true },
                            fields: [
                                { name: 'pdf_texto_boton', label: 'Texto del botón de descarga', type: 'text' },
                                {
                                    name: 'pdf',
                                    label: 'Documento PDF (opcional)',
                                    type: 'upload',
                                    relationTo: 'media',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]
}
