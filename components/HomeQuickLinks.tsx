"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, Laptop, Microscope, GraduationCap, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const QUICK_LINKS = [
  { icon: BookOpen, label: "Catálogo", href: "/recursos/catalogo" },
  { icon: Laptop, label: "Recursos electrónicos", href: "/recursos/recursos-electronicos" },
  { icon: Microscope, label: "Investigación", href: "/investigacion" },
  { icon: GraduationCap, label: "Formación", href: "/formacion" },
  { icon: MapPin, label: "Horarios y ubicación", href: "/conocenos/horarios-ubicacion-y-contacto" },
]

export default function HomeQuickLinks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap justify-center gap-3">
        {QUICK_LINKS.map(({ icon: Icon, label, href }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + index * 0.06, ease: "easeInOut" }}
            whileHover={{ y: -3 }}
          >
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-border shadow-sm px-5 hover:border-accent hover:text-accent hover:bg-accent/5"
            >
              <Link href={href}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
