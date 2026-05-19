import { Button } from "@/components/ui/button";

interface CTAProps {
  title: string,
  subtitle: string,
  button_cta: string,
  button_link: string
}

export default function CTA({title, subtitle, button_cta, button_link } : CTAProps) {

    return (
        <section className="bg-accent text-accent-foreground py-16 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
          {title}
        </h2>
        <p className="mb-8 text-accent-foreground/90">{subtitle}</p>
        <Button asChild size="lg" variant="outline" className="border-2 border-accent-foreground text-accent-foreground bg-transparent hover:bg-accent-foreground hover:text-accent uppercase tracking-wider">
           <a href={button_link}>{button_cta}</a>
        </Button>
      </div>
    </section>
    )
}