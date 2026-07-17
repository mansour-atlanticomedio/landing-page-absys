"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Phone, Mail, Calendar, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const schedules = [
  { day: "Lunes a viernes", hours: "08:00 - 20:00", type: "regular" },
  { day: "Sábados", hours: "09:00 - 14:00", type: "regular" },
  { day: "Domingos y festivos", hours: "Cerrado", type: "closed" },
  { day: "Período de exámenes", hours: "08:00 - 22:00", type: "extended" },
  { day: "Vacaciones", hours: "09:00 - 15:00", type: "holiday" },
]

const contactInfo = [
  { icon: MapPin, label: "Dirección", value: "Av. Universidad 123, Col. Centro, 80000 Culiacán, Sin." },
  { icon: Phone, label: "Teléfono", value: "+52 (667) 123-4567" },
  { icon: Mail, label: "Correo electrónico", value: "biblioteca@universidad.edu.mx" },
  { icon: Building2, label: "Edificio", value: "Edificio de Bibliotecas, Planta Baja" },
]

export default function HorariosUbicacionContactoPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <MapPin className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-5xl font-bold mb-4">Horarios, ubicación y contacto</h1>
          <p className="text-xl text-muted-foreground">
            Estamos aquí para atenderte
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Horarios
            </h2>
            <div className="space-y-3">
              {schedules.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border"
                >
                  <span className="font-medium">{item.day}</span>
                  <span
                    className={
                      item.type === "closed"
                        ? "text-destructive font-semibold"
                        : item.type === "extended"
                          ? "text-green-600 font-semibold"
                          : "text-foreground"
                    }
                  >
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Los horarios pueden variar durante períodos extraordinarios.
                Consulta el calendario académico para fechas específicas.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Phone className="h-8 w-8 text-primary" />
              Contacto
            </h2>
            <div className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.label}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </CardTitle>
                        <p className="text-base font-semibold">{item.value}</p>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8 rounded-lg overflow-hidden border h-[250px] bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Mapa interactivo</p>
                <p className="text-sm">Aquí se integraría un componente Google Maps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
