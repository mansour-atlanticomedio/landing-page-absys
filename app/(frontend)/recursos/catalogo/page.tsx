"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, BookSearch, Filter, BookCheck, UserCog, HelpCircle, Headphones, SlidersHorizontal, CheckCircle2, UserCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const howToSteps = [
  {
    icon: BookSearch,
    title: "Busca",
    description: "Utiliza la barra de búsqueda para encontrar libros, artículos y otros recursos por título, autor, materia o ISBN.",
  },
  {
    icon: Filter,
    title: "Filtra",
    description: "Refina tu búsqueda aplicando filtros por categoría, autor, año de publicación, idioma y disponibilidad.",
  },
  {
    icon: BookCheck,
    title: "Consulta la disponibilidad",
    description: "Verifica en tiempo real si un recurso está disponible en estantería o si se encuentra prestado.",
  },
  {
    icon: UserCog,
    title: "Gestiona tu cuenta",
    description: "Reserva materiales,Consulta tu historial de préstamos y renueva los documentos que tengas en préstamo.",
  },
]

export default function CatalogoPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // const handleSearch = () => {
  //   if (searchQuery.trim()) {
  //     window.location.href = 'https://demo.baratz.es/opac'
  //     // router.push(`/recursos/catalogo/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
  //   }
  // }

  const PASOS = [
  {
    icon: Search,
    title: "Busca",
    desc: "Introduce tus términos en la barra principal. Puedes usar comillas para frases exactas.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filtra",
    desc: "Refina tus resultados por formato, año de publicación, idioma o biblioteca específica.",
  },
  {
    icon: CheckCircle2,
    title: "Consulta la disponibilidad",
    desc: "Verifica en qué sucursal se encuentra el ejemplar y si está disponible para préstamo.",
  },
  {
    icon: UserCircle,
    title: "Gestiona tu cuenta",
    desc: "Inicia sesión para renovar préstamos, hacer reservas o guardar búsquedas frecuentes.",
  },
];

  return ( 
  <div className="min-h-screen bg-white">
      {/* <SiteHeader active="RECURSOS" /> */}

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800">Catálogo de la Biblioteca</h1>
        <p className="mt-3 text-slate-600">
          Encuentra libros, revistas, artículos y más recursos disponibles en nuestra red.
        </p>

        <div className="mt-8 flex gap-2">
          <div className="flex-1 flex items-center gap-2 border rounded-md px-4">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Título, autor, materia o ISBN..."
              className="flex-1 py-3 outline-none text-sm"
            />
          </div>
          <button className="bg-accent text-white font-medium px-6 rounded-md"><a href="https://demo.baratz.es/opac">Buscar</a></button>
        </div>
        <a href="#" className="mt-2 inline-block text-sm text-teal-700">
          ⚏ Búsqueda avanzada
        </a>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          Cómo utilizar el catálogo
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {PASOS.map((p) => (
            <div key={p.title} className="border rounded-lg p-6">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 border rounded-lg p-6 flex items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center">
              <Headphones className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">¿No encuentras lo que necesitas?</p>
              <p className="text-sm text-slate-600">
                Nuestro equipo de bibliotecarios está disponible para ayudarte con tus búsquedas
                avanzadas.
              </p>
            </div>
          </div>
          <button className="border rounded-md px-5 py-3 font-medium text-teal-700">
            Necesito ayuda para buscar
          </button>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
