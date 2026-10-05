import { Mail, Phone, MapPin, CircleArrowUp, Link } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import logo_white from "@/public/logos/logo_white.png";
import Image from "next/image";
import { ItemProps, PayloadImage, SocialMediaProps } from "@/types/common.type";
import { iconMap, iconsSocialMediaMap } from "@/lib/utils";

interface FooterProps {
  type?: string,
  logo?: PayloadImage | string,
  social_medias: SocialMediaProps[],
  seccion_info: InfoSection[],
  legal_advice: string,
  privacy_policie: string,
  privacy_cookies: string
}

interface InfoSection {
  title: string,
  information: ItemProps[]
}

interface PolicyProps {
  label: string,
  link: string
}

interface FooterTypeProps {
  type?: string,
  logo?: PayloadImage | string,
  social_medias: SocialMediaProps[],
  seccion_info: InfoSection[],
  title?: string,
  logoUrl?: string,
  logoAlt?: string,
  policies: PolicyProps[]
}

export default function Footer({ type, logo, social_medias, seccion_info, legal_advice, privacy_policie, privacy_cookies }: FooterProps) {

  const socialMedias = social_medias ?? []
  const seccionsInfo = seccion_info ?? []
  const logoUrl = typeof logo === "object" ? logo?.url : logo;
  const logoAlt = typeof logo === "object" ? logo?.alt : 'logo de fondo';

  const policies: PolicyProps[] = [
    {
      label: 'Aviso Legal',
      link: legal_advice
    },
    {
      label: 'Política de privacidad',
      link: privacy_policie
    },
    {
      label: 'Política de cookies',
      link: privacy_cookies
    }
  ]

  if (type == '0') return <FooterHorizontal logoUrl={logoUrl} logoAlt={logoAlt} social_medias={socialMedias} seccion_info={seccionsInfo} policies={policies} />
  if (type == '1') return <FooterVertical logoUrl={logoUrl} logoAlt={logoAlt} social_medias={socialMedias} seccion_info={seccionsInfo} policies={policies} />

}

function FooterHorizontal({ logoUrl, logoAlt, social_medias, seccion_info, policies }: FooterTypeProps) {

  return (
    <footer className="bg-primary text-primary-foreground bottom-0" >
      <div className="max-w-7xl my-36 mx-14 grid md:grid-cols-3 gap-10">
        <div>
          <a href="/biblioteca/">
            {logoUrl && logoUrl !== '' && (
              <Image
                src={logoUrl}
                alt={logoAlt + "  footer" || "footer logo"}
                width={130}
                height={70}
                className="object-cover object-[center_90%] -z-10"
              />
            )}
          </a>
          <p className="text-sm text-primary-foreground/80 leading-relaxed mt-2">
            Puedes encontrarnos en:
          </p>
          <div className="flex gap-3 mt-5">
            {social_medias.map(({ icon, link }, i) => {
              const IconComponent = iconsSocialMediaMap[icon] ?? Link

              return (
                <a
                  key={link + i}
                  href={link}
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

        {seccion_info.map((info, i) => (
          <div key={info.title + i} >
            <h4 className="text-primary-foreground font-display uppercase tracking-wider text-sm mb-4">{info.title}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              {info.information.map(({ icon, label, url }, i) => {
                const IconComponent = iconMap[icon]

                return <li key={label + i + url} className="flex items-start gap-2 hover:text-accent">
                  {
                    IconComponent &&
                    <IconComponent className="w-4 h-4 mt-0.5 text-accent" />
                  }
                  <a href={url}> {label}</a>
                </li>
              })
              }
            </ul>
          </div>
        ))}
      </div>


      <div className="bg-topbar text-center text-sm py-5 flex justify-around relative">
        <p>
          Todos los derechos reservados.
        </p>
        <div className="policies mb-4 flex gap-4">
          {
            policies.map(({ label, link }, i) => (
              <div key={i} className="flex">
                <a className="hover:underline mr-2" href={link}>{label}</a>
                {i < policies.length - 1 && "-"}
              </div>
            ))
          }
        </div>
        <a href="#top-arrow">
          <CircleArrowUp className="absolute right-10" />
        </a>
      </div>
    </footer>
  )
}

function FooterVertical({ title, logoUrl, logoAlt, social_medias, seccion_info, policies }: FooterTypeProps) {

  return (
    <footer className="flex flex-col items-center justify-center bg-primary text-primary-foreground bottom-0" >
      <div className="flex flex-col items-center justify-center max-w-7xl my-20 gap-8 text-center">
        {title &&
          <h2 className="text-white text-3xl font-bold">
            {title}
          </h2>
        }

        <a href="/biblioteca/">
          {logoUrl && logoUrl !== '' && (
            <Image
              src={logoUrl}
              alt={logoAlt + "  footer" || "footer logo"}
              width={200}
              height={100}
              className="object-cover object-[center_90%] -z-10"
            />
          )}
          {/* <Image
              src={logo_white}
              alt="UNAMED"
              width={130}
            /> */}
        </a>

        {seccion_info.map(({ information, title }, i) => (
          <div key={i + title} className="text-white space-y-1 text-sm md:text-base">

            {title && title != '' && <h4 className="text-primary-foreground font-display uppercase tracking-wider text-2xl mb-6">{title}</h4>}

            {information.map(({ icon, label, url }, i) => {

              const IconComponent = iconMap[icon]

              return (
                <div key={label + i} >
                  <ul className="space-y-4 text-sm text-primary-foreground/80 mt-4">
                    <li key={label + i + url} className="flex items-center justify-center gap-2 hover:text-accent hover:underline">
                      {
                        IconComponent &&
                        <IconComponent className="w-4 h-4 mt-0.5 text-accent" />
                      }
                      <a href={url} className={i % 2 != 0 ? "block hover:text-accent text-gray-400" : ""} > {label}</a>
                    </li>

                  </ul>
                </div>

              )

            })
            }
          </div>
        ))}

        <div className="flex gap-3">
          {social_medias.map(({ icon, link }, i) => {
            const IconComponent = iconsSocialMediaMap[icon] ?? Link;

            return (
              <a
                key={i}
                href={link}
                className="w-9 h-9 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
              </a>
            );
          })}
        </div>
      </div>
      <div className="policies mb-4 flex gap-4">
        {
          policies.map(({ label, link }, i) => (
            <div key={i} className="flex">
              <a className="hover:underline mr-2" href={link}>{label}</a>
              {i < policies.length - 1 && "-"}
            </div>
          ))
        }
      </div>
    </footer>
  )
}


