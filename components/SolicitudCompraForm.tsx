"use client"

import { useState } from "react"
import { BookOpen, Plus, BookPlus, Trash2, User, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COLECTIVOS = [
  { value: "alumno", label: "Alumno / Estudiante" },
  { value: "profesor", label: "Profesor" },
  { value: "pdi", label: "PDI (Personal Docente e Investigador)" },
  { value: "pas", label: "PAS (Personal de Administración y Servicios)" },
]

interface LibroCampo {
  name: string
  label: string
  placeholder: string
  required?: boolean
  type?: string
  fullWidth?: boolean
}

const CAMPOS_LIBRO: LibroCampo[] = [
  { name: "titulo", label: "Título del libro", placeholder: "Título completo de la obra", required: true, fullWidth: true },
  { name: "autor", label: "Autor(es)", placeholder: "Apellidos, Nombre", required: true },
  { name: "editorial", label: "Editorial", placeholder: "Nombre de la editorial" },
  { name: "anio", label: "Año de edición", placeholder: "Ej. 2024" },
  { name: "isbn", label: "ISBN", placeholder: "978-XXXXXXXXXX" },
  { name: "enlace", label: "Enlace de interés (opcional · web de editorial, Amazon, etc.)", placeholder: "https://...", type: "url", fullWidth: true },
]

export default function SolicitudCompraForm() {
  // Cada libro lleva un id propio para que React no mezcle los valores al eliminar uno del medio
  const [libros, setLibros] = useState<number[]>([0])
  const [siguienteId, setSiguienteId] = useState(1)
  const [colectivo, setColectivo] = useState("")
  const [nombre, setNombre] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const agregarLibro = () => {
    setLibros((prev) => [...prev, siguienteId])
    setSiguienteId((prev) => prev + 1)
  }

  const eliminarLibro = (id: number) => {
    setLibros((prev) => (prev.length > 1 ? prev.filter((l) => l !== id) : prev))
  }

  const limpiar = () => {
    setLibros([0])
    setSiguienteId(1)
    setColectivo("")
    setNombre("")
    setFormKey((k) => k + 1)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setNombre(String(data.get("nombreSolicitante") ?? ""))
    setEnviado(true)
  }

  const cerrarModal = () => {
    setEnviado(false)
    limpiar()
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto overflow-hidden gap-0 py-0">
        <CardHeader className="bg-primary text-primary-foreground px-6 py-6">
          <CardTitle className="font-display text-xl flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-accent" />
            Formulario de Desiderata (Propuesta de Compra)
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Utiliza este formulario para sugerir la adquisición de libros, manuales u obras de referencia
            que consideres necesarias para la docencia, el estudio o la investigación.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form key={formKey} onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <div className="border-b border-border pb-6">
              <h3 className="font-display font-semibold text-primary mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                1. Datos del solicitante
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombreSolicitante">Nombre y apellidos *</Label>
                  <Input id="nombreSolicitante" name="nombreSolicitante" required placeholder="Ej. Ana María Rodríguez Pérez" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emailSolicitante">Correo electrónico institucional *</Label>
                  <Input id="emailSolicitante" name="emailSolicitante" type="email" required placeholder="usuario@atlanticomedio.es" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="colectivoSolicitante">Colectivo / Perfil *</Label>
                  <Select name="colectivoSolicitante" value={colectivo} onValueChange={setColectivo} required>
                    <SelectTrigger id="colectivoSolicitante" className="w-full">
                      <SelectValue placeholder="Selecciona tu colectivo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COLECTIVOS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gradoSolicitante">Grado o titulación / departamento *</Label>
                  <Input id="gradoSolicitante" name="gradoSolicitante" required placeholder="Ej. Grado en Administración y Dirección de Empresas" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="font-display font-semibold text-primary flex items-center gap-2">
                  <BookPlus className="h-5 w-5 text-accent" />
                  2. Obras solicitadas ({libros.length})
                </h3>
                <span className="text-xs text-muted-foreground italic">Puedes proponer uno o varios libros</span>
              </div>

              <div className="space-y-6">
                {libros.map((id, index) => (
                  <div key={id} className="rounded-lg border border-border bg-muted p-5">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Propuesta de libro #{index + 1}
                      </span>
                      {libros.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarLibro(id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar libro
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {CAMPOS_LIBRO.map(({ name, label, placeholder, required, type, fullWidth }) => (
                        <div key={name} className={`space-y-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
                          <Label htmlFor={`${name}-${id}`}>{label}{required && " *"}</Label>
                          <Input
                            id={`${name}-${id}`}
                            name={name}
                            type={type ?? "text"}
                            required={required}
                            placeholder={placeholder}
                            className="bg-background"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                onClick={agregarLibro}
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Añadir otro libro a la propuesta
              </Button>
              <span className="text-xs text-muted-foreground">* Todos los campos con asterisco son obligatorios</span>
            </div>

            <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={limpiar} className="cursor-pointer">
                Cancelar / Limpiar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                Enviar propuesta de compra
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={enviado} onOpenChange={(open) => { if (!open) cerrarModal() }}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="font-display text-lg text-primary">¡Propuesta enviada con éxito!</DialogTitle>
            <DialogDescription>
              Gracias, {nombre}. Se {libros.length === 1 ? "ha registrado 1 obra" : `han registrado ${libros.length} obras`} en
              tu propuesta de desiderata para la Biblioteca de la Universidad Atlántico Medio.
              Recibirás confirmación en tu correo institucional.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={cerrarModal} className="w-full cursor-pointer">Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
