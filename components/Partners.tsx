'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PartnersProps {
    name: string,
    image?: any
    link: string;
}

interface PartnersBoxProps {
    title?: string;
    partners_item: PartnersProps[];
}

const ITEMS_PER_SLIDE = 3;

export default function Partners ({ partners_item } : PartnersBoxProps) {
    const items = partners_item ?? [];
    const totalSlides = Math.max(1, Math.ceil(items.length / ITEMS_PER_SLIDE));
    const [currentIndex, setCurrentIndex] = useState(0);
    const isCarousel = items.length > ITEMS_PER_SLIDE;

    const prevSlide = () => {
        setCurrentIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const visibleItems = isCarousel
        ? items.slice(currentIndex * ITEMS_PER_SLIDE, currentIndex * ITEMS_PER_SLIDE + ITEMS_PER_SLIDE)
        : items;

    return (
        <section className="bg-background py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex items-end justify-between" >
                    <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
                        Portales y Herramientas
                    </h2>
                </div>

                <div className={isCarousel ? 'overflow-hidden' : 'flex justify-center items-center gap-20'}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={isCarousel ? 'flex justify-center gap-20' : 'contents'}
                        >
                            {visibleItems.map((p, index) => {
                                const imageUrl = typeof p.image === 'object' ? p.image?.url : p.image;

                                return (
                                    <a
                                        key={index}
                                        href={p.link || "#"}
                                        className="shrink-0 relative flex h-44 w-85 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-center transition hover:border-primary hover:shadow-md"
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={p.name || "Partner"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-primary">
                                                {p.name || "Partner"}
                                            </span>
                                        )}
                                    </a>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {isCarousel && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={prevSlide}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalSlides }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToSlide(i)}
                                    className={`h-2 rounded-full transition-all ${
                                        i === currentIndex
                                            ? 'w-6 bg-primary'
                                            : 'w-2 bg-accent/40'
                                    }`}
                                    aria-label={`Ir a slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}

                <div className="mt-10 h-px w-full bg-accent/40" />
            </div>
        </section>
    );
}