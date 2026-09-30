"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { actualizarPerfil, type EditarPerfilState } from "@/app/(frontend)/(cuenta)/perfil/actions";

interface PerfilFormProps {
  nombre: string;
  apellidos: string;
}

export default function PerfilForm({ nombre, apellidos }: PerfilFormProps) {
  const [state, formAction, pending] = useActionState<EditarPerfilState, FormData>(actualizarPerfil, {});

  return (
    <form action={formAction} className="grid gap-4 py-4 sm:grid-cols-2 sm:items-end border-y border-border">
      {state.error && (
        <div className="sm:col-span-2 flex items-center gap-2 p-3 text-sm rounded-md border border-destructive/30 bg-destructive/5 text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="sm:col-span-2 flex items-center gap-2 p-3 text-sm rounded-md border border-accent/30 bg-accent/5 text-accent">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Datos actualizados.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" defaultValue={nombre} required autoComplete="given-name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="apellidos">Apellidos</Label>
        <Input id="apellidos" name="apellidos" defaultValue={apellidos} required autoComplete="family-name" />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 transition-colors">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
