import SimpleForm from "@/components/SimpleForm";
import { SimpleFormProps } from "@/types/form.type";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Hero from "@/components/Hero";
import { getClient } from "@/lib/payload";

export default async function Contact() {

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

const payload = await getClient()
  const homepage = await payload.findGlobal({
    slug: 'contact' as never,
    draft: false,
    depth: 5
  }) as any

  const heroData = homepage?.hero
  const pageBlocks = homepage?.layout

  const pretitle = heroData?.pretitle || "Próximo Evento";
  const title = heroData?.title || "Bienvenidos a la Biblioteca";
  const subtitle = heroData?.subtitle || "Explora nuestros recursos y repositorios académicos.";
  const buttonText = heroData?.button_cta || "";
  const inputPlaceHolder = heroData?.input_placeholder || "";

  const imageUrl = heroData?.background_image && typeof heroData.background_image === 'object'
    ? heroData.background_image.url
    : '/images/app/campus.jpg';

  return (
    <>
      <Hero
        pretitle={pretitle}
        title={title}
        subtitle={subtitle}
        image={imageUrl}
        buttonText={buttonText}
        inputPlaceHolder={inputPlaceHolder}
      />

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

                    <SimpleForm title="Envíanos un mensaje" formEntries={formEntries} endpoint="/api/sendEmail" />

                </div>
            </section>
        </>
    )
}
