import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type CardProps = { 
    title: string, 
    subtitle?: string, 
    description?: string 
}

export type InfoProps = {
  icon: LucideIcon,
  title: string,
  subtitle: string,
  sections : CardProps[],
  generalEntries: string[],
  children?: ReactNode
}