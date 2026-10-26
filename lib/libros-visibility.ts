import { devToolsEnabled } from "@/lib/env";

// /libros es una página de pruebas: solo existe en desarrollo
export const shouldHideLibros = (enabled: boolean = devToolsEnabled) => !enabled;
