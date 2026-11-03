"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { lexicalToPlainText } from "@/lib/rich-text"

type FaqItem = { question?: string | null; answer?: any }
type SearchContextValue = { query: string; setQuery: (value: string) => void; total: number; matches: (item: FaqItem) => boolean }

const FaqSearchContext = createContext<SearchContextValue | null>(null)

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export const useFaqSearch = () => useContext(FaqSearchContext)

export function FaqSearchProvider({ docs, children }: { docs: FaqItem[][]; children: React.ReactNode }) {
  const [query, setQuery] = useState("")

  const value = useMemo(() => {
    const q = normalize(query.trim())
    const matches = (item: FaqItem) => !q || normalize(`${item.question ?? ""} ${lexicalToPlainText(item.answer)}`).includes(q)
    const total = docs.reduce((sum, items) => sum + items.filter(matches).length, 0)
    return { query, total, matches, setQuery }
  }, [docs, query])

  return <FaqSearchContext.Provider value={value}>{children}</FaqSearchContext.Provider>
}

export function FaqSearchBox() {
  const ctx = useContext(FaqSearchContext)
  if (!ctx) return null
  const { query, total, setQuery } = ctx

  return (
    <div className="mx-auto max-w-4xl px-6 pt-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en todas las preguntas frecuentes"
          aria-label="Buscar en todas las preguntas frecuentes"
          className="h-11 pl-9"
        />
      </div>
      <p aria-live="polite" className={query ? "mt-2 text-sm text-[hsl(var(--muted-foreground))]" : "sr-only"}>
        {query ? (total === 0 ? `No hay preguntas que coincidan con "${query}". Prueba con otras palabras o consulta con un bibliotecario.` : `${total} ${total === 1 ? "resultado" : "resultados"}`) : ""}
      </p>
    </div>
  )
}
