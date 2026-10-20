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
  const CAMPUS_URI = process.env.NEXT_PUBLIC_CAMPUS_URI;

  return (
    <Card className="w-full max-w-lg shadow-xl flex">
      <CardHeader className="flex flex-col items-center gap-3" >
        <AlertCircle className="h-10 w-10 text-accent" />
        <CardTitle className="font-display font-bold text-2xl text-primary">{titulo}</CardTitle>
        <CardDescription className="font-sans text-center">{texto}</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-accent font-bold hover:bg-accent/90 transition-colors">
          <a
            target="_blank"
            rel="noopener noreferrer" 
            href={CAMPUS_URI}
          >
            Volver a intentarlo
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/conocenos/horarios-ubicacion-y-contacto">Contactar con la biblioteca</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
