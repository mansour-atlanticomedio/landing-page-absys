'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChartColumn, Cookie, Megaphone, Settings2, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  ACCEPT_ALL,
  CONSENT_CHANGED_EVENT,
  OPEN_COOKIE_SETTINGS_EVENT,
  REJECT_ALL,
  buildConsent,
  consentCookieString,
  readConsentFromCookieString,
  type ConsentCategories,
  type ConsentRecord,
  type OptionalCategory,
} from '@/lib/consent'
import { BASE_PATH } from '@/lib/auth/redirects'

type Props = { policyHref?: string }

const CATEGORIES: { key: OptionalCategory; title: string; description: string; icon: typeof Cookie }[] = [
  {
    key: 'preferencias',
    title: 'Cookies de preferencias o personalización',
    description:
      'Permiten recordar información para que accedas al servicio con determinadas características personalizadas (como el idioma, tamaño de letra, configuración regional o visualización adaptada).',
    icon: SlidersHorizontal,
  },
  {
    key: 'analiticas',
    title: 'Cookies analíticas o de medición',
    description:
      'Nos ayudan a comprender cómo interactúan los usuarios con la web mediante la recopilación y comunicación anónima de estadísticas de uso, permitiendo medir y mejorar la calidad del servicio bibliotecario.',
    icon: ChartColumn,
  },
  {
    key: 'marketing',
    title: 'Cookies de publicidad o marketing',
    description:
      'Se utilizan para gestionar espacios publicitarios e informativos de forma eficaz, creando perfiles de navegación y adaptando contenido a tus intereses en la web.',
    icon: Megaphone,
  },
]

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'border-accent bg-accent' : 'bg-[hsl(var(--muted))]',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

export default function CookieConsent({ policyHref }: Props) {
  const [ready, setReady] = useState(false)
  const [record, setRecord] = useState<ConsentRecord | null>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'config'>('main')
  const [draft, setDraft] = useState<ConsentCategories>(REJECT_ALL)

  useEffect(() => {
    const current = readConsentFromCookieString(document.cookie)
    setRecord(current)
    setOpen(current === null)
    setReady(true)
  }, [])

  useEffect(() => {
    const openSettings = () => {
      setDraft(readConsentFromCookieString(document.cookie)?.categorias ?? REJECT_ALL)
      setView('config')
      setOpen(true)
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings)
  }, [])

  const save = useCallback((categorias: ConsentCategories) => {
    const next = buildConsent(categorias)
    document.cookie = consentCookieString(next, BASE_PATH, window.location.protocol === 'https:')
    setRecord(next)
    setOpen(false)
    setView('main')
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }))
  }, [])

  const goConfig = () => {
    setDraft(record?.categorias ?? REJECT_ALL)
    setView('config')
  }

  const closeConfig = () => {
    if (record) setOpen(false)
    setView('main')
  }

  if (!ready) return null

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          if (view === 'config') closeConfig()
        }}
        onInteractOutside={(e) => e.preventDefault()}
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-5 overflow-hidden rounded-xl bg-background p-6 sm:max-w-3xl md:p-8"
      >
        {view === 'main' ? (
          <>
            <div className="flex items-center gap-2 border-b border-border pb-2 text-primary">
              <Cookie className="size-6 text-accent" aria-hidden />
              <DialogTitle className="font-display text-xl font-bold">Política de Cookies</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-foreground">
              Este sitio web de la Universidad del Atlántico Medio utiliza cookies propias y de terceros, que almacenan y recuperan
              información cuando navegas. Las cookies pueden tener finalidades diversas, por ejemplo, reconocerte como usuario, obtener
              información sobre tus hábitos de navegación, respetando tu privacidad, o personalizar la forma en que se muestra el
              contenido. Puedes elegir las cookies que deseas o aceptarlas todas o rechazarlas todas. Este banner se mantendrá activo
              hasta que elijas una de las tres opciones. Para obtener información más detallada, puedes acceder a nuestra{' '}
              {policyHref ? (
                <a href={policyHref} className="font-semibold text-accent underline transition-colors hover:text-accent/90">
                  Política de cookies
                </a>
              ) : (
                'Política de cookies'
              )}
              .
            </DialogDescription>
            <div className="flex flex-col items-stretch justify-end gap-3 border-t border-border pt-3 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" className="h-10 px-5" onClick={goConfig}>
                Configurar cookies
              </Button>
              <Button type="button" variant="outline" className="h-10 border-foreground/40 px-5" onClick={() => save(REJECT_ALL)}>
                Rechazar todas
              </Button>
              <Button type="button" className="h-10 bg-accent px-6 font-bold text-white hover:bg-accent/90" onClick={() => save(ACCEPT_ALL)}>
                Aceptar todas
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Settings2 className="size-7 text-accent" aria-hidden />
                <div>
                  <DialogTitle className="font-display text-xl font-bold">Preferencias de Cookies</DialogTitle>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Universidad del Atlántico Medio</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Cerrar configuración" onClick={closeConfig}>
                <X className="size-5" />
              </Button>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-foreground">
              Gestiona tus preferencias de consentimiento para las diferentes categorías de cookies que utilizamos en nuestro portal.
              Puedes habilitar o deshabilitar cada categoría según tus preferencias, excepto las estrictamente necesarias. Para más
              detalles, consulta nuestra{' '}
              {policyHref ? (
                <a href={policyHref} className="font-semibold text-accent underline transition-colors hover:text-accent/90">
                  Política de cookies
                </a>
              ) : (
                'Política de cookies'
              )}
              .
            </DialogDescription>
            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
              <div className="flex flex-col gap-1 rounded-xl border border-border bg-[hsl(var(--muted))] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="size-5 text-primary" aria-hidden />
                    <h3 className="font-display text-base font-bold">Cookies técnicas o estrictamente necesarias</h3>
                  </div>
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Siempre activas
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Son aquellas indispensables para el funcionamiento correcto de la web, la seguridad, la navegación básica y la gestión
                  de sesiones. No se pueden desactivar en nuestros sistemas.
                </p>
              </div>
              {CATEGORIES.map(({ key, title, description, icon: Icon }) => (
                <div key={key} className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon className="size-5 text-accent" aria-hidden />
                      <h3 className="font-display text-base font-bold">{title}</h3>
                    </div>
                    <Switch checked={draft[key]} onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))} label={title} />
                  </div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border pt-3 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" className="h-10 border-foreground/40 px-5" onClick={() => save(REJECT_ALL)}>
                Rechazar opcionales
              </Button>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="button" variant="outline" className="h-10 px-5" onClick={() => save(ACCEPT_ALL)}>
                  Aceptar todas
                </Button>
                <Button type="button" className="h-10 bg-accent px-6 font-bold text-white hover:bg-accent/90" onClick={() => save(draft)}>
                  Guardar preferencias
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
