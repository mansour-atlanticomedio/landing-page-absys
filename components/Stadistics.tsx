import { iconMap } from "@/lib/utils"

interface StatisticsProps {
    icon: any,
    value: string,
    description: string
}

interface StatisticsBoxProps {
    id?: any,
    stats: StatisticsProps[]
}

export default function Stadistics({ id, stats }: StatisticsBoxProps) {

    return (
        <section className="bg-primary/90 text-primary-foreground py-14">
            <div className="max-w-6xl mx-auto px-6 flex justify-around items-center gap-8">
                {stats.map(({ icon, value, description }, index) => {
                    const IconComponent = iconMap[icon]
                    return (
                        <div key={id && index} className="icon-tile flex flex-col justify-center items-center">
                            <IconComponent className="w-12 h-12 text-accent mb-3" strokeWidth={1.5} />
                            <div className="text-3xl font-display font-bold text-primary-foreground">{value}</div>
                            <div className="uppercase text-xs tracking-widest mt-1 text-primary-foreground/80">{description}</div>
                        </div>
                    )
                }
                )}
            </div>
        </section>
    )
}