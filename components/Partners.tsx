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
        <section className="bg-background py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex items-end justify-between" >
                    <h2 className="flex items-center gap-3 text-3xl font-bold text-primary">
                        Portales y Herramientas
                    </h2>
                </div>
                <div className="flex justify-center items-center gap-20">
                    {partners_item.map((p, index) => {
                        const imageUrl = typeof p.image === 'object' ? p.image?.url : p.image;

                        return (
                            <a
                                key={index}
                                href={p.link || "#"}
                                className="flex-1 relative flex h-44 items-center justify-center overflow-hidden rounded-lg border border-border bg-card  text-center transition hover:border-primary hover:shadow-md"
                            >
                                {imageUrl ? (
                                    <>
                                        <img 
                                            src={imageUrl} 
                                            alt={p.name || "Partner"} 
                                            className="h-full w-full object-cover"
                                        />
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