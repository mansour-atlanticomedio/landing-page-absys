import { Mail, Phone, MapPin, CircleArrowUp } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import logo_white from "@/public/logos/logo_white.png";
import Image from "next/image";

export default function FooterSimple() {

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
    <footer className="flex flex-col items-center justify-center bg-primary text-primary-foreground bottom-0" >
      <div className="flex flex-col items-center justify-center max-w-7xl my-20 gap-10 text-center">
        <h2 className="text-white text-3xl font-bold">
          Servicio de Bibliotecas
        </h2>

        <div className="text-white space-y-1 text-sm md:text-base">
          <p>Carretera de Quílmes, 37 · 35017 Tafira Baja · Las Palmas de Gran Canaria</p>
          <p className="text-gray-400 font-medium">Horario de atención: L-V 9:00-14:00 h</p>
          <p> +34 828 019 019</p>
          <a
            href="mailto:biblioteca@atlanticomedio.es"
            className="italic hover:underline block mt-2 text-gray-400"
          >
            biblioteca@atlanticomedio.es
          </a>
        </div>
        <div className="flex gap-3">
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
    </footer>
  )
}