"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Book, Calendar, Globe, Hash, MapPin, CheckCircle2, BookmarkPlus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


const booksData: Record<string, {
  title: string
  author: string
  year: number
  isbn: string
  language: string
  tags: string[]
  available: boolean
  location: string
  signature: string
  synopsis: string
  authorBio: string
}> = {
  "Cien años de soledad": {
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    year: 1967,
    isbn: "978-84-376-0494-7",
    language: "Español",
    tags: ["Realismo Mágico", "Literatura Latinoamericana", "Saga Familiar", "Colombia"],
    available: true,
    location: "Biblioteca Central · Planta 2 · Estantería Literaturas Hispánicas",
    signature: "N GAR cie",
    synopsis:
      "La obra maestra de Gabriel García Márquez narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. A través de un lenguaje poético y lleno de elementos fantásticos, el autor colombianoexplora temas como el amor, la soledad, el destino y la repetición cíclica de la historia. Una novela que ha trascendido fronteras y generaciones, convirtiéndose en una de las lecturas más importantes de la literatura universal.",
    authorBio:
      "Gabriel García Márquez (1927-2014) fue un escritor y periodista colombiano, considerado uno de los autores más importantes del siglo XX. Ganador del Premio Nobel de Literatura en 1982, es conocido por su maestría del realismo mágico. Entre sus obras destacadas se encuentran 'El amor en los tiempos del cólera', 'Crónica de una muerte anunciada' y 'Cien años de soledad'.",
  },
}

const defaultBook = {
  title: "Libro",
  author: "Autor",
  year: 2000,
  isbn: "978-000-000-000-0",
  language: "Español",
  tags: ["Literatura", "Ficción"],
  available: true,
  location: "Biblioteca Central · Planta 1",
  signature: "N GEN lib",
  synopsis: "Sinopsis del libro no disponible.",
  authorBio: "Biografía del autor no disponible.",
}

const relatedBooks = [
  { title: "La casa de los espíritus", author: "Isabel Allende" },
  { title: "Pedro Páramo", author: "Juan Rulfo" },
  { title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez" },
  { title: "Ficciones", author: "Jorge Luis Borges" },
]

const recommendations = [
  { title: "La ciudad y los perros", author: "Mario Vargas Llosa" },
  { title: "Rayuela", author: "Julio Cortázar" },
  { title: "Veinte poemas de amor", author: "Pablo Neruda" },
  { title: "El guardián entre el centeno", author: "J.D. Salinger" },
]

export default function LibroPage() {
  const params = useParams()
  const titulo = decodeURIComponent(params.titulo as string)
  const book = booksData[titulo] || { ...defaultBook, title: titulo }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <section className="bg-background border-b border-border py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-accent"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </div>
      </section>

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:col-span-4">
            <div className="flex gap-3">
              <div className="w-48 h-72 rounded-lg bg-gradient-to-br from-green-800 to-green-950 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                <div className="text-center px-4">
                  <Book className="h-10 w-10 text-green-300/50 mx-auto mb-3" />
                  <p className="text-green-200/70 text-xs font-medium leading-tight">{book.title}</p>
                </div>
              </div>
              <div className="w-6 h-72 rounded-sm bg-gradient-to-b from-green-900 to-green-950 shadow-md" />
            </div>

            <div className="flex gap-3 mt-5">
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold h-11">
                Leer ahora
              </Button>
              <Button variant="outline" className="flex-1 border-accent text-accent hover:bg-accent/5 h-11">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Agregar a lista
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {book.title}
            </h1>
            <p className="text-lg text-accent font-medium mb-5">{book.author}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {book.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                {book.isbn}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                {book.language}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {book.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-accent/10 text-accent border border-accent/20 rounded-full px-4 py-1.5 text-sm font-medium"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Card className={`border-2 ${book.available ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
              <CardContent className="py-5 px-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${book.available ? "bg-green-100" : "bg-red-100"}`}>
                    <CheckCircle2 className={`h-5 w-5 ${book.available ? "text-green-600" : "text-red-600"}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${book.available ? "text-green-700" : "text-red-700"}`}>
                      {book.available ? "Disponible" : "No disponible"}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {book.location}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Signatura: {book.signature}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
                      Reservar
                    </Button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                      Añadir a mi lista
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/50">
              <CardContent className="py-6 px-6">
                <h3 className="font-bold text-primary mb-4">Sobre el Autor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <Book className="h-7 w-7 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{book.author}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.authorBio}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-4">Sinopsis</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {book.synopsis}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto border-t border-border" />

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-2">
            Más libros de {book.author}
          </h2>
          <div className="w-16 h-1 bg-accent mb-8" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedBooks.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className="group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-accent/30">
                  <CardContent className="p-4">
                    <div className="w-full h-36 rounded-lg bg-muted/50 flex items-center justify-center mb-3 overflow-hidden">
                      <Book className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h4 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.author}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-accent px-2">
                        Ver detalle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-10 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-primary mb-2">
            También te puede interesar
          </h2>
          <div className="w-16 h-1 bg-accent mb-8" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommendations.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className="group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-accent/30">
                  <CardContent className="p-4">
                    <div className="w-full h-36 rounded-lg bg-muted/50 flex items-center justify-center mb-3 overflow-hidden">
                      <Book className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h4 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.author}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-accent px-2">
                        Ver detalle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
