interface BlogItemProps {
    date: string;
    title: string;
    blog: string;
}

interface BlogBoxProps {
    title: string;
    blogItems: BlogItemProps[];
}

export default function Blogs({ title, blogItems: blogs }: BlogBoxProps) {
    return (
        <section className="bg-secondary py-20">
            <div className="mx-auto max-w-7xl px-6">
                {/* Título dinámico usando la clase global 'section-title' de tu referencia */}
                <h2 className="section-title mb-10">{title}</h2>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogs?.map((b, index) => (
                        <article key={b.title + index} className="border-b border-border pb-5">
                            <div className="text-xs font-bold tracking-widest text-muted-foreground">
                                {b.date}
                            </div>
                            <h3 className="mt-2 text-lg font-bold leading-snug text-primary hover:underline">
                                <a href="#">{b.title}</a>
                            </h3>
                            <div className="mt-2 text-sm italic text-muted-foreground">
                                {b.blog}
                            </div>
                        </article>
                    ))}
                </div>
                
                <div className="mt-10 text-right">
                    <a href="#" className="text-sm font-semibold text-primary hover:underline">
                        Ver todos los artículos →
                    </a>
                </div>
            </div>
        </section>
    );
}