"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Mail, Phone } from "lucide-react";
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
        { to: "/programa", label: "Programa" },
        { to: "/inscripcion", label: "Inscripción" },
        { to: "/documentacion", label: "Documentación" },
        { to: "/contacto", label: "Contacto" },
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
                                    className={ `text-xs uppercase font-semibold ${isActive ? "text-accent" : "text-foreground"}`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                </nav>
            </header>
        </section>
    )
}