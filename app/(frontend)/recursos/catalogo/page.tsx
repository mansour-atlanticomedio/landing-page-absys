"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, BookSearch, Filter, BookCheck, UserCog, HelpCircle } from "lucide-react"
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/recursos/catalogo/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/recursos/catalogo/busqueda")
    }
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Catálogo de la Biblioteca
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            Encuentra libros, revistas, artículos y más recursos disponibles en nuestra red.
          </p>

          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
              <Input
                placeholder="Título, autor, materia o ISBN..."
                className="pl-12 h-12 text-base rounded-xl border-2 focus-visible:border-accent focus-visible:ring-accent/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold"
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">
            Cómo utilizar el catálogo
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mb-12" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow border-border/50">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                      <step.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-primary">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 px-8">
              <div className="flex items-center gap-4">
                <HelpCircle className="h-10 w-10 text-accent shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    ¿No encuentras lo que necesitas?
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Nuestro equipo de bibliotecarios puede ayudarte en tu búsqueda.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white font-semibold px-6 shrink-0"
                onClick={() => router.push("/recursos/contacto")}
              >
                Necesita ayuda para buscar
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
