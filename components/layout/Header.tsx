"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown, Mail, Phone } from "lucide-react";
import logo from "@/public/logos/logo.png";
import Image from "next/image";

interface NavLinkProps {
    to: string,
    label: string,
}

export default function Header() {

    const pathname = usePathname();

    const navItems: NavLinkProps[] = [
        { to: "/", label: "Inicio" },
        { to: "/biblioteca", label: "Biblioteca" },
        { to: "/repositorios", label: "Repositorios" },
        { to: "/contacto", label: "Contacto" },
    ];

    const MENU: { label: string; items: string[] }[] = [
        {
            label: "La Biblioteca",
            items: ["Conócenos", "Bibliotecas", "Normativa", "Directorio", "Compromiso y proyección social", "Evaluación y calidad", "Archivo Universitario"],
        },
        {
            label: "Encuentra",
            items: ["Faro", "Catálogo - Mi Biblioteca", "Recursos-e (Lista A-Z)", "Publicaciones e. (revistas y libros electrónicos)", "Biblioteca A-Z", "e-BUlibros: préstamo de libros-e"],
        },
        {
            label: "Servicios",
            items: ["Formación", "Préstamo y acceso al documento", "Apoyo a la investigación", "Reprografía e Impresión 3D", "BUstreaming: autopublicación de audio y vídeo", "Pregúntanos"],
        },
        {
            label: "Espacios",
            items: ["Espacio Pósit", "Sala Pino Ojeda", "Salas de lectura", "Espacios de trabajo colaborativo", "Espacio Violeta", "Espacio Internacional", "MakerSpace", "Espacio de grabación", "Sala La Isleta", "Cabina para videoconferencias", "Sala Natalia Sosa Ayala", "Korea Corner", "Sala Josefina Plá", "Travel Tech School by Amadeus", "Sala Lothar Siemens", "Mediateca"],
        },
        {
            label: "Portales",
            items: ["accedaCRIS", "Archivo Gráfico Institucional", "Biblioteca Musicológica Lothar Siemens", "CraaL", "Enrique Copeiro", "Exlibris", "Los Guanchismos", "Jable", "Memoria digital de Canarias", "PAMEV", "SUdocument@", "Toponimia de Canarias"],
        },
    ];

    return (
        <section>
            <div id="top-arrow" className="bg-topbar text-primary-foreground text-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-1">
                    <a href="tel:+34828019019" className="flex items-center gap-2 hover:opacity-80">
                        <Phone className="w-4 h-4" /> +34 828 019 019
                    </a>
                    <a href="mailto:jornadas@atlanticomedio.es" className="flex items-center gap-2 hover:opacity-80">
                        <Mail className="w-4 h-4" /> investigacion@atlanticomedio.es
                    </a>
                </div>
            </div>
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
                    <a href="/" className="flex items-center gap-3">
                        <Image
                            src={logo} alt="logo atlantico medio" width={130}
                        />
                    </a>
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.to;

                            return (
                                <Link
                                    key={item.to}
                                    href={item.to}
                                    className={`uppercase text-sm font-semibold tracking-wider transition-colors ${isActive
                                        ? "text-accent"
                                        : "text-foreground hover:text-accent"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                {/* Mobile nav */}
                <nav className="md:hidden border-t border-border flex justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.to;

                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                className={`text-xs uppercase font-semibold ${isActive ? "text-accent" : "text-foreground"}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>
            <div className="border-t border-border bg-primary text-primary-foreground">
                <div className="max-w-7xl flex items-center justify-evenly px-6 md:flex">
                    {MENU.map((section) => (
                        <div key={section.label} className="group relative">
                            <button className="flex h-12 items-center gap-1 px-4 text-sm font-bold tracking-wide transition group-hover:bg-primary-foreground/10">
                                {section.label}
                                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                            </button>
                            <div className="invisible bg-white absolute -left-6/12 top-full z-30 w-72 -translate-y-1 border border-border bg-card text-card-foreground opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                <ul className="py-2">
                                    {section.items.map((it) => (
                                        <li key={it}>
                                            <a href="#" className="block border-l-2 border-transparent px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5 text-primary">
                                                {it}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}