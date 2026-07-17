'use client'

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Search, Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


const featuredServices = [
  {
    title: "Catálogo en línea",
    description: "Busca libros, revistas y recursos digitales",
    icon: Search,
    href: "/recursos/catalogo",
  },
  {
    title: "Préstamo de materiales",
    description: "Solicita libros y materiales para tu investigación",
    icon: BookOpen,
    href: "/servicios",
  },
  {
    title: "Horarios",
    description: "Consulta nuestros horarios de atención",
    icon: Clock,
    href: "/conocenos/horarios-ubicacion-y-contacto",
  },
  {
    title: "Comunidad",
    description: "Conoce a nuestro equipo y colaboradores",
    icon: Users,
    href: "/conocenos/quienes-somos",
  },
]

export default function InicioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Biblioteca"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Biblioteca Universitaria
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Tu puerta al conocimiento y la investigación
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button asChild size="lg" className="text-lg">
              <Link href="/recursos/catalogo">
                Explorar catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">Servicios destacados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para tu desarrollo académico e investigativo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredServices.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={service.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-primary text-sm font-medium flex items-center gap-1">
                        Ver más <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
