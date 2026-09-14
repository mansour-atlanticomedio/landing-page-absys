'use client'

import { useRouter } from "next/navigation"
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { FormEvent, useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface InputProps {
  title?: string
  placeholder?: string
}

export default function InputComponent({ title, placeholder }: InputProps) {
  const router = useRouter()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [simpleValue, setSimpleValue] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelHeight, setPanelHeight] = useState(0)

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.scrollHeight)
    }
  }, [showAdvanced])

  const handleInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const params = new URLSearchParams()

    const simpleSearch = data.input_hero?.toString().trim()
    if (simpleSearch) params.set('name', simpleSearch)

    const titulo = data.titulo?.toString().trim()
    if (titulo) params.set('titulo', titulo)

    const autor = data.autor?.toString().trim()
    if (autor) params.set('autor', autor)

    const isbn = data.isbn?.toString().trim()
    if (isbn) params.set('isbn', isbn)

    const editorial = data.editorial?.toString().trim()
    if (editorial) params.set('editorial', editorial)

    const anio = data.anio?.toString().trim()
    if (anio) params.set('anio', anio)

    const materia = data.materia?.toString().trim()
    if (materia) params.set('materia', materia)

    if (params.size === 0) return

    router.push(`/libros?${params.toString()}`)
  }

  const advancedFields = [
    { name: 'titulo', label: 'Título', placeholder: 'Título del libro' },
    { name: 'autor', label: 'Autor', placeholder: 'Nombre del autor' },
    { name: 'isbn', label: 'ISBN', placeholder: '978-84-...' },
    { name: 'editorial', label: 'Editorial', placeholder: 'Editorial' },
    { name: 'anio', label: 'Año', placeholder: '2024' },
    { name: 'materia', label: 'Materia', placeholder: 'Programación' },
  ]

  return (
    <form onSubmit={handleInput} className="mx-auto max-w-7xl w-full px-6 mt-10">

      {/* Search bar */}
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            name="input_hero"
            value={simpleValue}
            onChange={(e) => setSimpleValue(e.target.value)}
            placeholder={placeholder || "Buscar por título, autor, materia o ISBN..."}
            className="h-12 pl-10 pr-10 rounded-l-lg rounded-r-none border-r-0 text-sm focus-visible:z-10"
          />
          {simpleValue && (
            <button
              type="button"
              onClick={() => setSimpleValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 px-6 rounded-l-none rounded-r-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm tracking-wide"
        >
          <Search className="h-4 w-4 mr-1.5" />
          Buscar
        </Button>
      </div>

      {/* Advanced toggle */}
      <div className="flex items-center justify-center mt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Búsqueda avanzada</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Advanced panel */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: showAdvanced ? `${panelHeight}px` : "0px" }}
      >
        <div ref={panelRef} className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5 p-5 bg-secondary/50 border border-border rounded-xl">
            {advancedFields.map(({ name, label, placeholder }) => (
              <div key={name} className="space-y-1.5">
                <Label htmlFor={name} className="text-xs text-muted-foreground">
                  {label}
                </Label>
                <Input
                  name={name}
                  id={name}
                  placeholder={placeholder}
                  className="h-10 text-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAdvanced(false)
                const form = panelRef.current?.closest("form")
                if (form) {
                  advancedFields.forEach(({ name }) => {
                    const input = form.elements.namedItem(name) as HTMLInputElement
                    if (input) input.value = ""
                  })
                }
              }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Buscar con filtros
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
