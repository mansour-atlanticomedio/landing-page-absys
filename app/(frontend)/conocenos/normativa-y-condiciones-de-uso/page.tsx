"use client"

import { motion } from "framer-motion"
import { FileText, Shield, AlertTriangle, CheckCircle, BookX, Download, Monitor, Library, Users } from "lucide-react"
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
    <div className="min-h-screen bg-white">
      {/* <SiteHeader active="CONÓCENOS" /> */}

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="text-4xl font-extrabold text-slate-800">Normativa y condiciones de uso</h1>
        <p className="mt-3 text-slate-600 max-w-3xl">
          La Biblioteca Universitaria proporciona espacios, colecciones y servicios para apoyar
          el aprendizaje, la docencia y la investigación. El uso responsable de estos recursos
          garantiza un entorno óptimo para toda la comunidad académica.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-800 mb-2">Personas usuarias</h2>
            <p className="text-sm text-slate-600">
              Tienen acceso a los servicios de la Biblioteca todos los miembros de la comunidad
              universitaria (estudiantes, PDI, PTGAS). Otras personas pueden acceder en
              condiciones específicas según los convenios vigentes, requiriendo acreditación
              mediante la tarjeta universitaria o documento equivalente.
            </p>
          </div>

          <div className="border rounded-lg p-6 relative">
            <span className="absolute top-6 right-6 bg-slate-800 text-white text-xs rounded-full px-3 py-1">
              Próximamente
            </span>
            <div className="bg-slate-100 text-slate-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-800 mb-2">Préstamos y renovaciones</h2>
            <p className="text-sm text-slate-600">
              Información detallada sobre plazos, límites de ejemplares y procesos de renovación
              estará disponible en esta sección en la próxima actualización de la normativa.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
              <Library className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-800 mb-4">Espacios y recursos</h2>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>✓ Mantener un ambiente de estudio silencioso en las salas de lectura generales.</li>
              <li>✓ Respetar las normas de uso de las salas de trabajo en grupo (reserva previa necesaria).</li>
              <li>✓ No consumir alimentos o bebidas (excepto agua en envases con cierre) en las zonas de estudio.</li>
              <li>✓ Hacer un uso adecuado de los equipos informáticos y de reproducción.</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <div className="bg-sky-100 text-sky-700 rounded-md h-10 w-10 flex items-center justify-center mb-4">
              <Monitor className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-800 mb-2">Recursos electrónicos</h2>
            <p className="text-sm text-slate-600 mb-4">
              El acceso a las bases de datos, revistas y libros electrónicos suscritos está
              sujeto a las licencias de uso firmadas con los proveedores.
            </p>
            <div className="bg-slate-50 border rounded-md p-4">
              <p className="text-sm font-semibold text-slate-800 mb-1">Restricciones importantes:</p>
              <p className="text-sm text-slate-600">
                Se prohíbe la descarga masiva de contenidos y el uso de los recursos para fines
                comerciales o ajenos a las actividades académicas de la institución.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Responsabilidad sobre los materiales
          </h2>
          <p className="text-sm text-slate-600">
            Las personas usuarias son responsables de la conservación de los fondos y
            equipamientos de la Biblioteca. El deterioro, mutilación o pérdida de las obras
            prestadas obligará a su reposición o, en caso de estar agotadas, al pago de su valor
            estimado o a la entrega de una obra de similares características.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button className="bg-slate-800 text-white rounded-md px-6 py-3 font-medium flex items-center gap-2">
            <Download className="h-4 w-4" /> Descargar normativa completa (PDF)
          </button>
        </div>
      </section>

      {/* <SiteFooter /> */}
    </div>
  );
}
