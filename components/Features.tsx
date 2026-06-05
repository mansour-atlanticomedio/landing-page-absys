import { Card, CardContent } from "@/components/ui/card";
import { iconMap } from "@/lib/utils";

interface FeatureProps {
    icon: string,
    title: string,
    description: string
}

interface FeatureBoxProps {
    title: string,
    feature: FeatureProps[]
}

export default function Features({ title, feature : features }: FeatureBoxProps ) {

    return (
        <section className="bg-secondary my-10">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="section-title">{title}</h2>
                <div className="flex justify-center items-center gap-6 mt-12">
                    {features.map(({ icon, title, description }, index) => {
                        const IconComponent = iconMap[icon]
                        return (
                        <Card key={title+index} className="border-[1px] border-gray-300 hover:shadow-(--shadow-card) transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                                    <IconComponent className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </CardContent>
                        </Card>
                    )})}
                </div>
            </div>
        </section>
    )
}