"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, Mail, Search } from "lucide-react";
import { iconMap } from "@/lib/utils";

interface AccesoRapido {
  icon: string;
  title: string;
}

interface Tarjeta {
  icon: string;
  title: string;
  description: string;
  cta?: string;
  link?: string;
}

interface CTAData {
  title: string;
  subtitle: string;
  button_cta: string;
  button_link: string;
}

interface InvestigationContentProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  accesosRapidos: AccesoRapido[];
  tarjetas: Tarjeta[];
  cta: CTAData;
}

export default function InvestigationContent({
  title,
  subtitle,
  imageUrl,
  accesosRapidos,
  tarjetas,
  cta,
}: InvestigationContentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="INVESTIGACIÓN" /> */}

      <motion.section
        className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">{title}</h1>
          <p className="mt-4 text-slate-600">{subtitle}</p>
        </div>
        <div className="relative h-72 rounded-lg overflow-hidden">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <motion.div
          className="bg-slate-50 border rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        >
          <h2 className="font-bold text-slate-800 mb-4">Accesos rápidos</h2>
          <div className="flex flex-wrap gap-3">
            {accesosRapidos.map((a, index) => {
              const IconComponent = iconMap[a.icon] || Search;
              return (
                <a
                  key={a.title ?? index}
                  href={`#tarjeta-${index}`}
                  className="border bg-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 text-slate-700 transition-colors hover:border-accent hover:text-accent hover:bg-accent/5"
                >
                  <IconComponent className="h-4 w-4" /> {a.title}
                </a>
              );
            })}
            <a
              href="#cta-apoyo"
              className="bg-slate-800 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors hover:bg-slate-700"
            >
              <HeartHandshake className="h-4 w-4" /> Solicitar apoyo
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tarjetas.map((t, index) => {
            const IconComponent = iconMap[t.icon] || Search;
            const isLastOdd = index === tarjetas.length - 1 && tarjetas.length % 2 === 1;

            return (
              <motion.div
                key={t.title ?? index}
                id={`tarjeta-${index}`}
                className={`border rounded-lg p-6 scroll-mt-24 transition-shadow hover:shadow-md ${isLastOdd ? "md:col-span-2" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeInOut" }}
              >
                <h3 className="flex items-center gap-2 font-bold text-teal-700 mb-2">
                  <IconComponent className="h-4 w-4" /> {t.title}
                </h3>
                <p className={`text-sm text-slate-600 ${t.link ? "mb-4" : ""}`}>{t.description}</p>
                {t.link && (
                  <Link href={t.link}>
                    <button className="w-full bg-slate-100 rounded-md py-2.5 text-sm font-medium text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-primary hover:text-white">
                      <IconComponent className="h-4 w-4" /> {t.cta || "Acceder"}
                    </button>
                  </Link>
                )}
              </motion.div>
            );
          })}

          <motion.div
            id="cta-apoyo"
            className="bg-teal-50 border border-teal-100 rounded-lg p-6 md:col-span-2 scroll-mt-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <HeartHandshake className="h-4 w-4" /> {cta.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{cta.subtitle}</p>
            <Link href={cta.button_link || "/contacto"}>
              <button className="bg-teal-700 text-white rounded-md px-5 py-2.5 text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors hover:bg-teal-800">
                <Mail className="h-4 w-4" /> {cta.button_cta}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
