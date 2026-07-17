"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, X, Book, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import axios from "axios"

import { AbsysInterface, RecordInterface } from "@/types/absys.type"
import { transformMarcToBook } from "@/lib/marc21handler"

const categories = [
  { name: "Literatura", count: 142 },
  { name: "Ciencias", count: 85 },
  { name: "Historia", count: 64 },
  { name: "Filosofía", count: 53 },
  { name: "Arte", count: 41 },
  { name: "Tecnología", count: 78 },
  { name: "Medicina", count: 92 },
  { name: "Derecho", count: 56 },
  { name: "Economía", count: 39 },
  { name: "Educación", count: 47 },
]

const authors = [
  "Gabriel García Márquez",
  "Mario Vargas Llosa",
  "Julio Cortázar",
  "Jorge Luis Borges",
  "Pablo Neruda",
  "Isabel Allende",
]

const languages = ["Español", "Inglés", "Francés", "Portugués", "Alemán"]
const faculties = ["Humanidades", "Ciencias", "Derecho", "Medicina", "Economía"]

const allBooks = [
  { title: "Cien años de soledad", author: "Gabriel García Márquez", year: 1967, isbn: "978-84-376-0494-7", available: true },
  { title: "El principito", author: "Antoine de Saint-Exupéry", year: 1943, isbn: "978-84-9759-229-5", available: true },
  { title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", year: 1605, isbn: "978-84-376-0494-7", available: true },
  { title: "La sombra del viento", author: "Carlos Ruiz Zafón", year: 2001, isbn: "978-84-9759-229-5", available: true },
  { title: "1984", author: "George Orwell", year: 1949, isbn: "978-84-376-0494-7", available: true },
  { title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", year: 1985, isbn: "978-84-9759-229-5", available: true },
]

interface ActiveFilter {
  type: string
  value: string
}

export default function BusquedaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [loading, setLoading] = useState(false);
  const [bookResults, setBookResults] = useState(0)
  const [records, setRecords] = useState<RecordInterface[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "Categoría", value: "Literatura" },
    { type: "Disponibilidad", value: "Solo disponibles" },
  ])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Literatura"])
  const [selectedAuthor, setSelectedAuthor] = useState<string>("")
  const [yearFrom, setYearFrom] = useState<string>("")
  const [yearTo, setYearTo] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [selectedFaculty, setSelectedFaculty] = useState<string>("")
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const [sortBy, setSortBy] = useState("relevancia")

  useEffect(() => {
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

    const fetchData = async () => {
      try {
        setLoading(true);
        setHasSearched(true);
        // const response = await axios.get(`${BASE_API_URL}/absys_service/search?${initialQuery}`);
        const response = await axios.get(`${BASE_API_URL}/absys_service/`);
        const responseAbsys : AbsysInterface = response.data.message.response
        setBookResults(responseAbsys.count);
        const recordsResult : RecordInterface[] = responseAbsys.collection.record
        setRecords(recordsResult);

        console.log(recordsResult);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeFilter = (filter: ActiveFilter) => {
    setActiveFilters((prev) => prev.filter((f) => !(f.type === filter.type && f.value === filter.value)))
    if (filter.type === "Categoría") {
      setSelectedCategories((prev) => prev.filter((c) => c !== filter.value))
    }
    if (filter.type === "Disponibilidad") {
      setOnlyAvailable(false)
    }
  }

  const addCategoryFilter = (cat: string) => {
    if (!selectedCategories.includes(cat)) {
      setSelectedCategories((prev) => [...prev, cat])
      setActiveFilters((prev) => [...prev, { type: "Categoría", value: cat }])
    }
  }

  const toggleOnlyAvailable = () => {
    const newVal = !onlyAvailable
    setOnlyAvailable(newVal)
    if (newVal) {
      setActiveFilters((prev) => [...prev, { type: "Disponibilidad", value: "Solo disponibles" }])
    } else {
      setActiveFilters((prev) => prev.filter((f) => f.type !== "Disponibilidad"))
    }
  }

  const filteredBooks = allBooks.filter((book) => {
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase()) && !book.author.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (onlyAvailable && !book.available) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-b from-primary/5 to-background py-10 px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-primary">
            Catálogo de la Biblioteca
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Encuentra libros, revistas, artículos y más recursos disponibles en nuestra red.
          </p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent" />
              <Input
                placeholder="Título, autor, materia o ISBN..."
                className="pl-12 h-12 text-base rounded-xl border-2 focus-visible:border-accent focus-visible:ring-accent/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              Buscar
            </Button>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((filter, i) => (
                <Badge
                  key={`${filter.type}-${filter.value}-${i}`}
                  variant="secondary"
                  className="bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 text-sm rounded-full"
                >
                  {filter.value}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:text-accent/70"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            className="w-full lg:w-64 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-primary">Filtros</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Categoría</h3>
                <div className="space-y-2.5">
                  {categories.map((cat) => (
                    <label
                      key={cat.name}
                      className="flex items-center gap-2.5 text-sm cursor-pointer hover:text-accent transition-colors"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(cat.name)}
                        onCheckedChange={() => {
                          if (selectedCategories.includes(cat.name)) {
                            setSelectedCategories((prev) => prev.filter((c) => c !== cat.name))
                            setActiveFilters((prev) => prev.filter((f) => !(f.type === "Categoría" && f.value === cat.name)))
                          } else {
                            addCategoryFilter(cat.name)
                          }
                        }}
                      />
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-muted-foreground text-xs">{cat.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Autor</h3>
                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Buscar autor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Año de publicación</h3>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Desde"
                    className="h-9"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Hasta"
                    className="h-9"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Idioma</h3>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Facultad</h3>
                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((fac) => (
                      <SelectItem key={fac} value={fac}>
                        {fac}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer hover:text-accent transition-colors">
                  <Checkbox
                    checked={onlyAvailable}
                    onCheckedChange={toggleOnlyAvailable}
                  />
                  <span>Solo disponibles</span>
                </label>
              </div>
            </div>
          </motion.aside>

          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground font-medium">
                {bookResults} resultados
              </p>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevancia</SelectItem>
                    <SelectItem value="recientes">Más recientes</SelectItem>
                    <SelectItem value="antiguos">Más antiguos</SelectItem>
                    <SelectItem value="titulo">Título A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {records.map((record, i) => {

                const book = transformMarcToBook(record.datafield);
                console.log("book", book);

                return (
                <motion.div
                  key={book.isbn + i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card
                    className="h-full group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-accent/30"
                    onClick={() => router.push(`/recursos/catalogo/libro/${encodeURIComponent(book.title)}`)}
                  >
                    <CardContent className="p-4">
                      <div className="w-full h-44 rounded-lg bg-muted/50 flex items-center justify-center mb-4 overflow-hidden">
                        <Book className="h-14 w-14 text-muted-foreground/40" />
                      </div>
                      <h3 className="font-bold text-sm group-hover:text-accent transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{book.year}</span>
                        {/* {book.available && (
                          <Badge variant="secondary" className="bg-accent/10 text-accent text-xs border-0">
                            Disponible
                          </Badge>
                        )} */}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
              } )}

              {bookResults === 0 && (
                <div className="col-span-full text-center py-16">
                  <Book className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No se encontraron resultados para tu búsqueda.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
