"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "radix-ui";

import { ChevronDown, Mail, Phone, User, LogOut } from "lucide-react";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import { Button } from "../ui/button";

interface HeaderProps {
    type: string,
    phone?: string,
    email?: string,
    navbar: navMenuLinks[],
    account?: { email: string, nombre?: string } | null
}

interface NavLinkProps {
    label: string,
    href?: string,
    external: boolean,
    newTab: boolean,
}

interface navMenuLinks {
    name: string,
    href?: string,
    external: boolean,
    newTab: boolean,
    items: NavLinkProps[]
}

interface NavAnchorProps {
    href: string,
    external: boolean,
    newTab: boolean,
    className?: string,
    children: React.ReactNode,
}

// Enlace ya resuelto en servidor: interno con Link, externo/nueva pestaña con <a>. Las anclas a la
// página actual hacen scroll suave sin navegar ni añadir entradas al historial
function NavAnchor({ href, external, newTab, className, children }: NavAnchorProps) {
    const pathname = usePathname();

    if (external || newTab) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    }

    const [path, hash] = href.split("#");

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!hash || path !== pathname) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

        const target = document.getElementById(hash);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Solo el hash, así el basePath lo mantiene el navegador
        window.history.replaceState(null, "", `#${hash}`);
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}

export default function Header({ type, phone, email, navbar, account }: HeaderProps) {
    const pathname = usePathname();

    const navbarMenu = navbar ?? [];

    // Limpia también lo que dejaba el login antiguo; la sesión real la cierra el POST a /auth/logout
    const handleLogOut = () => {
        localStorage.removeItem("lenlec");
        localStorage.removeItem("lepass");
    }

    return (
        <section>
            {(phone || email) && <div id="top-arrow" className="bg-topbar text-primary-foreground text-sm">
                <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-center gap-x-10 gap-y-1">
                    {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 hover:opacity-80">
                        <Phone className="w-4 h-4" /> {phone}
                    </a>}
                    {email && <a href={`mailto:${email}`} className="flex items-center gap-2 hover:opacity-80">
                        <Mail className="w-4 h-4" /> {email}
                    </a>}
                </div>
            </div>}
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
                    <a href="/biblioteca" className="flex items-center gap-3">
                        <div className="w-full flex" >
                            <Image
                                src={logo} alt="logo atlantico medio header" width={130}
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

                    {
                        !account ? (
                            <Button asChild className="p-5 cursor-pointer font-bold hover:p-5.5">
                                {/* <a href={`/biblioteca/auth/login?next=${encodeURIComponent(pathname || "/perfil")}`}> */}
                                <a href={ pathname ? `/biblioteca/login` : "/perfil" }>
                                    <User />
                                    Mi Cuenta
                                </a>
                            </Button>
                        ) : (
                            <div className="group relative">
                                <Button
                                    className="p-5 cursor-pointer text-primary bg-transparent border-primary font-bold hover:p-5.5 hover:border-0 hover:bg-primary hover:text-white"
                                >
                                    <User />
                                    Mi Perfil
                                    <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" />
                                </Button>

                                <div className="absolute right-0 top-full z-30 w-56 -translate-y-1 border border-border bg-card text-card-foreground opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                    <ul className="py-2 bg-white">
                                        <li>
                                            <Link
                                                href="/perfil"
                                                className="block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground border-l-2 border-transparent hover:border-primary hover:bg-primary/5 hover:text-primary"
                                            >
                                                Perfil
                                            </Link>
                                            <Link
                                                href="/reservas"
                                                className="block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground border-l-2 border-transparent hover:border-primary hover:bg-primary/5 hover:text-primary"
                                            >
                                                Reservas
                                            </Link>
                                            <Link
                                                href="/prestamos"
                                                className="block px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground border-l-2 border-transparent hover:border-primary hover:bg-primary/5 hover:text-primary"
                                            >
                                                Préstamos
                                            </Link>
                                        </li>
                                        <li>
                                            <form method="post" action="/biblioteca/auth/logout" onSubmit={() => handleLogOut()}>
                                                <button
                                                    type="submit"
                                                    className="flex gap-2 items-center w-full text-left block px-2 py-2 text-sm font-semibold uppercase tracking-wider text-foreground border-l-2 border-transparent hover:border-primary hover:bg-primary/5 hover:text-primary"
                                                >
                                                    <LogOut size={16} className="text-red-500" />
                                                    Cerrar sesión
                                                </button>
                                            </form>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    }
                </div>
            </header>
            <div className="border-t border-border bg-primary text-primary-foreground flex items-center justify-center">
                <div className="max-w-7xl flex items-center justify-center px-6 md:flex">
                    {navbarMenu.map((section, index) => {
                        const triggerClasses = "flex h-12 items-center gap-1 px-10 text-sm font-bold tracking-wide transition cursor-pointer group-hover:bg-primary-foreground/10 group-focus-within:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";
                        const content = (
                            <>
                                {section.name}
                                {
                                    section.items.length > 0 && (
                                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                                    )
                                }
                            </>
                        );

                        return (
                            <div key={section.name + section.href + index} className="group relative">
                                {section.href ? (
                                    <NavAnchor href={section.href} external={section.external} newTab={section.newTab} className={triggerClasses}>
                                        {content}
                                    </NavAnchor>
                                ) : (
                                    <button type="button" aria-haspopup="true" className={triggerClasses}>
                                        {content}
                                    </button>
                                )}
                                {section.items.length > 0 &&

                                    <div className="invisible bg-white absolute -left-6/12 top-full z-30 w-72 -translate-y-1 border border-border bg-card text-card-foreground opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                        <ul className="py-2">
                                            {section.items.map((it, itemIndex) => {
                                                const isActive = pathname === it.href?.split("#")[0] && !it.href?.includes("#");

                                                const linkClasses = `uppercase text-start text-sm font-semibold tracking-wider transition-colors block border-l-2 border-transparent px-4 py-2 hover:border-primary hover:bg-primary/5 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive
                                                    ? "text-accent"
                                                    : "text-foreground hover:text-accent"
                                                    }`;

                                                return (
                                                    <li key={itemIndex}>
                                                        <NavAnchor href={it.href ?? "/"} external={it.external} newTab={it.newTab} className={linkClasses}>
                                                            {it.label}
                                                        </NavAnchor>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}