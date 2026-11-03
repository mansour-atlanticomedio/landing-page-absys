'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { toast } from 'sonner'
import { Check, ChartColumn, Cookie, Megaphone, Settings2, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
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
        'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        checked ? 'border-accent bg-accent' : 'border-border bg-[hsl(var(--muted))]',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 32 }}
        className={cn(
          'absolute top-0.5 flex size-5.5 items-center justify-center rounded-full bg-background shadow-sm',
          checked ? 'right-0.5' : 'left-0.5',
        )}
      >
        <AnimatePresence initial={false}>
          {checked && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              className="flex"
            >
              <Check className="size-3.5 text-accent" strokeWidth={3} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  )
}

const CRUMB_COUNT = 10

function Crumbs({ burst }: { burst: number }) {
  const crumbs = useMemo(
    () =>
      Array.from({ length: CRUMB_COUNT }, (_, i) => {
        const angle = (i / CRUMB_COUNT) * Math.PI * 2 + Math.random() * 0.6
        const distance = 36 + Math.random() * 34
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 14,
          size: 4 + Math.round(Math.random() * 4),
          tone: i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-accent' : 'bg-accent/60',
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst],
  )
  if (burst === 0) return null
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {crumbs.map((c, i) => (
        <motion.span
          key={`${burst}-${i}`}
          className={cn('absolute rounded-full', c.tone)}
          style={{ width: c.size, height: c.size }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: c.x, y: [0, c.y, c.y + 28], opacity: [1, 1, 0], scale: [1, 1.1, 0.6] }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      ))}
    </span>
  )
}

