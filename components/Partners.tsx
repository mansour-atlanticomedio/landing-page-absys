interface PartnersProps {
    name: string,
    image?: any
    link: string;
}

interface PartnersBoxProps {
    title?: string;
    partners_item: PartnersProps[];
}

export default function Partners ({ partners_item } : PartnersBoxProps) {

    return (
        <section className="bg-background py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex justify-center items-center gap-20">
                    {partners_item.map((p, index) => {
                        const imageUrl = typeof p.image === 'object' ? p.image?.url : p.image;

                        return (
                            <a
                                key={index}
                                href={p.link || "#"}
                                className="flex-1 relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-6 text-center transition hover:border-primary hover:shadow-md"
                            >
                                {imageUrl ? (
                                    <>
                                        <img 
                                            src={imageUrl} 
                                            alt={p.name || "Partner"} 
                                            className="absolute inset-0 h-full w-full object-cover p-4 transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </>
                                ) : (
                                    <span className="text-sm font-bold text-primary">
                                        {p.name || "Partner"}
                                    </span>
                                )}
                            </a>
                        );
                    })}
                </div>
                <div className="mt-10 h-px w-full bg-accent/40" />
            </div>
        </section>
    );
}