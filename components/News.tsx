interface NewsProps {
    tag: string,
    title: string,
    description: string,
    image?: any
}

interface NewsBoxProps {
    style: '0' | '1' | '2' | '3',
    newsItems: NewsProps[]
}

export default function News({ style, newsItems }: NewsBoxProps ) {
    const styleType = parseInt(style ?? '0', 10);

    return (
        <section id="noticias" className="bg-background py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex items-end justify-between">
                    <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
                        Noticias
                    </h2>
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">
                        Ver todas las noticias →
                    </a>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Cambiado de news.map a newsItems.map */}
                    {newsItems?.map((item, index) => (
                        <NewsCard 
                            key={item.title + index} 
                            noticia={item} 
                            styleType={styleType} 
                        />
                    ))}
                </div>

                <div className="mt-10 h-px w-full bg-accent/40" />
            </div>
        </section>
    );
}

// Componente para gestionar los diferentes estilos de carta
function NewsCard({ noticia, styleType }: { noticia: any, styleType: number }) {
    const { tag, title, desc } = noticia;

    // Estilo 0: Diseño con imagen superior pegada al borde y tag superior
    if (styleType === 0) {
        return (
            <article className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg">
                <div className="h-44 bg-linear-to-br from-primary/30 via-primary/10 to-accent/20" />
                <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{tag}</span>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-foreground group-hover:text-primary">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
            </article>
        );
    }

    // Estilo 1: Diseño con imagen redondeada (flotante) y sin tag visible
    if (styleType === 1) {
        return (
            <article className="rounded-lg border border-border bg-card p-6 transition hover:border-primary hover:shadow-md">
                <div className="mb-4 h-36 rounded-md bg-linear-to-br from-accent/30 to-primary/20" />
                <h3 className="text-lg font-bold leading-snug text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </article>
        );
    }

    if (styleType === 2) {
        return (
            <article className="group flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:bg-accent/5 md:flex-row md:items-center">
                <div className="h-40 w-full shrink-0 rounded-lg bg-linear-to-br from-primary/20 to-accent/30 md:w-60" />
                <div>
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">{tag}</span>
                    <h3 className="mt-3 text-xl font-bold text-foreground group-hover:text-primary">{title}</h3>
                    <p className="mt-2 text-muted-foreground">{desc}</p>
                </div>
            </article>
        );
    }

    if (styleType === 3) {
        return (
            <article className="group relative h-80 overflow-hidden rounded-2xl bg-slate-900">
                {/* Capa de "Imagen" de fondo */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-linear-to-br from-primary/40 to-accent/40 opacity-30 transition-opacity group-hover:opacity-50" />
                
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-xs font-medium text-primary-foreground/80">{tag}</span>
                    <h3 className="mt-2 text-xl font-bold text-white line-clamp-2">{title}</h3>
                    <p className="mt-2 text-sm text-slate-200 opacity-0 transition-all duration-300 group-hover:opacity-100">{desc}</p>
                </div>
            </article>
        );
    }

    // Estilo por defecto por si el número no coincide
    return null;
}