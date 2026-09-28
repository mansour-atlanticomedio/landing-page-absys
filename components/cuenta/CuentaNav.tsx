"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECCIONES = [
  { href: "/perfil", label: "Perfil" },
  { href: "/prestamos", label: "Préstamos" },
  { href: "/reservas", label: "Reservas" },
];

export default function CuentaNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mi cuenta" className="border-b border-border">
      <ul className="flex gap-8">
        {SECCIONES.map(({ href, label }) => {
          const activa = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activa ? "page" : undefined}
                className={`inline-block -mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activa ? "border-accent text-primary" : "border-transparent text-muted-foreground hover:text-primary"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
