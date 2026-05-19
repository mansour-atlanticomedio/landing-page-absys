import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Plus } from "lucide-react"

interface FaqProps {
    question: string,
    answer: any
}

interface FaqBoxProps {
    title: string,
    faqs: FaqProps[]
}

export default function FAQ({title, faqs} : FaqBoxProps) {

    return (
        <section className="p-16 flex flex-col gap-10" >

            <h2 className="section-title text-start after:ml-0" > {title} </h2>

            <div className="flex flex-col gap-6" >
                {
                    faqs.map((faq, index) => (
                        <Accordion key={index} type="multiple" className="border-2 p-2" >
                            <AccordionItem value="item-1" >
                                <AccordionTrigger className="flex gap-2 items-center" >
                                    <Plus className="text-accent" size={20} />
                                    <h2>{faq.question}</h2>
                                </AccordionTrigger>
                                <AccordionContent
                                    className="mt-4" >
                                    <div className="prose prose-sm max-w-none text-gray-700">
                                        <RichText data={faq.answer} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    ))}
            </div>
        </section>
    )
}