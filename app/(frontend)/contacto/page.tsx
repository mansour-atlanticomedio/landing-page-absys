'use client'

import { useState } from "react";
import { toast } from "sonner";
import SimpleForm from "@/components/SimpleForm";
import { SimpleFormProps } from "@/types/form.type";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactProps } from "@/types/contact.type";
// import { sendMessage } from "@/services/api.service";
import Hero from "@/components/Hero";

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);
        // const data: ContactProps = {
        //   name: fd.get("name").toString(),
        //   email: fd.get("email").toString(),
        //   about: fd.get("about").toString(),
        //   message: fd.get("message").toString(),

        try {
            setLoading(true);
            //   await sendMessage(data);
            setLoading(false);
            toast.success("Mensaje enviado. Te responderemos lo antes posible");
        } catch (error: any) {
            toast.error("Error al enviar el mensaje ", error);
        }
    };


    const formEntries: SimpleFormProps[] = [
        {
            label: 'name',
            htmlFor: 'Nombre',
            isRequired: true
        },
        {
            label: 'email',
            htmlFor: 'Email',
            isRequired: true
        },
        {
            label: 'about',
            htmlFor: 'Asunto',
            isRequired: true
        },
        {
            label: 'message',
            htmlFor: 'Mensaje',
            isTextArea: true,
        },
    ]

    return (
        <>
            <Hero title="Contacto" subtitle="Estamos a tu disposición para resolver cualquier duda" image={'/images/app/hero-jornadas.jpg'} />

            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                    <div>
                        <div className="flex flex-col gap-4 mb-4" >
                            <div className="w-full flex justify-start " >
                                <h3 className="section-title text-xl after:ml-0" >Universidad del Atlántico Medio</h3>
                            </div>

                            <h4>La UNAM es una universidad privada en Las Palmas de Gran Canaria con un fuerte
                                compromiso con la investigación, la innovación y la transferencia de conocimiento
                                al tejido empresarial y social canario</h4>
                        </div>
                        <div>
                            <ul className="space-y-5">
                                <li className="flex gap-4">
                                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Dirección</div>
                                        <div className="text-muted-foreground text-sm">Carretera de Quílmes, 37 · 35017 Tafira Baja · Las Palmas de Gran Canaria</div>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Teléfono</div>
                                        <a href="tel:+34828019019" className="text-muted-foreground text-sm hover:text-accent">+34 828 019 019</a>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Email</div>
                                        <a href="'mailto:investigacion@atlanticomedio.es?subject=Mensaje Jornadas de Investigación" className="text-muted-foreground text-sm hover:text-accent">investigacion@atlanticomedio.es</a>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Horario</div>
                                        <div className="text-muted-foreground text-sm">Lunes a viernes · 9:00 – 18:00</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <SimpleForm title="Envíanos un mensaje" formEntries={formEntries} onSubmit={onSubmit} loading={loading} />

                </div>
            </section>
        </>
    )
}
