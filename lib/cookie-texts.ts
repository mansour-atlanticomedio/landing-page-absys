export type CookieTexts = {
  banner: {
    title: string
    tagline: string
    text: string
    link_label: string
    button_configure: string
    button_reject_all: string
    button_accept_all: string
  }
  preferences: {
    title: string
    subtitle: string
    text: string
    link_label: string
    close_label: string
    technical_title: string
    technical_text: string
    technical_badge: string
    preferencias_title: string
    preferencias_text: string
    analiticas_title: string
    analiticas_text: string
    marketing_title: string
    marketing_text: string
    counter_none: string
    counter_some: string
    button_reject_optional: string
    button_accept_all: string
    button_save: string
  }
  messages: {
    accepted: string
    saved: string
    rejected: string
  }
}

export const DEFAULT_COOKIE_TEXTS: CookieTexts = {
  banner: {
    title: 'Política de Cookies',
    tagline: 'Las galletas, mejor con leche… y con tu permiso.',
    text: 'Este sitio web de la Universidad del Atlántico Medio utiliza cookies propias y de terceros, que almacenan y recuperan información cuando navegas. Las cookies pueden tener finalidades diversas, por ejemplo, reconocerte como usuario, obtener información sobre tus hábitos de navegación, respetando tu privacidad, o personalizar la forma en que se muestra el contenido. Puedes elegir las cookies que deseas o aceptarlas todas o rechazarlas todas. Este banner se mantendrá activo hasta que elijas una de las tres opciones. Para obtener información más detallada, puedes acceder a nuestra',
    link_label: 'Política de cookies',
    button_configure: 'Configurar cookies',
    button_reject_all: 'Rechazar todas',
    button_accept_all: 'Aceptar todas',
  },
  preferences: {
    title: 'Preferencias de Cookies',
    subtitle: 'Universidad del Atlántico Medio',
    text: 'Gestiona tus preferencias de consentimiento para las diferentes categorías de cookies que utilizamos en nuestro portal. Puedes habilitar o deshabilitar cada categoría según tus preferencias, excepto las estrictamente necesarias. Para más detalles, consulta nuestra',
    link_label: 'Política de cookies',
    close_label: 'Cerrar configuración',
    technical_title: 'Cookies técnicas o estrictamente necesarias',
    technical_text: 'Son aquellas indispensables para el funcionamiento correcto de la web, la seguridad, la navegación básica y la gestión de sesiones. No se pueden desactivar en nuestros sistemas.',
    technical_badge: 'Siempre activas',
    preferencias_title: 'Cookies de preferencias o personalización',
    preferencias_text: 'Permiten recordar información para que accedas al servicio con determinadas características personalizadas (como el idioma, tamaño de letra, configuración regional o visualización adaptada).',
    analiticas_title: 'Cookies analíticas o de medición',
    analiticas_text: 'Nos ayudan a comprender cómo interactúan los usuarios con la web mediante la recopilación y comunicación anónima de estadísticas de uso, permitiendo medir y mejorar la calidad del servicio bibliotecario.',
    marketing_title: 'Cookies de publicidad o marketing',
    marketing_text: 'Se utilizan para gestionar espacios publicitarios e informativos de forma eficaz, creando perfiles de navegación y adaptando contenido a tus intereses en la web.',
    counter_none: 'Solo las técnicas, nada más.',
    counter_some: '{n} de 3 opcionales activas',
    button_reject_optional: 'Rechazar opcionales',
    button_accept_all: 'Aceptar todas',
    button_save: 'Guardar preferencias',
  },
  messages: {
    accepted: '¡Genial! Cookies aceptadas.',
    saved: '¡Listo! Preferencias guardadas.',
    rejected: 'Entendido: sin cookies opcionales.',
  },
}

export function resolveCookieTexts(data: unknown): CookieTexts {
  const source = (data ?? {}) as Record<string, Record<string, unknown> | undefined>
  const out = {} as Record<string, Record<string, string>>
  for (const [group, defaults] of Object.entries(DEFAULT_COOKIE_TEXTS)) {
    out[group] = {}
    for (const [key, fallback] of Object.entries(defaults as Record<string, string>)) {
      const value = source[group]?.[key]
      out[group][key] = typeof value === 'string' && value.trim() !== '' ? value : fallback
    }
  }
  return out as unknown as CookieTexts
}

export function formatActiveCount(template: string, n: number): string {
  return template.replace('{n}', String(n))
}
