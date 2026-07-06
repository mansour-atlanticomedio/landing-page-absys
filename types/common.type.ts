import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type CardProps = {
  title: string,
  subtitle?: string,
  description?: string
}

export interface SocialMediaProps {
  icon: any,
  link: string
}

export interface ItemProps {
  icon: string,
  label: string,
  url: string
}

export interface PayloadImage {
  id: string,
  url: string,
  alt?: string,
  width?: number,
  height?: number,
}

export type InfoProps = {
  icon: LucideIcon,
  title: string,
  subtitle: string,
  sections: CardProps[],
  generalEntries: string[],
  children?: ReactNode
}

export type SpeakersProps = {
  photo: any,
  name: string,
  role: string,
  entity: string,
  description: any,
  socials: {
    id?: string,
    icon: string,
    url: string
  }[],
  children?: any
}