"use client"

import { useMemo } from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useFaqSearch } from "./FaqSearch"
import { lexicalToPlainText } from "@/lib/rich-text"

type Faq = { id?: string; question?: string | null; answer?: any }

export function FaqSection({ block }: { block: any }) {
  const faq = block?.faq
  const search = useFaqSearch()

  const items: Faq[] = useMemo(
    () => (faq && typeof faq === "object" ? (faq.faqs ?? []).filter((f: Faq) => f?.question) : []),
    [faq],
  )

  const visible = search ? items.filter((f) => search.matches(f)) : items
  const searching = Boolean(search?.query.trim())

  if (!items.length || (searching && visible.length === 0)) return null

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
    <section className="mx-auto max-w-6xl px-6 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faq.title && <h2 className="section-subtitle text-start after:ml-0 mb-6">{faq.title}</h2>}

      <Accordion
          key={String(searching)}
          type="single"
          collapsible
          defaultValue={searching || block.open_first ? "faq-0" : undefined}
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
    </section>
  )
}
