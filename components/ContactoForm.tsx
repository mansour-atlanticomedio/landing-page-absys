"use client"

import { useState, useTransition } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { enviarContacto } from "@/app/(frontend)/contacto/actions"
import { ASUNTO_MAX, MENSAJE_MAX } from "@/lib/contacto"

interface ContactoFormProps {
  formToken: string
  solicitante: { nombre: string; email: string }
}

export default function ContactoForm({ formToken, solicitante }: ContactoFormProps) {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [enviando, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setError(null)
    setAviso(null)

    startTransition(async () => {
      try {
        const res = await enviarContacto(data)
        if (!res.ok) {
          setError(res.error)
          toast.error(res.error)
          return
        }
        if (res.duplicado) {
          // No se afirma un envío nuevo: el mensaje ya estaba recibido
          setAviso("Ya hemos recibido este mensaje. No hace falta que lo vuelvas a enviar.")
          toast.info("Ya hemos recibido este mensaje.")
          return
        }
        toast.success("Mensaje enviado. Te responderemos por correo lo antes posible.")
        setAsunto("")
        setMensaje("")
      } catch {
        const msg = "No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos."
        setError(msg)
        toast.error(msg)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-primary">Envíanos un mensaje</CardTitle>
        <CardDescription>
          Escribiendo como <strong>{solicitante.nombre}</strong> ({solicitante.email})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="form_token" value={formToken} />
          {/* Campo trampa: fuera de pantalla (no display:none, que los bots detectan) */}
          <div aria-hidden="true" inert style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor="website_url">No rellenar</label>
            <input type="text" id="website_url" name="website_url" autoComplete="off" tabIndex={-1} defaultValue="" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="asunto">Asunto</Label>
              <span id="asunto-contador" className="text-xs text-muted-foreground">{asunto.length}/{ASUNTO_MAX}</span>
            </div>
            <Input
              id="asunto"
              name="asunto"
              aria-describedby="asunto-contador"
              required
              minLength={3}
              maxLength={ASUNTO_MAX}
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="¿Sobre qué nos escribes?"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mensaje">Mensaje</Label>
              <span id="mensaje-contador" className="text-xs text-muted-foreground">{mensaje.length}/{MENSAJE_MAX}</span>
            </div>
            <Textarea
              id="mensaje"
              name="mensaje"
              aria-describedby="mensaje-contador"
              required
              minLength={10}
              maxLength={MENSAJE_MAX}
              rows={6}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Cuéntanos qué necesitas"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {aviso && (
            <p role="status" className="text-sm text-muted-foreground">
              {aviso}
            </p>
          )}

          <Button type="submit" disabled={enviando} className="bg-accent font-bold hover:bg-accent/90 transition-colors cursor-pointer">
            <Send className="h-4 w-4" />
            {enviando ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
