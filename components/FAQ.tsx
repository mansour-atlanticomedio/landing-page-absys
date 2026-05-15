import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import ReactMarkdown from 'react-markdown';
import { Plus } from "lucide-react"

export default function FAQ() {

    const faqs: { question: string, answer: string }[] = [
        {
            question: "¿A quién van dirigidas?",
            answer: `- Profesorado universitario.
 - Equipos de gestión universitaria y responsables institucionales.
 - Profesionales de instituciones y organismos interesados en investigación e innovación.
 - Estudiantado de máster y doctorado.`
        },
        {
            question: "¿Cuando se celebran?",
            answer: `Las jornadas se celebran los días **16 y 17 de junio** de 9h a 14h en la **Universidad del Atlántico Medio**.`
        }
    ]

    return (
        <section className="p-16 flex flex-col gap-10" >

            <h2 className="section-title text-start after:ml-0" > FAQS </h2>

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
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ node, ...props }) => <span className="font-bold text-accent" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-accent hover:text-blue-700" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-4" {...props} />,
                                            }}
                                        >
                                            {faq.answer}
                                        </ReactMarkdown>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    ))}
            </div>
        </section>
    )
}