import { Users, Globe, Briefcase } from "lucide-react";

export default function Stadistics() {
    const stats = [
        { icon: Users, value: "416", label: "Asistentes previstos" },
        { icon: Briefcase, value: "30+", label: "Grupos de investigación" },
        { icon: Globe, value: "12", label: "Mesas y talleres" }
    ];

    return (
        <section className="bg-primary/90 text-primary-foreground py-14">
            <div className="max-w-6xl mx-auto px-6 flex justify-around items-center gap-8">
                {stats.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="icon-tile">
                        <Icon className="w-12 h-12 text-accent mb-3" strokeWidth={1.5} />
                        <div className="text-3xl font-display font-bold text-primary-foreground">{value}</div>
                        <div className="uppercase text-xs tracking-widest mt-1 text-primary-foreground/80">{label}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}