'use client'
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { FormEvent, useState } from "react";

interface InputProps {
  placeholder?: string,
}

export default function InputComponent({ placeholder }: InputProps) {
  const router = useRouter()
  const [showAdvanced, setShowAdvanced] = useState(false)

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

  return (
    <form onSubmit={handleInput} className="bg-white flex flex-col rounded-lg mt-8 overflow-hidden">
      <div className="flex justify-between items-center h-12">
        <input
          className="flex-5 ml-4 text-gray-600 font-bold h-full outline-none focus:outline-none focus:ring-0"
          type="text"
          name="input_hero"
          id="input_hero"
          placeholder={placeholder || 'Buscar título, autor o ISBN...'} />
        <button type="submit" className="flex-1 flex gap-2 justify-center items-center bg-blue-500 h-full cursor-pointer" >
          <Search size={16} className="text-white" />
          <span className="text-white">Buscar</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border-t cursor-pointer"
      >
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Búsqueda avanzada
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border-t bg-gray-50">
          <div className="flex flex-col gap-1">
            <label htmlFor="titulo" className="text-xs text-gray-500 font-medium">Título</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="titulo"
              id="titulo"
              placeholder="Título del libro"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="autor" className="text-xs text-gray-500 font-medium">Autor</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="autor"
              id="autor"
              placeholder="Autor"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="isbn" className="text-xs text-gray-500 font-medium">ISBN</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="isbn"
              id="isbn"
              placeholder="ISBN"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="editorial" className="text-xs text-gray-500 font-medium">Editorial</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="editorial"
              id="editorial"
              placeholder="Editorial"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="anio" className="text-xs text-gray-500 font-medium">Año de publicación</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="anio"
              id="anio"
              placeholder="Ej: 2008"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="materia" className="text-xs text-gray-500 font-medium">Materia</label>
            <input
              className="px-3 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="materia"
              id="materia"
              placeholder="Ej: Programación"
            />
          </div>
        </div>
      )}
    </form>
  )
}