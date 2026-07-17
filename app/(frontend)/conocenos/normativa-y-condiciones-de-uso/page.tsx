"use client"

import { motion } from "framer-motion"
import { FileText, Shield, AlertTriangle, CheckCircle, BookX } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const regulations = [
  {
    title: "Reglamento general",
    content: "El usuario debe portar su credencial vigente para ingresar. El horario de servicio está sujeto a cambios según el calendario académico.",
  },
  {
    title: "Préstamo de materiales",
    content: "Los libros pueden solicitarse por un máximo de 15 días. Materiales de referencia no pueden ser retirados de la biblioteca.",
  },
  {
    title: "Uso de salas de estudio",
    content: "Las salas grupales deben reservarse con 24h de anticipación. El aforo máximo debe respetarse en todo momento.",
  },
  {
    title: "Recursos digitales",
    content: "El acceso a bases de datos es exclusivo para miembros de la comunidad universitaria. No compartir credenciales de acceso.",
  },
  {
    title: "Sanciones",
    content: "El retraso en devolución genera multas. El daño o pérdida de materiales deberá ser repuesto o cubierto económicamente.",
  },
]

const policies = [
  { icon: Shield, title: "Privacidad de datos", desc: "Tus datos personales están protegidos bajo la ley de protección de datos." },
  { icon: CheckCircle, title: "Uso aceptable", desc: "Los recursos deben usarse exclusivamente con fines académicos y de investigación." },
  { icon: AlertTriangle, title: "Restricciones", desc: "No está permitido consumir alimentos o bebidas cerca de los materiales." },
  { icon: BookX, title: "Material restringido", desc: "Algunos documentos solo están disponibles para consulta en sala." },
]

export default function NormativaPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FileText className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold mb-4">Normativa y condiciones de uso</h1>
          <p className="text-xl text-muted-foreground">
            Conoce las reglas y políticas para el uso de nuestros servicios
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8">Reglamento</h2>
            <Accordion type="single" collapsible className="w-full">
              {regulations.map((item, i) => (
                <AccordionItem key={item.title} value={`item-${i}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8">Políticas</h2>
            <div className="space-y-4">
              {policies.map((policy) => {
                const Icon = policy.icon
                return (
                  <Card key={policy.title}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{policy.title}</CardTitle>
                        <CardContent className="p-0 text-muted-foreground">
                          {policy.desc}
                        </CardContent>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
