"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Building2, BookHeart, Target, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const teamMembers = [
  { name: "Dra. María García", role: "Directora de Biblioteca", image: "/team/directora.jpg" },
  { name: "Lic. Carlos López", role: "Coordinador de Servicios", image: "/team/coordinador.jpg" },
  { name: "Mtra. Ana Martínez", role: "Bibliotecóloga", image: "/team/bibliotecologa.jpg" },
  { name: "Ing. Roberto Sánchez", role: "Sistemas Digitales", image: "/team/sistemas.jpg" },
]

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="/about-bg.jpg"
          alt="Quiénes somos"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Quiénes somos
          </motion.h1>
          <motion.p
            className="text-xl text-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Conoce nuestra historia y compromiso con la educación
          </motion.p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          className="prose prose-lg max-w-none mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>
            Somos una biblioteca universitaria comprometida con la excelencia académica
            y la difusión del conocimiento. Desde nuestra fundación, hemos trabajado para
            ofrecer recursos de calidad que impulsen la investigación y el aprendizaje.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Target, title: "Misión", desc: "Proveer recursos informativos y servicios de calidad que apoyen la docencia, investigación y extensión universitaria." },
            { icon: Eye, title: "Visión", desc: "Ser un centro de referencia en gestión del conocimiento, innovando en servicios bibliotecarios digitales." },
            { icon: BookHeart, title: "Valores", desc: "Compromiso, excelencia, inclusión, innovación y trabajo en equipo para servir a nuestra comunidad." },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Nuestro equipo
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="relative w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
