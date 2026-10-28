'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  title: string
  description: string
  image?: any
}

interface HeroCarrouselProps {
  title?: string
  items: CarouselItem[]
  autoPlayInterval?: number
}

const SLIDE_EASE = [0.65, 0, 0.35, 1] as const

// Entra y sale a la vez (sin esperar), así nunca queda un hueco entre un slide y el siguiente
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-35%' : '35%' }),
}

export default function HeroCarrousel({ title, items, autoPlayInterval = 5000 }: HeroCarrouselProps) {
  const [[currentIndex, direction], setSlide] = useState<[number, number]>([0, 1])
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback((index: number, dir: number) => {
    setSlide(([prev]) => (index === prev ? [prev, 1] : [index, dir]))
  }, [])

  const nextSlide = useCallback(() => {
    setSlide(([prev]) => [prev === items.length - 1 ? 0 : prev + 1, 1])
  }, [items.length])

  const prevSlide = useCallback(() => {
    setSlide(([prev]) => [prev === 0 ? items.length - 1 : prev - 1, -1])
  }, [items.length])

  // Las imágenes se precargan para que al entrar un slide nunca aparezca el hueco mientras descarga
  useEffect(() => {
    items.forEach(item => {
      const url = typeof item.image === 'object' ? item.image?.url : item.image
      if (url) {
        const img = new window.Image()
        img.src = url
      }
    })
  }, [items])

  useEffect(() => {
    if (items.length <= 1 || isPaused) return
    const interval = setInterval(nextSlide, autoPlayInterval)
    return () => clearInterval(interval)
  }, [items.length, isPaused, autoPlayInterval, nextSlide])

  if (items.length === 0) return null

  const current = items[currentIndex]
  const imageUrl = typeof current.image === 'object' ? current.image?.url : current.image

  return (
    <section
      className="relative min-h-105 md:min-h-130 flex items-end overflow-hidden bg-primary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1, ease: SLIDE_EASE }}
          drag={items.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) nextSlide()
            else if (info.offset.x > 80) prevSlide()
          }}
          className="absolute inset-0 will-change-transform"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={current.title+" hero carousel"}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/40 via-primary/10 to-accent/30">
              <span className="text-6xl md:text-8xl font-bold text-primary/20">
                {current.title?.charAt(0) || 'N'}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white/50 transition hover:text-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white/50 transition hover:text-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 md:pb-24">
        {title && (
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/80">
            {title}
          </h2>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.35, ease: SLIDE_EASE } }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40, transition: { duration: 0.35, ease: 'easeIn' } }}
            className="max-w-3xl"
          >
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl">
              {current.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <div className="mt-8 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