function AutoHeight({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const inner = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <motion.div
      animate={{ height }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
      className="min-h-0 overflow-hidden"
    >
      <div ref={inner} className="flex flex-col gap-5">
        {children}
      </div>
    </motion.div>
  )
}

export default function CookieConsent({ policyHref }: Props) {
  const [ready, setReady] = useState(false)
  const [record, setRecord] = useState<ConsentRecord | null>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'main' | 'config'>('main')
  const [draft, setDraft] = useState<ConsentCategories>(REJECT_ALL)
  const [closing, setClosing] = useState(false)
  const [burst, setBurst] = useState(0)
  const reduced = useReducedMotion() ?? false

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

  const save = useCallback(
    (categorias: ConsentCategories, message: string, celebrate = false) => {
      const next = buildConsent(categorias)
      document.cookie = consentCookieString(next, BASE_PATH, window.location.protocol === 'https:')
      window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }))
      if (celebrate && !reduced) setBurst((n) => n + 1)
      setClosing(true)
      window.setTimeout(
        () => {
          setRecord(next)
          setOpen(false)
          setView('main')
          setClosing(false)
          toast.success(message)
        },
        reduced ? 0 : celebrate ? 520 : 240,
      )
    },
    [reduced],
  )

  const goConfig = () => {
    setDraft(record?.categorias ?? REJECT_ALL)
    setView('config')
  }

  const closeConfig = () => {
    if (record) setOpen(false)
    setView('main')
  }

  if (!ready) return null

  const activeCount = Object.values(draft).filter(Boolean).length
  const slide = reduced ? 0 : 24
  const stagger = (i: number) => ({ initial: { opacity: 0, y: reduced ? 0 : 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: reduced ? 0 : 0.05 * i, duration: 0.25 } })

  const policyLink = policyHref ? (
    <a href={policyHref} className="font-semibold text-accent underline underline-offset-2 transition-colors hover:text-accent/80">
      Política de cookies
    </a>
  ) : (
    'Política de cookies'
  )

  const btn = 'h-10 px-5 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]'

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          if (view === 'config') closeConfig()
        }}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl bg-background p-0 shadow-2xl sm:max-w-3xl"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
          animate={closing ? { opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.97 } : { opacity: 1, y: 0, scale: 1 }}
          transition={closing ? { duration: 0.22, ease: 'easeIn' } : { type: 'spring', stiffness: 320, damping: 26 }}
          className="relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-6 md:p-8"
        >
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-accent/10 blur-2xl" />
          <AutoHeight reduced={reduced}>
            <AnimatePresence mode="wait" initial={false}>
              {view === 'main' ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: -slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slide }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-5"
                >
                  <motion.div {...stagger(0)} className="flex items-center gap-3 border-b border-border pb-3 text-primary">
                    <motion.span
                      initial={reduced ? false : { rotate: -30, scale: 0.4 }}
                      animate={{ rotate: 0, scale: 1 }}
                      whileHover={reduced ? undefined : { rotate: [0, -14, 12, -8, 0], transition: { duration: 0.6 } }}
                      transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }}
                      className="flex size-11 items-center justify-center rounded-full bg-accent/10"
                    >
                      <Cookie className="size-6 text-accent" aria-hidden />
                    </motion.span>
                    <div>
                      <DialogTitle className="font-display text-xl font-bold leading-tight">Política de Cookies</DialogTitle>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Las galletas, mejor con leche… y con tu permiso.</p>
                    </div>
                  </motion.div>
                  <motion.div {...stagger(1)}>
                    <DialogDescription className="text-sm leading-relaxed text-foreground">
                      Este sitio web de la Universidad del Atlántico Medio utiliza cookies propias y de terceros, que almacenan y
                      recuperan información cuando navegas. Las cookies pueden tener finalidades diversas, por ejemplo, reconocerte
                      como usuario, obtener información sobre tus hábitos de navegación, respetando tu privacidad, o personalizar la
                      forma en que se muestra el contenido. Puedes elegir las cookies que deseas o aceptarlas todas o rechazarlas
                      todas. Este banner se mantendrá activo hasta que elijas una de las tres opciones. Para obtener información más
                      detallada, puedes acceder a nuestra {policyLink}.
                    </DialogDescription>
                  </motion.div>
                  <motion.div
                    {...stagger(2)}
                    className="flex flex-col items-stretch justify-end gap-3 border-t border-border pt-4 sm:flex-row sm:items-center"
                  >
                    <Button type="button" variant="outline" className={btn} onClick={goConfig}>
                      Configurar cookies
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(btn, 'border-foreground/40')}
                      onClick={() => save(REJECT_ALL, 'Entendido: sin cookies opcionales.')}
                    >
                      Rechazar todas
                    </Button>
                    <span className="relative">
                      <Button
                        type="button"
                        className={cn(btn, 'w-full bg-accent px-6 font-bold text-white hover:bg-accent/90')}
                        onClick={() => save(ACCEPT_ALL, '¡Genial! Cookies aceptadas.', true)}
                      >
                        Aceptar todas
                      </Button>
                      <Crumbs burst={burst} />
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slide }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-start justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3 text-primary">
                      <motion.span
                        initial={reduced ? false : { rotate: -90, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        whileHover={reduced ? undefined : { rotate: 90 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                        className="flex size-11 items-center justify-center rounded-full bg-accent/10"
                      >
                        <Settings2 className="size-6 text-accent" aria-hidden />
                      </motion.span>
                      <div>
                        <DialogTitle className="font-display text-xl font-bold leading-tight">Preferencias de Cookies</DialogTitle>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Universidad del Atlántico Medio</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Cerrar configuración"
                      className="transition-transform duration-200 hover:rotate-90"
                      onClick={closeConfig}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                  <DialogDescription className="text-sm leading-relaxed text-foreground">
                    Gestiona tus preferencias de consentimiento para las diferentes categorías de cookies que utilizamos en nuestro
                    portal. Puedes habilitar o deshabilitar cada categoría según tus preferencias, excepto las estrictamente
                    necesarias. Para más detalles, consulta nuestra {policyLink}.
                  </DialogDescription>
                  <div className="flex max-h-[min(380px,45dvh)] flex-col gap-3 overflow-y-auto pr-1">
                    <motion.div {...stagger(0)} className="flex flex-col gap-1 rounded-xl border border-border bg-[hsl(var(--muted))] p-4">
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
                        Son aquellas indispensables para el funcionamiento correcto de la web, la seguridad, la navegación básica y la
                        gestión de sesiones. No se pueden desactivar en nuestros sistemas.
                      </p>
                    </motion.div>
                    {CATEGORIES.map(({ key, title, description, icon: Icon }, i) => {
                      const on = draft[key]
                      return (
                        <motion.div
                          key={key}
                          {...stagger(i + 1)}
                          className={cn(
                            'flex flex-col gap-1 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                            on ? 'border-accent/60 bg-accent/5' : 'border-border bg-background',
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-primary">
                              <motion.span
                                key={String(on)}
                                initial={reduced ? false : { scale: 0.6, rotate: -15 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                                className="flex"
                              >
                                <Icon className={cn('size-5 transition-colors', on ? 'text-accent' : 'text-[hsl(var(--muted-foreground))]')} aria-hidden />
                              </motion.span>
                              <h3 className="font-display text-base font-bold">{title}</h3>
                            </div>
                            <Switch checked={on} onChange={(v) => setDraft((d) => ({ ...d, [key]: v }))} label={title} />
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                  <p aria-live="polite" className="text-center text-xs font-medium text-[hsl(var(--muted-foreground))]">
                    <motion.span key={activeCount} initial={reduced ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                      {activeCount === 0 ? 'Solo las técnicas, nada más.' : `${activeCount} de 3 opcionales activas`}
                    </motion.span>
                  </p>
                  <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(btn, 'border-foreground/40')}
                      onClick={() => save(REJECT_ALL, 'Entendido: sin cookies opcionales.')}
                    >
                      Rechazar opcionales
                    </Button>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Button type="button" variant="outline" className={btn} onClick={() => save(ACCEPT_ALL, '¡Genial! Cookies aceptadas.')}>
                        Aceptar todas
                      </Button>
                      <span className="relative">
                        <Button
                          type="button"
                          className={cn(btn, 'w-full bg-accent px-6 font-bold text-white hover:bg-accent/90')}
                          onClick={() => save(draft, '¡Listo! Preferencias guardadas.', true)}
                        >
                          Guardar preferencias
                        </Button>
                        <Crumbs burst={burst} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </AutoHeight>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
