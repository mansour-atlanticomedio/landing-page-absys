"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "radix-ui";

import { ChevronDown, Mail, Phone, User } from "lucide-react";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import { Button } from "../ui/button";

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

    const MENU: { label: string; items: { label: string, to: string }[] }[] = [
        {
            label: "Inicio",
            items: [
                { to: "/", label: "Inicio" },
                { to: "/biblioteca", label: "Biblioteca" },
                { to: "/repositorios", label: "Repositorios" },
                { to: "/contacto", label: "Contacto" },
            ]
        },
        {
            label: "Conócenos",
            items: [],
        },
        {
            label: "Servicios",
            items: [],
        },
        {
            label: "Recursos",
            items: [],
        },
        {
            label: "Investigacion",
            items: [],
        },
        {
            label: "Formación",
            items: [],
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
                        <Mail className="w-4 h-4" /> biblioteca@atlanticomedio.es
                    </a>
                </div>
            </div>
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
                    <a href="/" className="flex items-center gap-3">
                        <div className="w-full flex" >
                            <Image
                                src={logo} alt="logo atlantico medio" width={130}
                            />
                            <Separator.Root
                                className="SeparatorRoot"
                                decorative
                                orientation="vertical"
                                style={{ margin: "0 15px", backgroundColor: "var(--color-accent)", width: "2px" }}
                            />
                            <div>
                                <h2 className="text-2xl font-bold" > Universidad Atlantico Medio </h2>
                                <h2 className="text-xl font-light" > Biblioteca </h2>
                            </div>
                        </div>
                    </a>
                    {/* <nav className="hidden md:flex items-center gap-8">
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
                    </nav> */}
                    {/* <div className="p-2 bg-blue-500" >
                    </div> */}
                    <Button className="p-5" >
                        <User />
                        Mi Cuenta
                    </Button>
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
                            {section.items.length > 0 &&

                                <div className="invisible bg-white absolute -left-6/12 top-full z-30 w-72 -translate-y-1 border border-border bg-card text-card-foreground opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                    <ul className="py-2">
                                        {section.items.map((it, index) => {
                                            const isActive = pathname === it.to;

                                            return (
                                                <li key={index}>
                                                    <Link
                                                        key={it.to}
                                                        href={it.to}
                                                        className={`uppercase text-sm font-semibold tracking-wider transition-colors block border-l-2 border-transparent px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5 text-primary ${isActive
                                                            ? "text-accent"
                                                            : "text-foreground hover:text-accent"
                                                            }`}
                                                    >
                                                        {it.label}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}