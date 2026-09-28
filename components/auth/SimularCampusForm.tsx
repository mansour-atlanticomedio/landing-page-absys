"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SimularCampusForm({ next }: { next: string }) {
  return (
    <Card className="w-full max-w-lg shadow-xl">
      <form method="get" action="/biblioteca/auth/simular-campus/emitir">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-primary">Campus simulado (desarrollo)</CardTitle>
          <CardDescription className="font-sans">
            Genera un token cifrado igual que el campus y vuelve a la biblioteca con él. Esta página no existe en producción.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 py-4">
          <Label htmlFor="email">Email del campus</Label>
          <Input id="email" name="email" type="email" required placeholder="nombre.apellido@atlanticomedio.es" />
          <input type="hidden" name="next" value={next} />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-accent hover:bg-accent/90 transition-colors">
            Entrar como este usuario
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
