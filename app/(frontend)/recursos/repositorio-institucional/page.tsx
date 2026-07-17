"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Database, Download, FileText, GraduationCap, Search, Shield, Upload, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const stats = [
  { icon: FileText, label: "Documentos", value: "12,458" },
  { icon: GraduationCap, label: "Tesis", value: "3,210" },
  { icon: Download, label: "Descargas", value: "89,567" },
  { icon: Shield, label: "Colecciones", value: "24" },
]

const recentUploads = [
  { title: "Análisis de inteligencia artificial en educación superior", author: "López Martínez, J.", date: "2026-06-28", type: "Artículo" },
  { title: "Modelo predictivo para eficiencia energética en edificios", author: "Hernández García, M.", date: "2026-06-25", type: "Tesis doctoral" },
  { title: "Estudio de movilidad urbana sostenible en zonas metropolitanas", author: "Rodríguez Pérez, A.", date: "2026-06-22", type: "Artículo" },
  { title: "Evaluación de políticas públicas en salud digital", author: "Martínez López, C.", date: "2026-06-20", type: "Tesis maestría" },
]

export default function RepositorioInstitucionalPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[350px] flex items-center justify-center overflow-hidden">
        <Image
          src="/repositorio-bg.jpg"
          alt="Repositorio Institucional"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Repositorio Institucional
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Accede a la producción académica y científica de nuestra universidad
          </motion.p>
          <motion.div
            className="flex gap-4 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar en el repositorio..."
                className="pl-10 h-12 text-base bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-300"
              />
            </div>
            <Button size="lg" variant="secondary">
              Buscar
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Últimas incorporaciones</h2>
              <Button variant="outline">Ver todos</Button>
            </div>
            <div className="space-y-4">
              {recentUploads.map((item, i) => (
                <motion.div
                  key={`${item.title}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{item.type}</Badge>
                          </div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription>
                            {item.author} &middot; {item.date}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Deposita tu trabajo
                </CardTitle>
                <CardDescription>
                  Comparte tu producción académica en el repositorio institucional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Alumnos, profesores e investigadores pueden depositar tesis,
                  artículos, libros y otros documentos académicos.
                </p>
                <Button className="w-full">Subir documento</Button>
                <Button variant="outline" className="w-full">
                  Guía de depósito
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  Colecciones destacadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["Tesis doctorales", "Tesis de maestría", "Artículos de investigación", "Libros y capítulos", "Trabajos de grado"].map(
                    (col) => (
                      <li key={col}>
                        <Link
                          href="#"
                          className="text-sm text-primary hover:underline flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {col}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
