"use client"

import { useMemo, useState } from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { lexicalToPlainText } from "@/lib/rich-text"

type Faq = { id?: string; question?: string | null; answer?: any }

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export function FaqSection({ block }: { block: any }) {
  const faq = block?.faq
  const [query, setQuery] = useState("")

  const items: Faq[] = useMemo(
    () => (faq && typeof faq === "object" ? (faq.faqs ?? []).filter((f: Faq) => f?.question) : []),
    [faq],
  )

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    return items.filter((f) => normalize(`${f.question} ${lexicalToPlainText(f.answer)}`).includes(q))
  }, [items, query])

  if (!items.length) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: lexicalToPlainText(f.answer) },
    })),
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faq.title && <h2 className="section-title text-start after:ml-0 mb-6">{faq.title}</h2>}

      {block.show_search && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en las preguntas"
            aria-label="Buscar en las preguntas frecuentes"
            className="h-11 pl-9"
          />
          <p aria-live="polite" className="sr-only">
            {query ? `${visible.length} resultados` : ""}
          </p>
        </div>
      )}

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
          No hay preguntas que coincidan con "{query}". Prueba con otras palabras o consulta con un bibliotecario.
        </p>
      ) : (
        <Accordion
          key={query}
          type="single"
          collapsible
          defaultValue={block.open_first && !query ? "faq-0" : query ? "faq-0" : undefined}
          className="rounded-lg border"
        >
          {visible.map((f, i) => (
            <AccordionItem key={f.id ?? i} value={`faq-${i}`} className="px-4">
              <AccordionTrigger className="text-base font-display font-bold text-primary">{f.question}</AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm max-w-none text-slate-700">
                  {f.answer && <RichText data={f.answer} />}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  )
}
