import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Lightbulb, Briefcase, BookOpen, Microscope } from "lucide-react";

export default function Feature() {

    const features = [
        {
            icon: Lightbulb,
            title: "Transferencia de conocimiento",
            text: " Impulsar la investigación y la innovación universitaria mediante el intercambio de experiencias, proyectos y buenas prácticas",
        },
        {
            icon: Briefcase,
            title: "Colaboración público-privada",
            text: "Promover la transferencia del conocimiento y la colaboración entre universidades, instituciones y profesionales",
        },
        {
            icon: BookOpen,
            title: "Innovación docente",
            text: "Reflexionar sobre los retos actuales de la educación en ámbitos como la inteligencia artificial, la innovación docente y la transformación digital",
        },
        {
            icon: Microscope,
            title: "Ciencia abierta",
            text: "Favorecer la creación de redes académicas y oportunidades de colaboración interdisciplinar e interinstitucional",
        },
    ];

    return (
        <section className="bg-secondary py-20">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="section-title">Ejes estratégicos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {features.map(({ icon: Icon, title, text }) => (
                        <Card key={title} className="border-border hover:shadow-(--shadow-card) transition-shadow duration-300 bg-background">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}