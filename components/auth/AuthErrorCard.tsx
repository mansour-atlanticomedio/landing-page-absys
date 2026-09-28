"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthErrorCardProps {
  titulo: string;
  texto: string;
}

export default function AuthErrorCard({ titulo, texto }: AuthErrorCardProps) {
  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <AlertCircle className="h-10 w-10 text-accent" />
        <CardTitle className="font-display text-2xl text-primary">{titulo}</CardTitle>
        <CardDescription className="font-sans">{texto}</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="flex flex-wrap gap-3">
        <Button asChild className="bg-accent hover:bg-accent/90 transition-colors">
          <a href="/biblioteca/auth/login">Volver a intentarlo</a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contacto">Contactar con la biblioteca</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
