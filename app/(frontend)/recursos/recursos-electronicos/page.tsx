"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Globe, BookOpen, Video, Headphones, FileText, ExternalLink, Lock, Database, Bookmark, BookText, Share2, Microscope, CheckCircle2, KeyRound, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resourceCategories = [
  {
    id: "databases",
    label: "Bases de datos",
    items: [
      { name: "Scopus", description: "Resúmenes y citas de literatura científica", access: "subscription" },
      { name: "Web of Science", description: "Plataforma de investigación multidisciplinaria", access: "subscription" },
      { name: "JSTOR", description: "Colección de revistas académicas", access: "subscription" },
      { name: "SciELO", description: "Biblioteca científica electrónica", access: "open" },
      { name: "Redalyc", description: "Red de revistas científicas", access: "open" },
      { name: "DOAJ", description: "Revistas de acceso abierto", access: "open" },
    ],
  },
  {
    id: "ebooks",
    label: "Libros electrónicos",
    items: [
      { name: "EBSCO eBooks", description: "Colección multidisciplinaria de libros digitales", access: "subscription" },
      { name: "SpringerLink", description: "Libros y capítulos de ciencia y tecnología", access: "subscription" },
      { name: "Project Gutenberg", description: "Libros de dominio público", access: "open" },
    ],
  },
  {
    id: "media",
    label: "Recursos multimedia",
    items: [
      { name: "Kanopy", description: "Streaming de películas y documentales", access: "subscription" },
      { name: "Naxos Music Library", description: "Música clásica en streaming", access: "subscription" },
    ],
  },
]

const ACCESOS = [
  {
    icon: BookText,
    title: "eLibro",
    desc: "Plataforma líder de libros electrónicos en español. Acceso a miles de títulos de múltiples disciplinas académicas para lectura en línea o descarga.",
    cta: "Acceder a plataforma",
  },
  {
    icon: Share2,
    title: "Web of Science",
    desc: "Base de datos referencial y multidisciplinar que proporciona acceso a información de investigación global, permitiendo análisis de impacto y tendencias científicas.",
    cta: "Acceder a base de datos",
  },
  {
    icon: Microscope,
    title: "Scopus",
    desc: "La mayor base de datos de citas y resúmenes de literatura científica revisada por pares. Herramienta esencial para el seguimiento y evaluación de la investigación académica.",
    cta: "Acceder a literatura",
  },
];

export default function RecursosElectronicosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="RECURSOS" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">Recursos Electrónicos</h1>
          <p className="mt-4 text-slate-600">
            Acceda a nuestra extensa colección de plataformas digitales, bases de datos
            especializadas y literatura científica. Un entorno virtual diseñado para impulsar la
            excelencia académica y facilitar su investigación desde cualquier lugar.
          </p>
        </div>
        <div className="relative h-72 rounded-lg overflow-hidden">
          <Image src="/img/recursos-electronicos.jpg" alt="" fill className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Accesos Directos Destacados</h2>
        <div className="grid grid-cols-3 gap-6">
          {ACCESOS.map((a) => (
            <div key={a.title} className="border rounded-lg p-6">
              <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
                <a.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{a.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{a.desc}</p>
              <a href="#" className="text-sm text-teal-700 font-medium">{a.cta} →</a>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-slate-50 border rounded-lg p-8 grid grid-cols-[1fr_320px] gap-8 items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-3">Identificación y Acceso Remoto</h3>
            <p className="text-sm text-slate-600 mb-4">
              Para acceder a los recursos electrónicos desde fuera del campus universitario, es
              necesario validar sus credenciales institucionales. El sistema le solicitará su
              usuario y contraseña corporativa.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" /> Utilice su correo
                electrónico institucional completo.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" /> La conexión a través
                de VPN no es requerida para la mayoría de las plataformas mediante acceso
                federado.
              </li>
            </ul>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <KeyRound className="h-6 w-6 mx-auto text-slate-800 mb-3" />
            <p className="font-bold text-slate-800">Portal de Autenticación</p>
            <p className="text-sm text-slate-600 my-3">
              Inicie sesión para habilitar el acceso integral a todos los recursos.
            </p>
            <Link href={'/login'} >
              <button className="w-full bg-teal-700 text-white rounded-md py-2.5 font-medium cursor-pointer">
                Iniciar Sesión Institucional
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button className="border rounded-md px-5 py-3 font-medium text-slate-800 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" /> Comunicar un problema de acceso
          </button>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
