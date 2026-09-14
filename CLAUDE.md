@AGENTS.md

## Proyecto

Landing page para la Biblioteca de la Universidad Atlántico Medio. Next.js + Tailwind v4 + shadcn/ui (radix-nova).

## Sistema de diseño

- **Tailwind v4** con configuración CSS en `app/styles.css` (no hay `tailwind.config.ts`)
- **shadcn/ui**: componentes en `components/ui/` (Input, Button, Label, Card, etc.)
- **Colores**: `--primary` (#2D3E50 navy), `--accent` (#3BACBD teal), `--muted`, `--border`
- **Fuentes**: Montserrat (display/headings), Open Sans (body)
- **Radius base**: 0.5rem (8px)
- Usar siempre los componentes UI existentes en vez de escribir HTML crudo con clases Tailwind

## Cambios realizados

### `components/Input.tsx` — Búsqueda completa

Reescritura del componente de búsqueda usando los componentes UI del proyecto:

- **Barra principal**: `Input` de shadcn + `Button` con `bg-accent`, fusionados visualmente (sin gap entre ellos)
- **Icono de búsqueda** integrado dentro del input (`pl-10`)
- **Botón clear** (`X`) que aparece cuando hay texto
- **Toggle de búsqueda avanzada**: icono `SlidersHorizontal` + chevron animado con `rotate-180`
- **Panel avanzado**: `maxHeight` dinámico basado en `scrollHeight` (no el truco de `max-h-[500px]`), fondo `bg-secondary/50`, grid de 2/3 columnas
- **Campos avanzados**: Título, Autor, ISBN, Editorial, Año, Materia — todos con `name` correcto que coincide con lo que espera `handleInput`
- **Acciones del panel**: botón "Limpiar" (ghost) y "Buscar con filtros" (accent)
- **Bug fix**: los `name` de los inputs ahora coinciden con los campos que procesa `handleInput` (`titulo`, `autor`, `isbn`, `editorial`, `anio`, `materia`)

### `components/News.tsx` — Hover en estilo 3

Añadido efecto hover al estilo 3 (línea ~190):

- `transition-transform duration-300 hover:scale-[1.02]` en el `<article>`
- `rounded-xl overflow-hidden` para que el scale no se salga de las esquinas

## Reglas de estilo

- No añadir comentarios al código a menos que se pida explícitamente
- Seguir la convención del proyecto: usar componentes shadcn/ui, no HTML crudo
- Mantener los colores del sistema de diseño (no inventar nuevos)
- Preferir `font-display` para headings, `font-sans` para body
- Hover states sutiles: `hover:bg-accent/90`, `hover:scale-[1.02]`, `transition-colors`
