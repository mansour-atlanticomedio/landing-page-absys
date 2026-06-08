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

export default function HeroCarrousel({ title, items, autoPlayInterval = 5000 }: HeroCarrouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1))
  }, [items.length])

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1))
  }

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
      className="relative min-h-105 md:min-h-130 flex items-end overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={current.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/40 via-primary/10 to-accent/30">
              <span className="text-8xl font-bold text-primary/20">
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                onClick={() => setCurrentIndex(i)}
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
