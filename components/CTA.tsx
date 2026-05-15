import { Button } from "@/components/ui/button";

export default function CTA() {

  const cta_button: string = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=XY9FITLOIEKpKiuDNuULSADr381rgy1HsyQ7GPxGWOpUMDNUMFIwV0JJM05ZR1VFR1c3UDFMRFhMMS4u&route=shorturl'

    return (
        <section className="bg-accent text-accent-foreground py-16 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
          Forma parte del ecosistema I+D+i
        </h2>
        <p className="mb-8 text-accent-foreground/90">Reserva tu plaza en estas Jornadas 2026 de la Universidad del Atlántico Medio.</p>
        <Button asChild size="lg" variant="outline" className="border-2 border-accent-foreground text-accent-foreground bg-transparent hover:bg-accent-foreground hover:text-accent uppercase tracking-wider">
           <a href={cta_button}>Inscríbete</a>
        </Button>
      </div>
    </section>
    )
}