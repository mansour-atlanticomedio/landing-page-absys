"use client";

import { IdCard, Mail, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileDatosCardProps {
  nombre: string;
  email: string;
  numeroLector: string;
}

export default function ProfileDatosCard({ nombre, email, numeroLector }: ProfileDatosCardProps) {
  const datos = [
    { icon: User, label: "Nombre", value: nombre },
    { icon: Mail, label: "Email", value: email },
    { icon: IdCard, label: "Número de lector", value: numeroLector },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl text-primary">Datos del lector</CardTitle>
        <CardDescription className="font-sans">Información de tu ficha en la biblioteca.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-3">
          {datos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-medium text-foreground break-all">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
