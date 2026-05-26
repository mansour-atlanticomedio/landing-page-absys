import Hero from '@/components/Hero'
import '../styles.css'

const cta_button: string = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=XY9FITLOIEKpKiuDNuULSADr381rgy1HsyQ7GPxGWOpUMDNUMFIwV0JJM05ZR1VFR1c3UDFMRFhMMS4u&route=shorturl'


export default async function HomePage() {
  const cta_button: string = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=XY9FITLOIEKpKiuDNuULSADr381rgy1HsyQ7GPxGWOpUMDNUMFIwV0JJM05ZR1VFR1c3UDFMRFhMMS4u&route=shorturl'

  return (
    <>
      <Hero
        title="Programa"
        subtitle="Accede a informacion sobre la jornada"
        image={'/images/app/hero-jornadas.jpg'}
        buttonText="Inscríbete"
        toPage={cta_button}
      />

    </>

  )
}
