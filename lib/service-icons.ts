import { Bookmark, BookOpen, BookPlus, FlaskConical, GraduationCap, Headphones, Info, Laptop, Library, Printer, RefreshCw, Search, User, type LucideIcon } from 'lucide-react'

export const SERVICE_ICON_OPTIONS = [
  { label: 'Buscar (Lupa)', value: 'Search' },
  { label: 'Libro abierto', value: 'BookOpen' },
  { label: 'Renovar (Flechas)', value: 'RefreshCw' },
  { label: 'Marcador', value: 'Bookmark' },
  { label: 'Auriculares (Atención)', value: 'Headphones' },
  { label: 'Libro con más', value: 'BookPlus' },
  { label: 'Usuario', value: 'User' },
  { label: 'Biblioteca', value: 'Library' },
  { label: 'Birrete (Formación)', value: 'GraduationCap' },
  { label: 'Matraz (Investigación)', value: 'FlaskConical' },
  { label: 'Portátil', value: 'Laptop' },
  { label: 'Impresora', value: 'Printer' },
  { label: 'Información', value: 'Info' },
]

const ICONS: Record<string, LucideIcon> = { Search, BookOpen, RefreshCw, Bookmark, Headphones, BookPlus, User, Library, GraduationCap, FlaskConical, Laptop, Printer, Info }

export const serviceIcon = (name?: string | null): LucideIcon => ICONS[name ?? ''] ?? Search
