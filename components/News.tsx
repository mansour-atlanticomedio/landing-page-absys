'use client'

import { useEffect, useState } from 'react'
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
    const maxCards = Math.max(1, visible_cards || 1);
    const [perPage, setPerPage] = useState(maxCards);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Menos tarjetas por pantalla en móvil y tablet
    useEffect(() => {
        const update = () => {
            const width = window.innerWidth;
            setPerPage(width < 640 ? 1 : width < 1024 ? Math.min(2, maxCards) : maxCards);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [maxCards]);

    const totalSlides = Math.max(1, Math.ceil(items.length / perPage));
    const isCarousel = totalSlides > 1;
    const slide = Math.min(currentIndex, totalSlides - 1);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const prevSlide = () => {
        setCurrentIndex(slide === 0 ? totalSlides - 1 : slide - 1);
    };

    const nextSlide = () => {
        setCurrentIndex(slide === totalSlides - 1 ? 0 : slide + 1);
    };

    const visibleItems = items.slice(slide * perPage, slide * perPage + perPage);

    return (
        <section id="noticias" className="bg-background py-10 scroll-mt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-6 flex items-end justify-between gap-4 sm:mb-10">
                    {title != null && title != '' &&
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-primary sm:text-3xl">
                            {title}
                        </h2>
                    }
                    {isCarousel && (
                        <div className="flex shrink-0 gap-2">
                            <button
                                onClick={prevSlide}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${slide}-${perPage}`}
                            drag={isCarousel ? 'x' : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60) nextSlide()
                                else if (info.offset.x > 60) prevSlide()
                            }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{ gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))` }}
                            className="grid gap-4 sm:gap-6"
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

                {isCarousel && (
                    <div className="mt-6 flex justify-center">
                        {Array.from({ length: totalSlides }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                className="flex h-8 items-center justify-center px-1"
                                aria-label={`Ir a slide ${i + 1}`}
                            >
                                <span className={`block h-2 rounded-full transition-all ${i === slide
                                    ? 'w-6 bg-primary'
                                    : 'w-2 bg-accent/40'
                                    }`} />
                            </button>
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
            <a href={link} className="block h-full">
                <article className="group flex h-[23rem] flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg sm:h-[25rem]">
                    <div className="h-44 shrink-0 overflow-hidden bg-linear-to-br sm:h-52 from-primary/30 via-primary/10 to-accent/20" >
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        )}
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{tag}</span>
                        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary">{title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{description}</p>
                    </div>
                </article>

            </a>
        );
    }

    // Estilo 1: Diseño con imagen redondeada (flotante) y sin tag visible
    if (style === 1) {
        return (
            <a href={link} className="block h-full">
                <article className="group flex h-[23rem] flex-col overflow-hidden rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-md sm:h-[26rem] sm:p-6">
                    <div className="mb-4 h-44 shrink-0 rounded-lg sm:h-52 bg-linear-to-br from-accent/30 to-primary/20 overflow-hidden">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        )}
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground">{title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{description}</p>
                </article>
            </a>
        );
    }

    if (style === 2) {
        return (
            <a href={link} className="block h-full">
                <article className="group flex h-[26rem] w-full flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:bg-accent/5 md:h-60 md:flex-row md:items-center">
                    <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg md:h-full bg-linear-to-br from-primary/20 to-accent/30 md:w-60">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                        )}
                    </div>
                    <div className="min-h-0 overflow-hidden">
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">{tag}</span>
                        <h3 className="mt-3 line-clamp-2 text-lg font-bold text-foreground sm:text-xl group-hover:text-primary">{title}</h3>
                        <p className="mt-2 line-clamp-3 text-muted-foreground">{description}</p>
                    </div>
                </article>
            </a>
        );
    }

    if (style === 3) {
        return (
            <a href={link} className="block h-full">
                <article className="group relative h-64 sm:h-80 bg-slate-900 rounded-xl overflow-hidden">
                    {/* Capa de "Imagen" de fondo */}
                    <div className="absolute inset-0 overflow-hidden bg-linear-to-t from-black via-black/40 to-transparent opacity-80">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={title || "Noticia"}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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