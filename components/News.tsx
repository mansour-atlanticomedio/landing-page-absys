'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NewsProps {
    tag: string,
    link: string,
    title: string,
    description: string,
    image?: any
}

interface NewsBoxProps {
    title: string,
    visible_cards: number,
    style: '0' | '1' | '2' | '3',
    newsItems: NewsProps[]
}

export default function News({ title, visible_cards, style, newsItems }: NewsBoxProps) {
    const styleType = parseInt(style ?? '0', 10);
    const items = newsItems ?? [];
    const isCarousel = items.length >= visible_cards;
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalSlides = Math.max(1, Math.ceil(items.length / visible_cards));

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const visibleItems = isCarousel
        ? items.slice(currentIndex * visible_cards, currentIndex * visible_cards + visible_cards)
        : items;

    return (
        <section id="noticias" className="bg-background py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex items-end justify-between">
                    {title != null && title != '' &&
                        <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
                            {title}
                        </h2>
                    }
                    {isCarousel && totalSlides > 1 && (
                        <div className="flex gap-2">
                            <button
                                onClick={prevSlide}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className={isCarousel ? 'overflow-hidden' : `grid gap-6 grid-cols-${visible_cards}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{ gridTemplateColumns: `repeat(${visible_cards}, minmax(0, 1fr))` }}
                            className="grid gap-6"
                        >
                            {visibleItems.map((item, index) => (
                                <NewsCard
                                    key={item.title + index}
                                    new={item}
                                    style={styleType}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {isCarousel && totalSlides > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: totalSlides }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className={`h-2 rounded-full transition-all ${i === currentIndex
                                    ? 'w-6 bg-primary'
                                    : 'w-2 bg-accent/40'
                                    }`}
                                aria-label={`Ir a slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function NewsCard({ new: { tag, link, title, description, image }, style }: { new: NewsProps, style: number }) {
    const imageUrl = typeof image === 'object' ? image?.url : image;
    // Estilo 0: Diseño con imagen superior pegada al borde y tag superior
    if (style === 0) {
        return (
            <a href={link}>
                <article className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg">
                    <div className="h-52 bg-linear-to-br from-primary/30 via-primary/10 to-accent/20" >
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="p-5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{tag}</span>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary">{title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    </div>
                </article>

            </a>
        );
    }

    // Estilo 1: Diseño con imagen redondeada (flotante) y sin tag visible
    if (style === 1) {
        return (
            <a href={link}>
                <article className="rounded-lg border border-border bg-card p-6 transition hover:border-primary hover:shadow-md">
                    <div className="mb-4 h-52 rounded-lg bg-linear-to-br from-accent/30 to-primary/20 overflow-hidden">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-foreground">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </article>
            </a>
        );
    }

    if (style === 2) {
        return (
            <a href={link}>
                <article className="group w-full flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:bg-accent/5 md:flex-row md:items-center">
                    <div className="h-40 shrink-0 rounded-lg bg-linear-to-br from-primary/20 to-accent/30 md:w-60">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div >
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">{tag}</span>
                        <h3 className="mt-3 text-xl font-bold text-foreground group-hover:text-primary">{title}</h3>
                        <p className="mt-2 text-muted-foreground">{description}</p>
                    </div>
                </article>
            </a>
        );
    }

    if (style === 3) {
        return (
            <a href={link}>
                <article className="group relative h-80 overflow-hidden bg-slate-900">
                    {/* Capa de "Imagen" de fondo */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-accent/40 opacity-30 transition-opacity group-hover:opacity-50" />

                    {/* Contenido */}
                    <div className="absolute h-4/12 inset-0 flex flex-col justify-end px-6 py-2 mt-auto">

                        <div className='absolute bg-foreground z-0 opacity-80 w-full h-full inset-0' />
                        <div className='z-4 w-full h-full flex justify-start items-start' >
                            {/* { tag !== null && <span className="text-xs font-medium text-primary-foreground/80">{tag}</span>} */}
                            <h3 className="mt-4 text-xl font-bold text-white line-clamp-2">{title}</h3>
                            {/* <p className="text-sm text-slate-200 opacity-0 transition-all duration-300 group-hover:opacity-100">{description}</p> */}
                        </div>

                    </div>
                </article>

            </a>
        );
    }

    return null;
}