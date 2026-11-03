import type { Field, GlobalConfig } from 'payload'
import { sectionGlobal } from '@/lib/access'
import { DEFAULT_COOKIE_TEXTS, type CookieTexts } from '@/lib/cookie-texts'

const text = <G extends keyof CookieTexts>(
  group: G,
  name: keyof CookieTexts[G] & string,
  label: string,
  opts: { long?: boolean; description?: string } = {},
): Field => {
  const base = {
    name,
    label,
    required: true as const,
    defaultValue: (DEFAULT_COOKIE_TEXTS[group] as Record<string, string>)[name],
    ...(opts.description ? { admin: { description: opts.description } } : {}),
  }
  return opts.long ? { ...base, type: 'textarea' } : { ...base, type: 'text' }
}

export const CookieTextsGlobal: GlobalConfig = {
  slug: 'cookies',
  label: 'Textos de cookies',
  admin: {
    group: 'Configuración del sitio',
    description:
      'Textos del aviso de cookies y de su ventana de preferencias. Si dejas un campo vacío se usa el texto por defecto.',
  },
  access: sectionGlobal('navegacion'),
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Aviso inicial',
          fields: [
            {
              name: 'banner',
              label: 'Aviso inicial',
              type: 'group',
              fields: [
                text('banner', 'title', 'Título'),
                text('banner', 'tagline', 'Frase bajo el título'),
                text('banner', 'text', 'Texto', {
                  long: true,
                  description: 'Termina justo antes del enlace a la política de cookies (el punto final se añade solo).',
                }),
                text('banner', 'link_label', 'Texto del enlace a la política', {
                  description: 'El enlace sale del campo "Política de cookies" del pie de página.',
                }),
                text('banner', 'button_configure', 'Botón: configurar'),
                text('banner', 'button_reject_all', 'Botón: rechazar todas'),
                text('banner', 'button_accept_all', 'Botón: aceptar todas'),
              ],
            },
          ],
        },
        {
          label: 'Preferencias',
          fields: [
            {
              name: 'preferences',
              label: 'Configuración detallada',
              type: 'group',
              fields: [
                text('preferences', 'title', 'Título'),
                text('preferences', 'subtitle', 'Subtítulo'),
                text('preferences', 'text', 'Texto', {
                  long: true,
                  description: 'Termina justo antes del enlace a la política de cookies (el punto final se añade solo).',
                }),
                text('preferences', 'link_label', 'Texto del enlace a la política'),
                text('preferences', 'close_label', 'Etiqueta del botón de cerrar (lectores de pantalla)'),
                text('preferences', 'technical_title', 'Técnicas: título'),
                text('preferences', 'technical_text', 'Técnicas: descripción', { long: true }),
                text('preferences', 'technical_badge', 'Técnicas: etiqueta'),
                text('preferences', 'preferencias_title', 'Preferencias: título'),
                text('preferences', 'preferencias_text', 'Preferencias: descripción', { long: true }),
                text('preferences', 'analiticas_title', 'Analíticas: título'),
                text('preferences', 'analiticas_text', 'Analíticas: descripción', { long: true }),
                text('preferences', 'marketing_title', 'Publicidad: título'),
                text('preferences', 'marketing_text', 'Publicidad: descripción', { long: true }),
                text('preferences', 'counter_none', 'Contador: ninguna opcional activa'),
                text('preferences', 'counter_some', 'Contador: alguna opcional activa', {
                  description: 'Usa {n} donde debe ir el número de categorías activas.',
                }),
                text('preferences', 'button_reject_optional', 'Botón: rechazar opcionales'),
                text('preferences', 'button_accept_all', 'Botón: aceptar todas'),
                text('preferences', 'button_save', 'Botón: guardar preferencias'),
              ],
            },
          ],
        },
        {
          label: 'Mensajes',
          fields: [
            {
              name: 'messages',
              label: 'Avisos tras elegir',
              type: 'group',
              fields: [
                text('messages', 'accepted', 'Al aceptar'),
                text('messages', 'saved', 'Al guardar preferencias'),
                text('messages', 'rejected', 'Al rechazar'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
