@AGENTS.md

## Proyecto

Biblioteca de la Universidad Atlántico Medio. Landing page con CMS headless.

- **Stack**: Next.js (App Router) + Payload CMS + Tailwind CSS v4 + shadcn/ui (radix-nova)
- **Base path**: `/biblioteca` (configurado en `next.config.ts`)
- **i18n**: español (es) + inglés (en) desde `@payloadcms/translations`
- **DB**: PostgreSQL via `@payloadcms/db-postgres`
- **Editor de rich text**: Lexical (`@payloadcms/richtext-lexical`)
- **Email**: Nodemailer (`@payloadcms/email-nodemailer`)
- **Framer Motion**: animaciones en carousels, cards, modales

---

## Sistema de diseño

- **Tailwind v4** con configuración CSS en `app/styles.css` (no hay `tailwind.config.ts`)
- **shadcn/ui**: componentes en `components/ui/` (Input, Button, Label, Card, Badge, Tabs, Select, Checkbox, Dialog, Accordion, Pagination, Textarea, DropdownMenu)
- **Colores** (HSL en `app/styles.css`):
  - `--primary`: `211 28% 25%` (#2D3E50 navy) — headings, nav, footer
  - `--accent`: `187 53% 49%` (#3BACBD teal) — CTAs, icons, highlights
  - `--background`: `0 0% 100%` (blanco)
  - `--foreground`: `0 0% 20%` (#333)
  - `--muted`: `210 16% 96%` (#F2F4F7) — fondos sutiles
  - `--muted-foreground`: `0 0% 35%` (#595959) — texto secundario
  - `--border`: `0 0% 80%` (#CCC)
  - `--ring`: `187 53% 49%` (mismo que accent)
  - `--topbar`: `187 53% 49%` (mismo que accent)
- **Fuentes**: Montserrat (`font-display`, headings), Open Sans (`font-sans`, body)
- **Radius base**: 0.5rem (8px), derivados: `--radius-md` (6px), `--radius-sm` (4px)
- **Hero overlay**: `linear-gradient(135deg, hsl(211 28% 25% / 0.78), hsl(187 53% 35% / 0.55))`

---

## Arquitectura de datos: Payload CMS

### Flujo de datos

```
Payload Admin → Globals → Collections → Pages → RenderBlocks → Componentes
```

1. **Globals** definen la estructura de cada página con campos `hero`, `hero_carrusel` y `layout` (array de bloques)
2. Cada **bloque** en `layout` es un relationship wrapper apuntando a una collection dedicada
3. **Pages** (server components) hacen `payload.findGlobal({ slug, depth: 5 })` que resuelve todas las relationships
4. **RenderBlocks** recibe el array de bloques, busca `blockType` en `componentsMap`, extrae `relation[0]` y hace spread como props
5. **Componentes** reciben los datos como props y renderizan

### Inicialización de Payload

- **Fichero**: `lib/payload.ts`
- Usa `getPayload({ config })` (NO `getPayloadHMR`)
- Wrapper: `getClient()` retorna instancia de Payload
- Config: `payload.config.ts`

### Collections (23 registradas)

#### Collections de contenido (13)

| Slug | Fichero | Campos clave | Relación con media |
|------|---------|--------------|-------------------|
| `hero` | `collections/Hero.ts` | `background_image` (upload), `title`, `pretitle`, `subtitle`, `button_cta`, `input_placeholder` | `background_image` → media |
| `header` | `collections/Header.ts` | `logo` (upload), `type` (select: 0/1/2), `phone`, `email`, `navbar[]` con `items[]` | `logo` → media |
| `hero_carrusel` | `collections/HeroCarrusel.ts` | `items[]` con `title`, `description`, `image` | `items[].image` → media |
| `speakers` | `collections/Speakers.ts` | `title`, `people[]` con `photo`, `name`, `role`, `entity`, `description` (richText), `socials[]` | `people[].photo` → media |
| `statistics` | `collections/Statistics.ts` | `stats[]` (min:1, max:4) con `icon` (select de appIcons), `value`, `description` | — |
| `about` | `collections/About.ts` | `title` (localized), `article` (richText, localized) | — |
| `features` | `collections/Features.ts` | `title`, `feature[]` (min:1, max:4) con `icon`, `title`, `description` | — |
| `timeline` | `collections/Timeline.ts` | `title`, `calendar[]` con `day`, `title`, `events[]` con `title`, `description` (richText) | — |
| `input` | `collections/Input.ts` | `title`, `placeholder` | — |
| `cta` | `collections/CTA.ts` | `title`, `subtitle`, `button_cta`, `button_link` | — |
| `faq` | `collections/FAQ.ts` | `title`, `faqs[]` con `question`, `answer` (richText) | — |
| `news` | `collections/News.ts` | `title`, `visible_cards`, `style` (select: 0-3), `newsItems[]` (min:1, max:6) con `tag`, `link`, `title`, `description`, `image` | `newsItems[].image` → media |
| `blogs` | `collections/Blogs.ts` | `title`, `blogItems[]` (min:1, max:10) con `title`, `blog`, `date` | — |
| `electronic_resources_access` | `collections/ElectronicResourcesAccess.ts` | `title`, `accesos[]` (min:1, max:6) con `icon` (select de appIcons), `title`, `description`, `cta`, `link` | — |

#### Collections de datos (4)

| Slug | Fichero | Notas |
|------|---------|-------|
| `users` | `collections/Users.ts` | Auth habilitado, `useAsTitle: 'email'` |
| `partners` | `collections/Partners.ts` | `partners_item[]` con `name`, `image` (relationship a media), `link` |
| `login_page` | `collections/Login.ts` | `imageLogin` (upload) → media. Exporta `LOGIN_SLUG` |
| `media` | `collections/Media.ts` | `read: () => true`. Upload config: `staticDir: 'media'`, sizes: `thumbnail` (400x300), mimeTypes: `image/*`. Campo `alt` (required) |

#### Collections de servicio/API (4, hidden from admin)

| Slug | Fichero | Endpoints | API externa |
|------|---------|-----------|-------------|
| `absys_service` | `collections/Absys.service.ts` | `GET /:name` (buscar recurso), `GET /` (búsqueda con paginación `?page`, `?limit`, `?search`) | `NEXT_ABSYS_API` + Basic Auth |
| `book_cover_service` | `collections/BookCovers.service.ts` | `GET /cover/:isbn` (cascade: Amazon → Google Books → Open Library → null), `GET /` (health check) | Amazon CDN, Google Books API, Open Library API |
| `author_service` | `collections/Author.service.ts` | `GET /:authorName`, `GET /` | Wikipedia en español (búsqueda estricta con keyword matching) |
| `loginAbsys_service` | `collections/LoginAbsys.service.ts` | `POST /signin` (crear lector), `POST /login/:credentials` (autenticar), `GET /me` (perfil) | `NEXT_ABSYS_API` + Basic Auth. Auth collection con `tokenExpiration: 1800` |

#### Collection de email (1, hidden)

| Slug | Fichero | Hook |
|------|---------|------|
| `sendEmail` | `collections/Email.service.ts` | `afterChange` → envía email a `mansourlol440@gmail.com` con asunto `Nuevo mensaje: ${doc.about}`. Campos: `name`, `email`, `about`, `message` (richText) |

#### Constantes compartidas (no es collection)

- **`collections/Icons.ts`**: exporta `appIcons` (Lightbulb, BookOpen, Microscope, Star, User, Briefcase, Phone, Mail, MapPin, Calendar) y `iconsSocialMedia` (FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, Globe)

### Globals (9)

| Slug | Fichero | Campos | Categoría |
|------|---------|--------|-----------|
| `home` | `globals/Home.ts` | `hero` (rel→hero), `hero_carrusel` (rel→hero_carrusel), `layout` (11 block types) | Página completa |
| `services` | `globals/Services.ts` | Igual que Home | Página completa |
| `formation` | `globals/Formation.ts` | Igual que Home | Página completa |
| `investigation` | `globals/Investigation.ts` | Igual que Home | Página completa |
| `repository` | `globals/Repositories.ts` | `hero` + `layout` (sin hero_carrusel). **Bug**: labels de `input_block` son "Sobre Nosotros" | Página parcial |
| `library` | `globals/Library.ts` | Solo `hero` | Mínimo |
| `contact` | `globals/Contact.ts` | Solo `hero` | Mínimo |
| `about_us` | `globals/AboutUs.ts` | `quienes_somos[]`, `horarios[]`, `normativa[]` — cada uno con `images` (upload→media) | Documentos/imágenes |
| `electronic_resources` | `globals/ElectronicResources.ts` | `hero` (rel→hero, reutiliza la collection existente), `accesos_destacados` (rel→electronic_resources_access) | Página parcial |
| `layout` | `globals/Layout.ts` | `header` (rel→header), `footer` (rel→footer) | Template del sitio |

#### Block types del `layout` (11, usados en Home/Services/Formation/Investigation/Repositories)

| blockType slug | Campo relationship | Collection target | Componente React |
|----------------|-------------------|-------------------|------------------|
| `stats_block` | `stats_relation` | `statistics` | `<Stadistics>` |
| `speakers_block` | `speakers_relation` | `speakers` | `<Speakers>` |
| `about_block` | `about_relation` | `about` | `<About>` |
| `input_block` | `input_relation` | `input` | `<InputComponent>` |
| `features_block` | `features_relation` | `features` | `<Features>` |
| `news_block` | `news_relation` | `news` | `<News>` |
| `blogs_block` | `blogs_relation` | `blogs` | `<Blogs>` |
| `timeline_block` | `timeline_relation` | `timeline` | `<Timeline>` |
| `partners_block` | `partners_relation` | `partners` | `<Partners>` |
| `cta_block` | `cta_relation` | `cta` | `<CTA>` |
| `faq_block` | `faq_relation` | `faq` | `<FAQ>` |

### Access Control

| Collection | Regla | Efecto |
|------------|-------|--------|
| `hero` | `read: () => true` | Público |
| `media` | `read: () => true` | Público |
| `header` | `read: () => true` | Público |
| `login_page` | `read: () => true` | Público |
| `sendEmail` | `create: () => true` | Cualquiera puede crear |
| `absys_service` | `read: () => true` | Público |
| `book_cover_service` | `read: () => true`, `create: () => true` | Totalmente abierto |
| `author_service` | `read: () => true` | Público |
| `loginAbsys_service` | `read: (user) => user !== null` | Solo autenticados |

### Hooks

Solo `sendEmail` tiene hook: `afterChange` que envía email de notificación.

---

## Arquitectura de componentes

### RenderBlocks (`components/RenderBlocks.tsx`)

Router central que mapea `blockType` → componente React.

```typescript
// componentsMap (líneas 15-101):
const componentsMap: Record<string, React.FC<any>> = {
  hero_block: Hero,           // extrae hero_relation[0]
  hero_carrusel_block: HeroCarrousel,  // extrae hero_carrusel_relation[0]
  stats_block: Stadistics,    // extrae stats_relation[0]
  about_block: About,         // extrae about_relation[0]
  features_block: Features,   // extrae features_relation[0]
  news_block: News,           // extrae news_relation[0]
  blogs_block: Blogs,         // extrae blogs_relation[0]
  cta_block: CTA,             // extrae cta_relation[0]
  speakers_block: Speakers,   // extrae speakers_relation[0]
  input_block: InputComponent,// extrae input_relation[0]
  timeline_block: Timeline,   // extrae timeline_relation[0]
  partners_block: Partners,   // extrae partners_relation[0]
  faq_block: FAQ,             // extrae faq_relation[0]
}
```

Cada bloque se envuelve en `<section key={id} data-block-type={blockType}>`.

### Componentes de Payload blocks (13)

| Componente | Fichero | Props interface | Usa RichText |
|------------|---------|-----------------|-------------|
| `Hero` | `components/Hero.tsx` | `HeroProps`: `pretitle`, `title`, `subtitle`, `image` (PayloadImage), `buttonText`, `inputPlaceHolder`, `toPage` | No |
| `HeroCarrousel` | `components/heroCarrusel.tsx` | `HeroCarrouselProps`: `title`, `items[]` (CarouselItem: `title`, `description`, `image`), `autoPlayInterval` | No |
| `Stadistics` | `components/Stadistics.tsx` | `StatisticsBoxProps`: `stats[]` (icon, value, description) | No |
| `About` | `components/About.tsx` | `AboutProps`: `title`, `article` (any/Lexical) | **Sí** |
| `Features` | `components/Features.tsx` | `FeatureBoxProps`: `title`, `feature[]` (icon, title, description) | No |
| `News` | `components/News.tsx` | `NewsBoxProps`: `title`, `visible_cards`, `style` ('0'-'3'), `newsItems[]` (tag, link, title, description, image) | No |
| `Blogs` | `components/Blogs.tsx` | `BlogBoxProps`: `title`, `blogItems[]` (date, title, blog) | No |
| `CTA` | `components/CTA.tsx` | `CTAProps`: `title`, `subtitle`, `button_cta`, `button_link` | No |
| `Speakers` | `components/Speakers.tsx` | `SpeakersBoxProps`: `title`, `people[]` (SpeakersProps de common.type) | **Sí** |
| `InputComponent` | `components/Input.tsx` | `InputProps`: `title?`, `placeholder?` | No |
| `Timeline` | `components/Timeline.tsx` | `TimeLineBoxProps`: `title`, `calendar[]` (day, title, events[] con description) | **Sí** |
| `Partners` | `components/Partners.tsx` | `PartnersBoxProps`: `title?`, `partners_item[]` (name, image, link) | No |
| `FAQ` | `components/FAQ.tsx` | `FaqBoxProps`: `title`, `faqs[]` (question, answer/Lexical) | **Sí** |

### Componentes que reciben datos de Payload directamente (no via RenderBlocks)

| Componente | Fichero | Fuente de datos |
|------------|---------|-----------------|
| `Header` | `components/layout/Header.tsx` | `Layout` global → relationship `header` → `header` collection. Props: `type`, `phone?`, `email`, `navbar[]` |
| `Footer` | `components/layout/Footer.tsx` | `Layout` global → relationship `footer` → `footer` collection. Props: `type?`, `logo` (PayloadImage), `social_medias[]`, `seccion_info[]` |

### Componentes que usan la API externa de Absys (no Payload)

| Componente | Fichero | Fuente de datos |
|------------|---------|-----------------|
| `AuthorCard` | `components/AuthorCard.tsx` | `author_service` via `fetchAuthorInfo()` |
| `BookCard` | `components/BookCard.tsx` | `BookInterface` de Absys, `useBookCover` hook |
| `BooksList` | `components/BooksList.tsx` | Fetch a `/biblioteca/api/library/` |
| `SimpleForm` | `components/SimpleForm.tsx` | POST a `endpoint` configurable (ej: `/api/sendEmail`) |
| `SpeakerModal` | `components/SpeakerModal.tsx` | Child de Speakers, recibe `SpeakersProps` |

### Componentes vacíos (stub)

- `Pricing.tsx`, `Testimonials.tsx`, `TrustedBy.tsx`, `Navbar.tsx`

### Layout components

| Componente | Fichero | Notas |
|------------|---------|-------|
| `Header` | `components/layout/Header.tsx` | Sticky topbar + nav con dropdowns |
| `Footer` | `components/layout/Footer.tsx` | 2 variantes (horizontal/vertical) según `type` |
| `FooterSimple` | `components/layout/FooterSimple.tsx` | Hardcoded, sin conexión a Payload |

### Tipos compartidos

- `types/common.type.ts`: `CardProps`, `SocialMediaMedia`, `ItemProps`, **`PayloadImage`** (`{ id, url, alt?, width?, height? }`), `InfoProps`, `SpeakersProps`
- `types/form.type.ts`: `SimpleFormProps`
- `types/absys.type.ts`: `BookInterface`, `AbsysInterface`
- `types/absysServer.type.ts`: funciones de request server-side
- `types/contact.type.ts`: `ContactProps`
- `payload-types.ts`: tipos auto-generados por Payload

---

## Estructura de páginas

### Layout principal (`app/(frontend)/layout.tsx`)

- Server component, `force-dynamic`
- Fetch: `payload.findGlobal({ slug: 'layout', depth: 2 })`
- Renderiza: `<Header {...headerData}>` + `<main>{children}</main>` + `<Footer {...footerData}>`

### Páginas que usan Payload globals

| Ruta | Global slug | RenderBlocks activo | Notas |
|------|-------------|---------------------|-------|
| `/` | `home` | **Sí** | Hero + HeroCarrousel + RenderBlocks |
| `/repositorios` | `repository` | **Sí** | Hero + RenderBlocks |
| `/servicios` | `services` | No (comentado) | JSX hardcodeado |
| `/formacion` | `formation` | No (importado, no usado) | JSX hardcodeado |
| `/investigacion` | `investigation` | No (importado, no usado) | JSX hardcodeado |
| `/biblioteca` | `library` | No | Hero + BooksList |
| `/contacto` | `contact` | No | Hero + SimpleForm + info contacto |
| `/conocenos/quienes-somos` | `about_us` | No | Images de Payload, arrays hardcodeados |
| `/conocenos/normativa-...` | `about_us` | No | Images de Payload, arrays hardcodeados |
| `/conocenos/horarios-...` | `about_us` | No | Images de Payload, horarios hardcodeados |
| `/recursos/recursos-electronicos` | `electronic_resources` | No | Hero (title/subtitle/imagen) + accesos destacados editables desde Payload; pestañas de bases de datos/ebooks/multimedia siguen hardcodeadas |

### Páginas que NO usan Payload (API externa Absys)

| Ruta | Notas |
|------|-------|
| `/libros` | Client component, fetch a Absys API via axios |
| `/recursos/repositorio-institucional` | Todo hardcodeado |
| `/recursos/catalogo` | Todo hardcodeado, enlace a OPAC externo |
| `/recursos/catalogo/busqueda` | Client, fetch a `absys_service` con paginación |
| `/recursos/catalogo/libro/[isbn]` | Client, fetch a `absys_service` + `book_cover_service` |

### Login (`app/(auth)/login/page.tsx`)

- Client component pero usa server action `getLoginPageData()` (`app/(auth)/login/actions.ts`)
- Server action fetch: `payload.find({ collection: "login_page" })` + `payload.find({ collection: "header" })`
- Integra con `loginAbsys_service` para autenticación

### API Routes (auto-generadas por Payload)

- `GET/POST/DELETE/PATCH/PUT/OPTIONS /api/*` → REST catch-all
- `POST /api/graphql` → GraphQL
- `GET /api/graphql-playground` → Playground

---

## Git workflow

### Cuándo commitear
- Haz un commit cada vez que termine una unidad de trabajo verificable:
  un test que antes fallaba ahora pasa, una función queda completa y funcional,
  o se corrige un bug concreto. NO esperes a que toda la tarea esté terminada.
- Antes de cada commit, ejecuta los tests relevantes. Si fallan, no commitees:
  arregla primero o dime qué está pasando.
- No mezcles cambios no relacionados en un mismo commit.

### Formato del mensaje (Conventional Commits)
tipo(alcance opcional): resumen en imperativo, máx 50 caracteres

- cuerpo opcional: por qué se hizo el cambio, no qué se hizo (el diff ya lo dice)
- tipos permitidos: feat, fix, refactor, test, docs, chore

### Al terminar la tarea completa
- Haz un commit final (o revisa que el último ya cumpla esto) que:
  - resuma el resultado de la tarea, no el último paso dado
  - mencione si algo quedó pendiente o fuera de alcance
- Antes del commit final, muéstrame `git log --oneline` de los commits
  de esta sesión para que yo revise el historial antes de continuar.

---

## Reglas de código

- No añadir comentarios al código a menos que se pida explícitamente
- Seguir la convención del proyecto: usar componentes shadcn/ui, no HTML crudo
- Mantener los colores del sistema de diseño (no inventar nuevos)
- Preferir `font-display` para headings, `font-sans` para body
- Hover states sutiles: `hover:bg-accent/90`, `hover:scale-[1.02]`, `transition-colors`
- Para rich text, usar `<RichText data={...} />` de `@payloadcms/richtext-lexical/react`
- Para imágenes de Payload, usar tipo `PayloadImage` de `types/common.type.ts`
- Components in `components/ui/` are shadcn primitives — never modify them directly

---

## Bugs conocidos

- `globals/Repositories.ts` líneas 71-72: labels de `input_block` dicen "Sobre Nosotros" en vez de "Entrada de texto"
- `app/fonts/Monserrat/`: typo en el nombre del directorio (falta una 't'), pero las referencias en `styles.css` apuntan a esa ruta así que funciona
- Páginas `/servicios`, `/formacion`, `/investigacion` importan `RenderBlocks` pero no lo usan — tienen JSX hardcodeado

---

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

Añadido efecto hover al estilo 3:

- `transition-transform duration-300 hover:scale-[1.02]` en el `<article>`
- `rounded-xl overflow-hidden` para que el scale no se salga de las esquinas

### `/recursos/recursos-electronicos` — Integración con Payload

Se replicó el patrón usado en `/conocenos/horarios-ubicacion-y-contacto`, pero con más contenido editable (hero completo + tarjetas, no solo una imagen):

- **Nuevo global** `electronic_resources` (`globals/ElectronicResources.ts`): en vez de reinventar campos de hero como hace `about_us` (que solo guarda un array de imágenes), reutiliza la collection `hero` ya existente vía `relationship` (mismo patrón que `home`/`services`/`repository`), más una `relationship` a la nueva collection `electronic_resources_access`
- **Nueva collection** `electronic_resources_access` (`collections/ElectronicResourcesAccess.ts`): array `accesos[]` (icon/title/description/cta/link) para las tarjetas "Accesos Directos Destacados", mismo patrón que `features`
- **Registrado** en `payload.config.ts` (collection + global)
- **`app/(frontend)/recursos/recursos-electronicos/page.tsx`**: pasó de client component 100% hardcodeado a server component `async` que hace `payload.findGlobal({ slug: 'electronic_resources' })`; el icono de cada acceso se resuelve con `iconMap` de `lib/utils.ts` (mismo mecanismo que `components/Features.tsx`)
- **Fuera de alcance**: las pestañas "Bases de datos / Libros electrónicos / Multimedia" (`resourceCategories`) siguen hardcodeadas, sin conectar a Payload
