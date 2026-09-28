"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AltaState } from "@/app/(frontend)/profile/alta/actions";

interface AltaLectorFormProps {
  email: string;
  next: string;
  action: (prev: AltaState, formData: FormData) => Promise<AltaState>;
}

export default function AltaLectorForm({ email, next, action }: AltaLectorFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Card className="w-full">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-display text-2xl text-primary">Completa tu alta en la biblioteca</CardTitle>
          <CardDescription className="font-sans">
            Has entrado desde el campus, pero todavía no tienes ficha de lector. Necesitamos estos datos para crearla.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 py-6 sm:grid-cols-2">
          {state.error && (
            <div className="sm:col-span-2 flex items-center gap-2 p-3 text-sm rounded-md border border-destructive/30 bg-destructive/5 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input id="nombre" name="nombre" required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apellidos">Apellidos *</Label>
            <Input id="apellidos" name="apellidos" required autoComplete="family-name" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input id="direccion" name="direccion" required autoComplete="street-address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="colectivo">Colectivo *</Label>
            <Select name="colectivo" defaultValue="ALUMN" required>
              <SelectTrigger id="colectivo" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALUMN">Estudiante</SelectItem>
                <SelectItem value="PDI">PDI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" name="telefono" type="tel" autoComplete="tel" />
          </div>
          <input type="hidden" name="next" value={next} />
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 transition-colors">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Crear mi ficha de lector
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
