"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Globe, BookOpen, Video, Headphones, FileText, ExternalLink, Lock, Database, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const resourceCategories = [
  {
    id: "databases",
    label: "Bases de datos",
    items: [
      { name: "Scopus", description: "Resúmenes y citas de literatura científica", access: "subscription" },
      { name: "Web of Science", description: "Plataforma de investigación multidisciplinaria", access: "subscription" },
      { name: "JSTOR", description: "Colección de revistas académicas", access: "subscription" },
      { name: "SciELO", description: "Biblioteca científica electrónica", access: "open" },
      { name: "Redalyc", description: "Red de revistas científicas", access: "open" },
      { name: "DOAJ", description: "Revistas de acceso abierto", access: "open" },
    ],
  },
  {
    id: "ebooks",
    label: "Libros electrónicos",
    items: [
      { name: "EBSCO eBooks", description: "Colección multidisciplinaria de libros digitales", access: "subscription" },
      { name: "SpringerLink", description: "Libros y capítulos de ciencia y tecnología", access: "subscription" },
      { name: "Project Gutenberg", description: "Libros de dominio público", access: "open" },
    ],
  },
  {
    id: "media",
    label: "Recursos multimedia",
    items: [
      { name: "Kanopy", description: "Streaming de películas y documentales", access: "subscription" },
      { name: "Naxos Music Library", description: "Música clásica en streaming", access: "subscription" },
    ],
  },
]

export default function RecursosElectronicosPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Globe className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold mb-4">Recursos Electrónicos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Accede a bases de datos, libros digitales y contenido multimedia desde cualquier lugar
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="databases" className="w-full">
            <TabsList className="mb-12 flex-wrap h-auto">
              {resourceCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {resourceCategories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Card className="h-full group hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            {cat.id === "databases" ? (
                              <Database className="h-8 w-8 text-primary" />
                            ) : cat.id === "ebooks" ? (
                              <BookOpen className="h-8 w-8 text-primary" />
                            ) : (
                              <Video className="h-8 w-8 text-primary" />
                            )}
                            {item.access === "subscription" ? (
                              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                <Lock className="h-3 w-3" />
                                Suscripción
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                <FileText className="h-3 w-3" />
                                Acceso abierto
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" size="sm" className="w-full group">
                            Acceder
                            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        <motion.div
          className="mt-20 p-8 bg-muted rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start gap-4">
            <Bookmark className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-2">Acceso remoto</h3>
              <p className="text-muted-foreground mb-4">
                Puedes acceder a los recursos electrónicos desde fuera del campus
                utilizando tu cuenta institucional. Consulta nuestra guía de acceso remoto
                para configurar tu conexión.
              </p>
              <Button variant="default">
                Guía de acceso remoto
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
