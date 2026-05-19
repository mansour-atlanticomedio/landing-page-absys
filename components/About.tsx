import { RichText } from '@payloadcms/richtext-lexical/react'

interface AboutProps {
    title: string,
    article: any
}

export default function About({ title, article }: AboutProps) {
    return (
        <section className="py-20">
            <div className="container-narrow">
                <h2 className="section-title">{title}</h2>
                <article className="text-muted-foreground text-center mt-4 leading-relaxed text-lg flex flex-col gap-6" >
                    { article && <RichText data={article} /> }
                </article>
            </div>
        </section>

    )
}