import { Bookmark, BookOpen, BookPlus, Headphones, Library, RefreshCw, Search, User, type LucideIcon } from 'lucide-react'

export const SERVICE_ICON_OPTIONS = [
  { label: 'Buscar (Lupa)', value: 'Search' },
  { label: 'Libro abierto', value: 'BookOpen' },
  { label: 'Renovar (Flechas)', value: 'RefreshCw' },
  { label: 'Marcador', value: 'Bookmark' },
  { label: 'Auriculares (Atención)', value: 'Headphones' },
  { label: 'Libro con más', value: 'BookPlus' },
  { label: 'Usuario', value: 'User' },
  { label: 'Biblioteca', value: 'Library' },
]

const ICONS: Record<string, LucideIcon> = { Search, BookOpen, RefreshCw, Bookmark, Headphones, BookPlus, User, Library }

export const serviceIcon = (name?: string | null): LucideIcon => ICONS[name ?? ''] ?? Search
