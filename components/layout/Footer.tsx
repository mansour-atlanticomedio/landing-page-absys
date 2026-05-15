import { Mail, Phone, MapPin, CircleArrowUp } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import logo_white from "@/public/logos/logo_white.png";
import Image from "next/image";

export default function Footer() {

  const socialmedias: { icon: any, link: string }[] = [
    {
      icon: FaFacebook,
      link: 'https://www.facebook.com/UniversidadAtlanticoMedioUNAM/'
    },
    {
      icon: FaTwitter,
      link: 'https://twitter.com/atlanticomedio'
    },
    {
      icon: FaInstagram,
      link: 'https://www.instagram.com/atlanticomedio/'
    },
    {
      icon: FaLinkedin,
      link: 'https://www.linkedin.com/school/15138255?pathWildcard=15138255'
    },
    {
      icon: FaYoutube,
      link: 'https://www.youtube.com/@universidaddelatlanticomed'
    },
  ]

  return (
    <footer className="bg-primary text-primary-foreground bottom-0" >
      <div className="max-w-7xl my-36 mx-14 grid md:grid-cols-3 gap-10">
        <div>
          <a href="https://www.universidadatlanticomedio.es/">
            <Image
              src={logo_white}
              alt="UNAMED"
              width={130}
            />
          </a>
          <p className="text-sm text-primary-foreground/80 leading-relaxed mt-2">
            Puedes encontrarnos en:
          </p>
          <div className="flex gap-3 mt-5">
            {socialmedias.map((socialmedia, i) => {
              const IconComponent = socialmedia.icon;

              return (
                <a
                  key={i}
                  href={socialmedia.link}
                  className="w-9 h-9 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-primary-foreground font-display uppercase tracking-wider text-sm mb-4">Te puede interesar</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a className="hover:text-accent" href="https://www.universidadatlanticomedio.es/planestudios">Nuestros estudios</a></li>
            <li><a className="hover:text-accent" href="https://www.universidadatlanticomedio.es/candidaturas/candidatura">Trabaja con nosotros</a></li>
            <li><a className="hover:text-accent" href="https://www.universidadatlanticomedio.es/universidad/normativa">Normativa</a></li>
            <li><a className="hover:text-accent" href="https://www.universidadatlanticomedio.es/home/buzonsugerencias">Buzón de Sugerencias</a></li>
            <li><a className="hover:text-accent" href="https://canaletico.atlanticomedio.es/">Canal Ético</a></li>
            <li><a className="hover:text-accent" href="https://universidadatlanticomedio.es/static/documentos/PlandeIgualdad.pdf">Plan de Igualdad</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-primary-foreground font-display uppercase tracking-wider text-sm mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-accent" /><a href="tel:828019019"> +34 828 019 019</a></li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-accent" /> <a href="https://www.universidadatlanticomedio.es/home/contact">Directorio de correos</a></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-accent" /><a href="https://goo.gl/maps/DLD3Z7SyD5683gUd7"> Carretera de Quílmes, 37 · 35017 Tafira Baja · Las Palmas de Gran Canaria</a></li>
          </ul>
        </div>
      </div>
      <div className="bg-topbar text-center text-sm py-5 flex justify-around relative">
        <p>
          Todos los derechos reservados.
        </p>
        <p>
          <a href="https://www.universidadatlanticomedio.es/home/avisolegal">Aviso Legal</a> · <a href="https://www.universidadatlanticomedio.es/home/politicaprivacidad">Política de Privacidad</a> · <a href="https://www.universidadatlanticomedio.es/home/politicacookies">Política de Cookies</a>
        </p>
        <a href="#top-arrow">
          <CircleArrowUp className="absolute right-10" />
        </a>

      </div>
    </footer>
  )
}