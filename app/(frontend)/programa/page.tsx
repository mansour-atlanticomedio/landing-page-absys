import Hero from '@/components/Hero'
import { Button } from '@/components/ui/button'
import Timeline from '@/components/Timeline'
import Speakers from '@/components/Speakers'
import CTA from '@/components/CTA'
import '../styles.css'

import { getClient } from '@/lib/payload'


export default async function HomePage() {
  const cta_button: string = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=XY9FITLOIEKpKiuDNuULSADr381rgy1HsyQ7GPxGWOpUMDNUMFIwV0JJM05ZR1VFR1c3UDFMRFhMMS4u&route=shorturl'
  
  return (
    <>
      <Hero
        title="Programa"
        subtitle="Accede a informacion sobre la jornada"
        image={'/images/app/hero-jornadas.jpg'}
      >
        <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary uppercase tracking-wider">
          <a href={cta_button}>Inscríbete</a>
        </Button>
      </Hero>

      <Timeline />

      <Speakers />

      <CTA />
    </>

  )
}
