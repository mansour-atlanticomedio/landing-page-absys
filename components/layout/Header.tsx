"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "radix-ui";

import { ChevronDown, Mail, Phone, User, LogOut, Menu, X } from "lucide-react";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import { Button } from "../ui/button";

interface HeaderProps {
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
    onNavigate?: () => void,
    children: React.ReactNode,
}

// Enlace ya resuelto en servidor: interno con Link, externo/nueva pestaña con <a>. Las anclas a la
// página actual hacen scroll suave sin navegar ni añadir entradas al historial
function NavAnchor({ href, external, newTab, className, onNavigate, children }: NavAnchorProps) {
    const pathname = usePathname();

    if (external || newTab) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
                {children}
            </a>
        );
    }

    const [path, hash] = href.split("#");

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onNavigate?.();
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

export default function Header({ phone, email, navbar, account }: HeaderProps) {
    const pathname = usePathname();

    const navbarMenu = navbar ?? [];

    const [menuOpen, setMenuOpen] = useState(false);
    const [openSection, setOpenSection] = useState<number | null>(null);

    const closeMenu = () => {
        setMenuOpen(false);
        setOpenSection(null);
    };

    useEffect(() => {
        closeMenu();
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };
        const onResize = () => {
            if (window.innerWidth >= 1024) closeMenu();
        };
        document.addEventListener("keydown", onKey);
        window.addEventListener("resize", onResize);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", onResize);
            document.body.style.overflow = previous;
        };
    }, [menuOpen]);

    const mobileLinkClasses = "flex min-h-11 items-center px-6 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

    // Limpia también lo que dejaba el login antiguo; la sesión real la cierra el POST a /auth/logout
    const handleLogOut = () => {
        localStorage.removeItem("lenlec");
        localStorage.removeItem("lepass");
    }

    return (
        <section>
            {(phone || email) && <div id="top-arrow" className="bg-topbar text-primary-foreground text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-x-10 gap-y-1">
                    {phone && <a href={`tel:${phone}`} className="flex min-h-8 items-center gap-2 break-all hover:opacity-80">
                        <Phone className="w-4 h-4" /> {phone}
                    </a>}
                    {email && <a href={`mailto:${email}`} className="flex min-h-8 items-center gap-2 break-all hover:opacity-80">
                        <Mail className="w-4 h-4" /> {email}
                    </a>}
                </div>
            </div>}
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6">
                    <a href="/biblioteca" className="flex min-w-0 items-center gap-3">
                        <div className="w-full flex items-center" >
                            <Image
                                src={logo} alt="logo atlantico medio header" width={130} className="h-auto w-20 sm:w-[130px] shrink-0"
                            />
                            <Separator.Root
                                className="SeparatorRoot"
                                decorative
                                orientation="vertical"
                                style={{ margin: "0 10px", backgroundColor: "var(--color-accent)", width: "2px" }}
                            />
                            <div>
                                <h2 className="hidden sm:block text-xl lg:text-2xl font-bold" > Universidad Atlantico Medio </h2>
                                <h2 className="text-lg sm:text-xl font-light" > Biblioteca </h2>
                            </div>
                        </div>
                    </a>

                    <div className="flex items-center gap-2">
                    <div className="hidden lg:block">
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
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-11 lg:hidden"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </Button>
                    </div>
                </div>
                {menuOpen && (
                    <nav
                        id="mobile-menu"
                        aria-label="Navegación principal"
                        className="lg:hidden max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden border-t border-border bg-primary text-primary-foreground"
                    >
                        <ul>
                            {navbarMenu.map((section, index) => {
                                const hasItems = section.items.length > 0;
                                const expanded = openSection === index;
                                const panelId = `mobile-section-${index}`;

                                return (
                                    <li key={section.name + section.href + index} className="border-b border-primary-foreground/10">
                                        {hasItems ? (
                                            <>
                                                <button
                                                    type="button"
                                                    aria-expanded={expanded}
                                                    aria-controls={panelId}
                                                    onClick={() => setOpenSection(expanded ? null : index)}
                                                    className={`${mobileLinkClasses} w-full justify-between cursor-pointer text-left`}
                                                >
                                                    {section.name}
                                                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                                                </button>
                                                {expanded && (
                                                    <ul id={panelId} className="bg-primary-foreground/10">
                                                        {section.href && (
                                                            <li>
                                                                <NavAnchor href={section.href} external={section.external} newTab={section.newTab} onNavigate={closeMenu} className={`${mobileLinkClasses} pl-10`}>
                                                                    {section.name}
                                                                </NavAnchor>
                                                            </li>
                                                        )}
                                                        {section.items.map((it, itemIndex) => (
                                                            <li key={itemIndex}>
                                                                <NavAnchor href={it.href ?? "/"} external={it.external} newTab={it.newTab} onNavigate={closeMenu} className={`${mobileLinkClasses} pl-10 normal-case`}>
                                                                    {it.label}
                                                                </NavAnchor>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : section.href ? (
                                            <NavAnchor href={section.href} external={section.external} newTab={section.newTab} onNavigate={closeMenu} className={mobileLinkClasses}>
                                                {section.name}
                                            </NavAnchor>
                                        ) : (
                                            <span className={mobileLinkClasses}>{section.name}</span>
                                        )}
                                    </li>
                                );
                            })}
                            <li className="p-4">
                                {!account ? (
                                    <Button asChild variant="secondary" className="h-11 w-full font-bold">
                                        <a href={pathname ? `/biblioteca/login` : "/perfil"}>
                                            <User />
                                            Mi Cuenta
                                        </a>
                                    </Button>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-2 px-2 pb-1 text-sm font-bold">
                                            <User className="h-4 w-4" />
                                            Mi Perfil
                                        </p>
                                        <Link href="/perfil" onClick={closeMenu} className={`${mobileLinkClasses} px-2`}>Perfil</Link>
                                        <Link href="/reservas" onClick={closeMenu} className={`${mobileLinkClasses} px-2`}>Reservas</Link>
                                        <Link href="/prestamos" onClick={closeMenu} className={`${mobileLinkClasses} px-2`}>Préstamos</Link>
                                        <form method="post" action="/biblioteca/auth/logout" onSubmit={() => handleLogOut()}>
                                            <button type="submit" className={`${mobileLinkClasses} w-full cursor-pointer gap-2 px-2 text-left`}>
                                                <LogOut size={16} />
                                                Cerrar sesión
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </nav>
                )}
            </header>
            <div className="hidden lg:flex border-t border-border bg-primary text-primary-foreground items-center justify-center">
                <div className="max-w-7xl flex flex-wrap items-center justify-center px-6">
                    {navbarMenu.map((section, index) => {
                        const triggerClasses = "flex h-12 items-center gap-1 px-5 xl:px-10 text-sm font-bold tracking-wide transition cursor-pointer group-hover:bg-primary-foreground/10 group-focus-within:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";
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