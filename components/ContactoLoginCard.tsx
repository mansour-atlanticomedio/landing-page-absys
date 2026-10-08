"use client"

import Link from "next/link"
import { LogIn, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ContactoLoginCardProps {
  telefono: string
  email: string
}

export default function ContactoLoginCard({ telefono, email }: ContactoLoginCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-primary">Inicia sesión para escribirnos</CardTitle>
        <CardDescription>
          El formulario de contacto está disponible para los lectores de la Biblioteca. Accede con tu cuenta del campus.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button asChild className="bg-accent font-bold hover:bg-accent/90 transition-colors">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </Link>
        </Button>
        <div className="border-t border-border pt-4 text-sm text-muted-foreground space-y-2">
          <p>Si prefieres no iniciar sesión, también puedes contactar con nosotros directamente:</p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" />
            <a href={`tel:${telefono.replace(/\s/g, "")}`} className="hover:text-accent">{telefono}</a>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" />
            <a href={`mailto:${email}`} className="hover:text-accent">{email}</a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
