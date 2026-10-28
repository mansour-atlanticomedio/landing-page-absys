import type { GlobalConfig } from "payload";
import { adminOnlyGlobal } from "@/lib/access";
import { enlaceFields } from "@/collections/fields/enlace";

export const ElectronicResources: GlobalConfig = {
    slug: 'electronic_resources',
    admin: {
        group: 'Páginas',
        description: 'Página de recursos electrónicos: cabecera, acceso remoto y recursos por tipo.'
    },
    access: sectionGlobal('paginas'),
    label: 'Recursos Electrónicos',
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Cabecera y accesos',
                    description: 'Cabecera de la página y tarjetas de accesos directos destacados.',
                    fields: [
                        {
                            name: 'hero',
                            label: 'Sección principal',
                            type: 'relationship',
                            relationTo: 'hero',
                            hasMany: false
                        },
                        {
                            name: 'accesos_destacados',
                            label: 'Accesos Directos Destacados',
                            type: 'relationship',
                            relationTo: 'electronic_resources_access',
                            hasMany: false
                        },
                        {
                            name: 'accesos_titulo',
                            label: 'Título de los accesos destacados',
                            type: 'text',
                            admin: { description: 'Encabezado que aparece encima de las tarjetas de accesos directos.' }
                        },
                    ]
                },
                {
                    label: 'Acceso remoto',
                    description: 'Cómo entrar a los recursos desde fuera del campus y botón de ayuda.',
                    fields: [
                        {
                            name: 'acceso_remoto',
                            label: 'Identificación y acceso remoto',
                            type: 'group',
                            admin: { description: 'Bloque que explica cómo entrar a los recursos desde fuera del campus.' },
                            fields: [
                                { name: 'titulo', label: 'Título', type: 'text' },
                                { name: 'descripcion', label: 'Descripción', type: 'textarea' },
                                {
                                    name: 'puntos',
                                    label: 'Puntos con check',
                                    labels: { singular: 'Punto', plural: 'Puntos' },
                                    type: 'array',
                                    admin: { description: 'Frases cortas que se muestran con un check verde.' },
                                    fields: [
                                        { name: 'texto', label: 'Texto', type: 'text', required: true },
                                    ]
                                },
                                { name: 'portal_titulo', label: 'Título de la tarjeta del portal', type: 'text' },
                                { name: 'portal_descripcion', label: 'Descripción de la tarjeta del portal', type: 'textarea' },
                                { name: 'portal_boton_texto', label: 'Texto del botón', type: 'text' },
                                {
                                    name: 'portal_boton_enlace',
                                    label: 'Enlace del botón',
                                    type: 'text',
                                    defaultValue: '/login',
                                    admin: { description: 'Ruta de la web (por ejemplo /login) o dirección completa que empiece por http.' }
                                },
                            ]
                        },
                        {
                            name: 'problema_acceso',
                            label: 'Botón de problema de acceso',
                            type: 'group',
                            admin: { description: 'Botón al final de la página. Si no tiene texto, no se muestra.' },
                            fields: [
                                { name: 'texto', label: 'Texto del botón', type: 'text' },
                                ...enlaceFields({ defaultTipo: 'registro' }),
                            ]
                        },
                    ]
                },
                {
                    label: 'Recursos por tipo',
                    description: 'Sección con pestañas: bases de datos, libros electrónicos, multimedia...',
                    fields: [
                        {
                            name: 'categorias_titulo',
                            label: 'Título de la sección por tipo',
                            type: 'text',
                            admin: { description: 'Encabezado de la sección con pestañas (por ejemplo "Recursos por tipo").' }
                        },
                        {
                            name: 'categorias',
                            label: 'Categorías de recursos',
                            labels: { singular: 'Categoría', plural: 'Categorías' },
                            type: 'array',
                            admin: { description: 'Cada categoría es una pestaña. Si no hay ninguna con recursos, la sección no aparece.' },
                            fields: [
                                { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                                {
                                    name: 'recursos',
                                    label: 'Recursos',
                                    labels: { singular: 'Recurso', plural: 'Recursos' },
                                    type: 'array',
                                    fields: [
                                        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                                        { name: 'descripcion', label: 'Descripción', type: 'text' },
                                        {
                                            name: 'acceso',
                                            label: 'Tipo de acceso',
                                            type: 'select',
                                            defaultValue: 'subscription',
                                            options: [
                                                { label: 'Suscripción', value: 'subscription' },
                                                { label: 'Acceso abierto', value: 'open' },
                                            ]
                                        },
                                        {
                                            name: 'enlace',
                                            label: 'Enlace',
                                            type: 'text',
                                            admin: { description: 'Opcional. Si se rellena, el nombre del recurso se convierte en enlace.' }
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
    ]
}
