"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CalendarCheck, BookOpen, ArrowRight } from "lucide-react";

interface EnlaceRapido {
  label: string;
  link: string;
}

interface CitarCTA {
  title: string;
  subtitle: string;
  button_cta: string;
  button_link: string;
}

interface GuiaTutorial {
  title: string;
  description: string;
  link?: string;
}

interface FormationContentProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  buscarParrafo1: string;
  buscarParrafo2: string;
  enlacesRapidos: EnlaceRapido[];
  citarCta: CitarCTA;
  guiaTutorial: GuiaTutorial;
  actividadesTexto: string;
  actividadesEstado: string;
}

export default function FormationContent({
  title,
  subtitle,
  imageUrl,
  buscarParrafo1,
  buscarParrafo2,
  enlacesRapidos,
  citarCta,
  guiaTutorial,
  actividadesTexto,
  actividadesEstado,
}: FormationContentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="FORMACIÓN" /> */}

      <motion.section
        className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">{title}</h1>
          <div className="w-10 h-1 bg-teal-700 my-4" />
          <p className="text-slate-600 mb-4">{subtitle}</p>
          <p className="text-slate-600">
            En esta página se incorporarán progresivamente guías, tutoriales, documentos y
            actividades formativas dirigidas a la comunidad universitaria.
          </p>
        </div>
        <div className="relative h-72 rounded-lg overflow-hidden">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      </motion.section>

      <section className="mx-auto max-w-6xl px-6 pb-14 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h2 className="flex items-center gap-2 font-bold text-slate-800 text-xl mb-6">
              <Search className="h-5 w-5 text-indigo-500" /> Buscar y evaluar información
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <p className="text-sm text-slate-600">{buscarParrafo1}</p>
              <p className="text-sm text-slate-600">{buscarParrafo2}</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm font-medium text-teal-700 mb-10">
              {enlacesRapidos.map((e, index) => (
                <Link
                  key={e.label ?? index}
                  href={e.link || "#"}
                  className="flex items-center gap-1 transition-colors hover:text-teal-900 hover:underline underline-offset-4"
                >
                  → {e.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-slate-50 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{citarCta.title}</h3>
            <p className="text-slate-600 mb-6 whitespace-pre-line">{citarCta.subtitle}</p>
            <Link href={citarCta.button_link || "#"}>
              <button className="border rounded-md px-5 py-2.5 text-sm font-medium text-slate-800 flex items-center gap-2 cursor-pointer transition-colors hover:bg-slate-800 hover:text-white">
                {citarCta.button_cta} <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
          >
            <h2 className="text-2xl font-bold text-slate-800 border-t mt-12 pt-8 mb-2">
              Guías y tutoriales
            </h2>
            <p className="text-slate-600 mb-6">
              En este espacio encontrarás materiales breves y prácticos sobre el uso del catálogo,
              el acceso a recursos electrónicos, la búsqueda bibliográfica, la evaluación de
              fuentes y la citación académica.
            </p>
            <Link href={guiaTutorial.link || "#"} className="group block">
              <div className="border rounded-lg p-5 flex items-center justify-between transition-colors hover:border-teal-300 hover:bg-teal-50/50">
                <div className="flex gap-4 items-center">
                  <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{guiaTutorial.title}</p>
                    <p className="text-sm text-slate-600">{guiaTutorial.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        >
          <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-4">
            <CalendarCheck className="h-4 w-4" /> ACTIVIDADES FORMATIVAS
          </h3>
          <p className="text-sm text-slate-600 mb-6">{actividadesTexto}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <p className="text-sm font-bold text-slate-800">Estado actual</p>
          </div>
          <p className="text-sm text-slate-600">{actividadesEstado}</p>
        </motion.aside>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
