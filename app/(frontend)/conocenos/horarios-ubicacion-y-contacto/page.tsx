"use client"
import Image from "next/image";
import { Info, Clock, MapPin, HelpCircle as PhoneHelp, Mail, Navigation, CircleHelp, Phone, Building2 } from "lucide-react";
import { motion } from "framer-motion"
// import { MapPin, Clock, Phone, Mail, Calendar, Building2 } from "lucide-react"
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
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="CONÓCENOS" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-4xl font-extrabold text-slate-800">Horarios, ubicación y contacto</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Encuentra toda la información necesaria para visitar nuestras instalaciones o ponerte
          en contacto con el equipo de la Biblioteca Universitaria.
        </p>

        <div className="mt-10 grid grid-cols-[380px_1fr] gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
              <Info className="h-5 w-5 text-teal-600" /> Información General
            </h2>

            <div className="flex gap-3 mb-5">
              <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Horario de atención</p>
                <p className="text-sm text-slate-600">Lunes a Viernes</p>
                <p className="text-sm text-slate-600">9:00 a 14:00 h.</p>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Ubicación</p>
                <p className="text-sm text-slate-600">Edificio EMU de Usos Múltiples</p>
                <p className="text-sm text-slate-600">Carretera de Quilmes, 37</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <PhoneHelp className="h-5 w-5 text-slate-500 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Contacto Directo</p>
                <p className="text-sm text-slate-600">+34 828 019 019</p>
                <p className="text-sm text-teal-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> biblioteca@atlanticomedio.es
                </p>
              </div>
            </div>

            <button className="w-full bg-slate-800 text-white rounded-md py-2.5 font-medium flex items-center justify-center gap-2 mb-3">
              <Mail className="h-4 w-4" /> Contactar con la Biblioteca
            </button>
            <button className="w-full border rounded-md py-2.5 font-medium flex items-center justify-center gap-2 text-slate-800">
              <Navigation className="h-4 w-4" /> Cómo llegar
            </button>
          </div>

          <div className="space-y-6">
            <div className="relative h-72 rounded-lg overflow-hidden">
              <Image src="/img/edificio-emu.jpg" alt="" fill className="object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                <p className="font-bold text-lg">Edificio EMU de Usos Múltiples</p>
                <p className="text-sm">🏛 Campus Universitario</p>
              </div>
            </div>
            <div className="relative h-72 rounded-lg overflow-hidden bg-slate-100">
              <Image src="/img/mapa.jpg" alt="" fill className="object-cover" />
            </div>
          </div>
        </div>

        <div className="mt-10 border rounded-lg p-6 flex items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="bg-slate-100 rounded-md h-10 w-10 flex items-center justify-center">
              <CircleHelp className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">¿Necesitas ayuda adicional?</p>
              <p className="text-sm text-slate-600">
                Consulta nuestras preguntas frecuentes o solicita una cita con un bibliotecario.
              </p>
            </div>
          </div>
          <button className="border rounded-md px-5 py-2.5 font-medium text-slate-800">
            Ver FAQs
          </button>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
