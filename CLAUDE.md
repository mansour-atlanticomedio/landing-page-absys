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

### ⚠️ Push (dev) vs Migraciones (producción) — leer antes de tocar schema

- **En dev** (`NODE_ENV !== 'production'`, contenedor `biblioteca-frontend` con `Dockerfile.dev`), el adapter de Postgres usa `push: true` por defecto: cualquier collection/global nuevo o campo añadido se sincroniza solo contra la BD la primera vez que se inicializa Payload (el spinner "Pulling schema from database..." que se ve al lanzar un seed o `next dev`).
- **En producción** (`Dockerfile` fija `NODE_ENV=production`), `push` es `false`: la BD **solo** se actualiza aplicando migraciones (`payload migrate`). Si se añade una collection/global/campo nuevo y no se genera su migración, en producción esa tabla/columna directamente no existe — cualquier `payload.create`/`payload.updateGlobal` contra ella revienta con `relation "..." does not exist`, aunque en dev funcione perfectamente (por eso puede pasar desapercibido toda una sesión de trabajo).
- **Regla**: después de crear o modificar cualquier collection/global (`collections/*.ts`, `globals/*.ts`), además de `npx payload generate:types`, hay que generar la migración correspondiente con `npx payload migrate:create <nombre-descriptivo>` (se puede correr contra la BD de dev ya sincronizada por push — la migración generada refleja el diff acumulado desde la última migración) y comprobar que `npm run migrate` aplica limpio contra una BD nueva antes de dar el cambio por terminado.
- Migraciones existentes: `migrations/20260731_114550_baseline.ts` (base) + `migrations/20260915_162539_session_2026_09_14_content_globals.ts` (todo el schema de la sesión de recursos-electrónicos/quiénes-somos/investigación/formación/horarios — se generó a posteriori porque no se había estado corriendo `migrate:create` en cada paso; a partir de ahora generar la migración en el mismo momento en que se toca el schema, no al final)

### Collections (25 registradas)

#### Collections de contenido (15)

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
| `schedule` | `collections/Schedule.ts` | `title`, `schedule[]` (min:1, max:7) con `day`, `hours`, `type` (select: regular/closed/extended/holiday) | — |

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

| `loginCampus_service` | `collections/LoginCampus.service.ts` | `POST /login/password/:id` y `POST /api/loginCampus/login/password[/:id]` (global) — **temporales**, solo dev, prueban el descifrado del token | Auth collection de los lectores que entran desde el campus (ver "Login desde el campus"). Campos: `absysId`, `nombre`, `apellidos`, `colectivo`... Migración `20260928_114829_login_campus` |

> Desde el 2026-09-25, `absys_service` y `loginAbsys_service` ya **no hablan con Absys directamente**: todo pasa por el adaptador `lib/integrations/absys` (ver abajo). Los handlers solo leen la request, llaman a `absys.*` y dan forma a la respuesta HTTP.

#### Adaptador de AbsysNet (`lib/integrations/absys/`)

Único punto del código que habla con la API de AbsysNet (ADR-0009 en el vault). Nadie fuera de esta carpeta debe hacer `fetch` a `NEXT_ABSYS_API`: se importa siempre desde `@/lib/integrations/absys`.

Capas, de abajo a arriba:

| Fichero | Función |
|---------|---------|
| `client.ts` | Cliente HTTP único (`absysClient`). Solo servidor (lanza si `window` existe). Lee `NEXT_ABSYS_API`, `NEXT_ABSYS_USERNAME`, `NEXT_ABSYS_PASSWORD` (en **base64**, se decodifica aquí) y `ABSYS_TIMEOUT_MS` (10 s por defecto, con `AbortController`). Dos operaciones: `search(params)` → GET con todo en la query; `add(table, fields)` → POST `x-www-form-urlencoded`. Traduce fallos a errores tipados: red/timeout/HTTP 5xx/JSON inválido/`code` 1 o 4 → `AbsysUnavailableError`; HTTP 4xx y cualquier otro `code` ≠ 0 → `AbsysInvalidDataError`. Nunca mete credenciales ni la respuesta cruda en el mensaje de error |
| `errors.ts` | Jerarquía de errores: `AbsysError` (base, con `code`/`subcode` de Absys) → `AbsysUnavailableError` (Absys caído o inalcanzable), `AbsysInvalidDataError` (Absys rechaza los datos o responde algo incoherente), `AbsysNotFoundError` (definido pero aún sin uso) |
| `mappers/lector.ts` | Traducción pura (sin I/O) entre el formato de Absys (`lenlec`, `lenomb`, `leapel`, `lemail`, `lefubi`...) y nuestros tipos `Lector` / `NuevoLector`. Contiene las constantes institucionales del alta (`COLECTIVOS` ALUMN/PDI con su `lecocf` y perfil de préstamo, `LECOBI`, `LECOSU`, `LECART`), `formatAbsysDateTime` (`dd/mm/yyyy hh:mm:ss`), `resolveColectivo` (cualquier colectivo desconocido cae a `ALUMN`, ADR-0002) y `EXTERNAL_ID_FIELD` (campo con el que se cruza la identidad del campus; **provisional**, hoy `lenlec`, ADR-0005) |
| `mappers/catalogo.ts` | `toCatalogQuery`: convierte `{ search, page, limit, detalle }` a la query de Absys (`base: cata`, `_start_position`/`_max_records`, 12 por página). Listado → `_doc_fields: "245, 100, 020"` (título/autor/ISBN MARC); `detalle: true` → `_description: "1"` (ficha completa) |
| `lector.ts` | `createLectorService(client)`: `findLectorByExternalId` (null si no existe, `AbsysInvalidDataError` si hay duplicados) y `createLector` (alta; **no verificado contra Absys real**, error -400 pendiente con Baratz) |
| `catalogo.ts` | `createCatalogoService(client)`: `searchCatalog(params)`, devuelve la respuesta cruda de Absys (el front sigue consumiendo ese formato) |
| `mock.ts` | `absysMock`: el mismo adaptador pero con un cliente falso que responde con las fixtures. Solo existe un lector (el de `lector-search.json`); cualquier otro id devuelve vacío |
| `index.ts` | Punto de entrada público. Define la interfaz `AbsysAdapter` y exporta `absys`, que es el adaptador real o `absysMock` según `ABSYS_MOCK=true`. Re-exporta tipos y errores |
| `__fixtures__/*.json` | Respuestas reales (anonimizadas) de AbsysNet: catálogo (listado y detalle), lector (encontrado, vacío, duplicado), alta (ok y error) y servicio caído |
| `__tests__/*.test.ts` | Tests con **Vitest** (`npm test`, config en `vitest.config.ts`, solo `lib/**/*.test.ts`): cliente (con `fetch` mockeado, timeouts, códigos de error), mappers, servicios de lector y mock |

Los servicios reciben el cliente por parámetro (`createXService(client)`) para poder testearlos y montar el mock con el mismo código. Para trabajar sin conexión a Absys: `ABSYS_MOCK=true` en `.env.local`.

Pendientes conocidos (marcados con `TODO` en el código): `lepassLegacy` / comparación de contraseña en `handleLoginLector` nunca acierta porque Absys devuelve `lepass` enmascarado (F01, ADR-0005); `toLegacyLector` en `LoginAbsys.service.ts` mantiene el formato antiguo de respuesta hasta normalizar el contrato con el front.

#### Collection de email (1, hidden)

| Slug | Fichero | Hook |
|------|---------|------|
| `sendEmail` | `collections/Email.service.ts` | `afterChange` → envía email a `mansourlol440@gmail.com` con asunto `Nuevo mensaje: ${doc.about}`. Campos: `name`, `email`, `about`, `message` (richText) |

#### Constantes compartidas (no es collection)

- **`collections/Icons.ts`**: exporta `appIcons` (Lightbulb, BookOpen, Microscope, Star, User, Briefcase, Phone, Mail, MapPin, Calendar) y `iconsSocialMedia` (FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, Globe)

### Globals (12)

| Slug | Fichero | Campos | Categoría |
|------|---------|--------|-----------|
| `home` | `globals/Home.ts` | `hero` (rel→hero), `hero_carrusel` (rel→hero_carrusel), `layout` (11 block types) | Página completa |
| `services` | `globals/Services.ts` | Igual que Home | Página completa |
| `formation` | `globals/Formation.ts` | `hero`, `hero_carrusel`, `buscar_parrafo_1`/`buscar_parrafo_2` (texto), `enlaces_rapidos[]` (label+link, inline), `citar_cta` (rel→cta), `guias_tutoriales` (rel→electronic_resources_access), `actividades_texto`/`actividades_estado` (texto), `layout` (11 block types, sin usar por ahora) | Página completa |
| `investigation` | `globals/Investigation.ts` | `hero`, `hero_carrusel`, `accesos_rapidos` (rel→features), `tarjetas` (rel→electronic_resources_access), `cta` (rel→cta), `layout` (11 block types, sin usar por ahora) | Página completa |
| `repository` | `globals/Repositories.ts` | `hero` + `layout` (sin hero_carrusel). **Bug**: labels de `input_block` son "Sobre Nosotros" | Página parcial |
| `library` | `globals/Library.ts` | Solo `hero` | Mínimo |
| `contact` | `globals/Contact.ts` | Solo `hero` | Mínimo |
| `about_us` | `globals/AboutUs.ts` | `quienes_somos[]` (**no usado**, ver `quienes_somos` global), `horarios[]` (**no usado**, ver `horarios_contacto` global), `normativa[]` — cada uno con `images` (upload→media) | Documentos/imágenes |
| `horarios_contacto` | `globals/HorariosContacto.ts` | `hero` (rel→hero), `edificio_nombre`/`edificio_subtitulo`, `horario` (rel→schedule), `direccion_linea1`/`direccion_linea2`, `telefono`, `email`, `mapa_url`, `mapa_embed_url`, `ayuda_cta` (rel→cta) | Página parcial |
| `electronic_resources` | `globals/ElectronicResources.ts` | `hero` (rel→hero, reutiliza la collection existente), `accesos_destacados` (rel→electronic_resources_access) | Página parcial |
| `quienes_somos` | `globals/QuienesSomos.ts` | `hero` (rel→hero), `imagen_dirigidos` (upload→media), `ayudas` (rel→features), `dirigidos` (rel→features) — `ayudas`/`dirigidos` reutilizan la collection `features` existente con dos docs distintos | Página parcial |
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
- `types/absysServer.type.ts`: funciones de request server-side — **borrado el 2026-09-25** (nadie lo importaba; sustituido por `lib/integrations/absys/client.ts`)
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
| `/formacion` | `formation` | No (se quitó `RenderBlocks`, sin usar) | Hero + secciones "Buscar y evaluar", "Citar correctamente", "Guías y tutoriales" y sidebar editables desde Payload; interactividad con framer-motion vía `FormationContent` (client component) |
| `/investigacion` | `investigation` | No (se quitó `RenderBlocks`, sin usar) | Hero + accesos rápidos + tarjetas + CTA editables desde Payload; interactividad con framer-motion vía `InvestigationContent` (client component) |
| `/biblioteca` | `library` | No | Hero + BooksList |
| `/contacto` | `contact` | No | Hero + SimpleForm + info contacto |
| `/conocenos/quienes-somos` | `quienes_somos` | No | Hero (title/subtitle/imagen) + tarjetas "ayudas"/"dirigidos" editables desde Payload (reutilizan `features`) |
| `/conocenos/normativa-...` | `about_us` | No | Images de Payload, arrays hardcodeados |
| `/conocenos/horarios-...` | `horarios_contacto` | No | Hero + tabla de horarios + contacto/dirección/mapa + CTA de ayuda, todo editable desde Payload |
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
- Desde el 2026-09-28 **no es el login principal**: el Header ya no la enlaza ni lee el `localStorage` que escribe (ver "Login desde el campus"). Queda para el colectivo EXT (F01/F02)

### Login desde el campus (sesión real de Payload)

Flujo del ADR-0005. La sesión es una sesión normal de Payload de la collection `loginCampus_service` (JWT con `sid` en cookie `payload-token`, httpOnly, `SameSite=Lax`, 30 min), emitida **sin contraseña** porque la identidad ya la validó el campus.

```
A) Llega del campus:  /auth/campus?token=<AES>&next=/ruta
   → verifyCampusToken → absys.findLectorByExternalId(email)
   → createCampusSession (crea/actualiza el usuario, añade sid, firma JWT) → cookie
   → redirige a `next`, o a /perfil/alta si no tiene ficha en Absys
B) Página privada sin sesión: requireSession('/ruta') → /auth/login?next=/ruta
   → NEXT_CAMPUS_LOGIN_URL?return=<site>/auth/campus?next=/ruta → campus → vuelve por A
```

| Fichero | Función |
|---------|---------|
| `lib/integrations/campus/token.ts` | `decryptCampusToken` (port del PHP del campus: base64(IV 16 bytes + AES-128-CBC("fecha\|email")), clave `NEXT_CAMPUS_SECRET_KEY` recortada/rellenada a 16 bytes), `verifyCampusToken` (además rechaza tokens de más de `NEXT_CAMPUS_TOKEN_MAX_AGE` s, 300 por defecto), `encryptCampusToken` (solo para simular el campus en dev/tests). Los `+` del base64 que lleguen como espacios se corrigen |
| `lib/auth/redirects.ts` | Puro, sin Payload: `safeNextPath` (solo rutas internas, evita open redirect y bucles a `/auth/*`), `buildCampusLoginUrl`, `redirectResponse` (Location **relativa** con el basePath, para que funcione igual detrás de nginx que contra el contenedor) |
| `lib/auth/session.ts` | Servidor: `getSession()`, `requireSession(next)` (para Server Components de páginas privadas), `createCampusSession`, `linkAbsysLector`, `destroyCampusSession` (revoca el `sid` en BD, no solo borra la cookie) |
| `app/(auth)/auth/campus/route.ts` | Callback A |
| `app/(auth)/auth/login/route.ts` | Entrada única al login: con sesión vuelve a `next`; sin ella, al campus. Sin `NEXT_CAMPUS_LOGIN_URL`: en dev → `/auth/simular-campus`, en prod → `/auth/error?motivo=config` |
| `app/(auth)/auth/logout/route.ts` | `POST`, revoca la sesión y vuelve a `/` |
| `app/(auth)/auth/error/page.tsx` | Motivos: `invalido`, `caducado`, `absys`, `config` |
| `app/(auth)/auth/simular-campus/` | **Solo dev** (404 en producción): formulario con un email que genera un token real y vuelve al callback. Es la forma de probar el flujo hasta que Daniel tenga lista la redirección |
| `app/(frontend)/(cuenta)/perfil/page.tsx` | Privada: datos del lector en Absys; si Absys está caído muestra los guardados en Payload |
| `app/(frontend)/(cuenta)/perfil/alta/` | Privada: si el email del campus no tiene ficha en Absys, pide nombre/apellidos/dirección/colectivo y llama a `createLector` (con `lepass` aleatorio, porque entran siempre por el campus). **No probado contra Absys real** (error -400 pendiente con Baratz) |

Variables (ver `env.local.Example`): `NEXT_CAMPUS_SECRET_KEY`, `NEXT_CAMPUS_TIMEZONE`, `NEXT_CAMPUS_TOKEN_MAX_AGE`, `NEXT_CAMPUS_TOKEN_PARAM` (`token`), `NEXT_CAMPUS_LOGIN_URL`, `NEXT_CAMPUS_RETURN_PARAM` (`return`). La URL de login del campus y el nombre de sus parámetros están **pendientes de confirmar con Daniel**; por eso son configurables.

Gotchas:
- **`SameSite=Lax`, no `Strict`**: la cookie se crea en una redirección que empieza en otro sitio (el campus); con `Strict` el navegador no la manda en ese mismo viaje y el usuario entra en bucle login → campus → login
- **`Card` de shadcn no se puede renderizar en un Server Component**: `lib/utils.ts` lleva `'use client'` (tiene el hook `useBookCover`), así que `cn()` es una referencia de cliente y revienta en el servidor con `Attempted to call cn() from the server`. Envolver el Card en un componente `"use client"` (como `components/auth/*`, `components/cuenta/PrestamosTabla`)
- `loginCampus_service`: cada lector solo puede leerse a sí mismo por la API; solo admins (`users`) crean/editan/borran
- Payload usa una única cookie `payload-token` para todas las collections con auth: iniciar sesión como lector en el mismo navegador cierra la sesión del admin y viceversa

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
- Página `/servicios` importa `RenderBlocks` pero no lo usa — tiene JSX hardcodeado (`/investigacion` y `/formacion` ya no importan `RenderBlocks`, ver "Cambios realizados")

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

### `/conocenos/quienes-somos` — Integración con Payload

Mismo tratamiento que `/recursos/recursos-electronicos`, esta vez reutilizando la collection `features` en vez de crear una nueva:

- **Nuevo global** `quienes_somos` (`globals/QuienesSomos.ts`): `hero` (rel→`hero`, mismo patrón que el resto de globals de página), `imagen_dirigidos` (upload suelto para la imagen de la sección oscura "A quién se dirigen nuestros servicios"), `ayudas` y `dirigidos` — dos relationships distintas a la collection `features` ya existente (mismo patrón que `home.seed.ts` reutilizando `news` dos veces para "Destacados" y "Te recomendamos")
- **Sin collection nueva**: `features` (icon/title/description) encajaba exactamente con las tarjetas hardcodeadas `AYUDAS` y `DIRIGIDOS`, así que no se creó ninguna collection nueva
- **Registrado** en `payload.config.ts` (solo el global; `features` ya estaba registrada)
- **`app/(frontend)/conocenos/quienes-somos/page.tsx`**: pasó de leer `about_us.quienes_somos[]` (solo imágenes) a leer el nuevo global `quienes_somos` completo; si `ayudas`/`dirigidos` no tienen doc asignado en el admin, cae a los arrays `AYUDAS_FALLBACK`/`DIRIGIDOS_FALLBACK` con el contenido original
- **`about_us.quienes_somos[]` queda sin uso** tras este cambio (nadie más lo lee) — no se ha borrado del schema por si se prefiere reutilizar más adelante; avisar antes de eliminarlo

### `/investigacion` — Integración con Payload + interactividad

A diferencia de horarios/quienes-somos/recursos-electronicos, esta página **ya tenía** el global `investigation` con `hero` conectado (fetch, extracción de campos) pero la sección `<main>` estaba 100% hardcodeada y no llegaba a usar esos datos ni los componentes `Hero`/`RenderBlocks` que importaba:

- **Ampliado** `globals/Investigation.ts` con 3 campos nuevos (sin tocar `hero`, `hero_carrusel` ni `layout`, que quedan intactos por si se usan en el futuro): `accesos_rapidos` (rel→`features`), `tarjetas` (rel→`electronic_resources_access`), `cta` (rel→`cta`) — las 3 reutilizan collections ya existentes, ninguna es nueva
- **`collections/Features.ts`**: `maxRows` de `feature[]` subido de 4 a 6 (necesario para los 5 "accesos rápidos"; cambio hacia atrás compatible, no rompe docs existentes)
- **`collections/Icons.ts` / `lib/utils.ts`**: `appIcons`/`iconMap` ampliados con los iconos que ya usaba esta página (Search, Megaphone, Lock, Fingerprint, BarChart3, HeartHandshake, BookOpenCheck, Landmark) — antes solo cubrían un set genérico de 10 iconos que no encajaban con el contenido real de investigación
- **`app/(frontend)/investigacion/page.tsx`**: se quitaron los imports de `Hero`/`RenderBlocks` (decisión consciente de no usar el sistema de `layout` blocks en esta página, igual que en horarios/quienes-somos/recursos-electronicos) y ahora sí consume `accesos_rapidos`/`tarjetas`/`cta`, con fallback al contenido original
- **⚠️ Gotcha de arquitectura importante**: un Server Component async (el que hace `payload.findGlobal`) **no puede usar `motion.*` de `framer-motion` directamente** — revienta en runtime con `createMotionComponent() from the server`. La solución fue extraer el JSX animado a un Client Component nuevo, `components/InvestigationContent.tsx` (`"use client"`), que recibe los datos ya resueltos como props; la página server-side solo hace el fetch y le pasa los props. Aplicar este mismo split si se añade `framer-motion` a otra página que haga fetch de Payload directamente en el componente de página
- **Interactividad añadida**: los chips de "Accesos rápidos" ahora son anchors reales (`href="#tarjeta-N"`) que hacen scroll suave (ya había `scroll-behavior: smooth` global en `app/styles.css`) hasta la tarjeta correspondiente (mapeo 1:1 por índice); tarjetas con `whileInView` (reveal al hacer scroll, en vez de animar solo al montar) y hover con sombra; botones que antes no hacían nada ahora enlazan a `/recursos/recursos-electronicos`, al repositorio institucional o a `/contacto` según corresponda
- **Probado** contra la BD real del contenedor de desarrollo y con `curl` a la página renderizada (200 OK, ids/anchors correctos)

### `/formacion` — Integración con Payload + interactividad

Mismo caso que `/investigacion`: el global `formation` ya tenía `hero`/`hero_carrusel`/`layout` conectados pero el JSX era 100% hardcodeado y no usaba nada de eso.

- **Ampliado** `globals/Formation.ts` con campos nuevos (sin tocar `hero`, `hero_carrusel` ni `layout`): `buscar_parrafo_1`/`buscar_parrafo_2` (texto plano, no richText — se evitó `about`/Lexical por no haber ningún seed previo que sembrara richText en este proyecto y no valía la pena introducir ese riesgo para dos párrafos cortos), `enlaces_rapidos[]` (array inline `label`+`link`, igual que el patrón de `about_us` de embeber arrays simples directo en el global en vez de crear una collection), `citar_cta` (rel→`cta`, reutilizada), `guias_tutoriales` (rel→`electronic_resources_access`, reutilizada, un solo item), `actividades_texto`/`actividades_estado` (texto plano para el sidebar)
- **Sin collections nuevas**: todo reutiliza `cta`/`electronic_resources_access` ya existentes, o son campos simples directo en el global
- **`app/(frontend)/formacion/page.tsx`**: se quitaron los imports de `Hero`/`RenderBlocks`; el JSX animado se extrajo a `components/FormationContent.tsx` (`"use client"`), mismo motivo que en investigación (`motion.*` no puede usarse en el Server Component async que hace el fetch)
- **Bugs de UX corregidos** (enlaces/botones que no hacían nada): el enlace "Acceso a Recursos electrónicos" apuntaba a `href="#"` → ahora apunta a `/recursos/recursos-electronicos` por defecto; el botón "Recomendaciones sobre citación y plagio" no tenía `href` en absoluto; la tarjeta "Acceder a guías y tutoriales disponibles" no era ni un link ni un botón pese a tener un icono de flecha sugiriendo que era clicable — ahora los tres son enlaces reales editables desde Payload
- **Interactividad añadida**: entrada con fade/slide en el hero, reveal por scroll (`whileInView`) en cada bloque de contenido con delay escalonado, hover states en todos los enlaces/botones (antes no tenían ninguno), micro-interacción de flecha (`group-hover:translate-x-1`) en la tarjeta de guías y tutoriales, y el bullet "●" de texto del estado de actividades se sustituyó por un indicador `<span>` con `rounded-full` real
- **Probado** contra la BD real del contenedor de desarrollo y con `curl` a la página renderizada (200 OK, imagen del hero servida desde Payload en vez del path hardcodeado)

### `/` (Home) — Interactividad añadida (sin tocar Payload)

A petición explícita, aquí no se tocó Payload ni las collections/globals — solo `app/(frontend)/page.tsx` y componentes nuevos con shadcn/ui:

- **`components/HomeQuickLinks.tsx`** (nuevo, `"use client"`): franja de accesos rápidos (chips con icono, `Button asChild` de shadcn + `Link`) a Catálogo, Recursos electrónicos, Investigación, Formación y Horarios — entrada escalonada con framer-motion y `whileHover`. Contenido fijo en el propio componente (no viene de Payload)
- **`components/BackToTop.tsx`** (nuevo, `"use client"`): botón flotante circular que aparece tras hacer scroll >480px y sube al inicio con scroll suave; `AnimatePresence` para la transición de entrada/salida
- **`app/(frontend)/page.tsx`**: ambos se insertan entre `HeroCarrousel` y `RenderBlocks` (`HomeQuickLinks`) y al final (`BackToTop`); `Hero`, `HeroCarrousel`, `RenderBlocks`, `Input` y `News` no se modificaron (ya estaban bien pulidos con carrusel, autoplay, hover states y transiciones propias)
- **Probado** con `curl` contra la página renderizada (200 OK, las 5 chips y el resto del contenido existente siguen presentes)

### `/conocenos/horarios-ubicacion-y-contacto` — De seed mínimo a global + collection completos

Se pidió explícitamente no dejarlo tan simple. Se sustituyó el patrón mínimo (`about_us.horarios[0].images`, solo una imagen) por un global dedicado, igual de completo que investigación/formación:

- **Nueva collection** `collections/Schedule.ts` (slug `schedule`): `title` + `schedule[]` (array `day`/`hours`/`type` — select `regular`/`closed`/`extended`/`holiday`, con estilos de color distintos por tipo en el front). Reutiliza el shape del array `schedules` que ya estaba en el componente pero nunca se usaba (dead code) — ahora sí se renderiza
- **Nuevo global** `globals/HorariosContacto.ts` (slug `horarios_contacto`): `hero` (rel→`hero`), `edificio_nombre`/`edificio_subtitulo` (texto, caption sobre la imagen), `horario` (rel→`schedule`), `direccion_linea1`/`direccion_linea2`, `telefono`, `email`, `mapa_url` (botón "Cómo llegar"), `mapa_embed_url` (iframe), `ayuda_cta` (rel→`cta`, reutilizada, para el bloque "¿Necesitas ayuda adicional?")
- **Registrado** en `payload.config.ts` (collection + global)
- **`app/(frontend)/conocenos/horarios-ubicacion-y-contacto/page.tsx`**: ya no lee `about_us`, lee `horarios_contacto` completo, con fallback al contenido original en cada campo
- **Bug corregido**: el botón "Ver FAQs" tenía `href=""` (enlace roto); ahora usa `ayuda_cta.button_link` con fallback a `/contacto`
- **`about_us.horarios[]` queda sin uso** (como ya le pasó a `about_us.quienes_somos[]`) — no se ha borrado del schema
- **`seeds/horarios.seed.ts` reescrito** para sembrar el nuevo global (hero, `schedule` con las 5 franjas horarias, `cta` de ayuda) en vez de `about_us`
- **Gotcha de dev encontrado**: tras registrar el global nuevo en `payload.config.ts`, el proceso `next dev` ya en marcha dentro del contenedor devolvía `APIError: The global with slug horarios_contacto can't be found` porque `getPayload()` cachea la instancia inicializada y no la recarga sola con Fast Refresh al añadir un global/collection nuevo — hace falta `docker restart biblioteca-frontend` (o reiniciar el dev server) después de registrar un global/collection nuevo en `payload.config.ts`, no basta con guardar el archivo
- **Probado** contra la BD real del contenedor de desarrollo y con `curl` tras el restart (200 OK, tabla de horarios y enlace de FAQs correctos)

### `hero_carrusel` (Home) — Seed dedicado con contenido real

`seeds/heroCarrusel.seed.ts` (nuevo): crea 3 items reales de `hero_carrusel` (Nueva suscripción a Scopus y Web of Science, Nueva sala de estudio en grupo, Talleres gratuitos de gestión bibliográfica — usando 2 imágenes de `seeds/assets/` y `campus.jpg` como placeholder para la tercera, ver nota) y hace `updateGlobal` de `home.hero_carrusel` para que sustituya al carrusel de contenido de broma que crea `home.seed.ts` (hologramas 3D / NASA). Redundante con la sección de carrusel de `home.seed.ts` pero inofensivo — al ir después en la cadena de `npm run seed`, gana y es el que queda enlazado. No se tocó Payload (ninguna collection/global nueva, `hero_carrusel` ya existía).

### `seeds/index.ts` — Punto de entrada único para todos los seeds

`npm run seed` ahora ejecuta `tsx seeds/index.ts` en vez de una cadena de `&&` en `package.json`. `index.ts` lanza cada `*.seed.ts` como proceso hijo (`spawnSync('npx', ['tsx', file], { stdio: 'inherit' })`), en este orden, y se detiene en el primer fallo (mismo comportamiento que `&&`):

1. `layout.seed.ts` — header + footer + global `layout`
2. `home.seed.ts` — hero_carrusel de placeholder, input, news, global `home`
3. `aboutUs.seed.ts` — global `about_us` (`normativa` es el único campo que sigue en uso; `quienes_somos`/`horarios` quedaron huérfanos)
4. `electronicResources.seed.ts` — global `electronic_resources`
5. `quienesSomos.seed.ts` — global `quienes_somos`
6. `investigation.seed.ts` — global `investigation`
7. `formation.seed.ts` — global `formation`
8. `horarios.seed.ts` — global `horarios_contacto`
9. `heroCarrusel.seed.ts` — **tiene que ir después de `home.seed.ts`**: sustituye su `hero_carrusel` de broma por el contenido real, vía `updateGlobal`

Los seeds 3-8 son independientes entre sí y podrían reordenarse sin romper nada; la única dependencia de orden real es 2→9. Si se añade un seed nuevo, añadirlo al array `SEEDS` de `seeds/index.ts` (única fuente de verdad del orden — `package.json` ya no lo duplica).

**Nota sobre la imagen del taller**: el usuario pidió usar contenido real (título/descripción) de una imagen que ya subió manualmente a producción vía el admin de Payload (`Gemini_Generated_Image_pjh4c4pjh4c4pjh4.jpg`, alt "imagen taller universitaria"), pero ese archivo no existe en este entorno de desarrollo — el `media` de este contenedor no tiene ese id/filename. Se usó `campus.jpg` como placeholder (confirmado con el usuario) hasta que suba el asset real a `seeds/assets/` o lo sustituya a mano en el admin de este entorno.

Probado contra la BD real del contenedor de desarrollo y con `curl` contra la home renderizada (200 OK, las 3 diapositivas reales aparecen).

### Login desde el campus + `/perfil` — rama `feat/login-campus` (2026-09-28)

Arquitectura y ficheros en "Login desde el campus (sesión real de Payload)" (sección "Estructura de páginas"). Aquí, qué se hizo, cómo probarlo y qué queda.

**Qué cambia para la app** — se separa la app por estado:
- Páginas **públicas**: igual que antes.
- Páginas **privadas** (`/perfil`, `/perfil/alta`): llaman a `requireSession('/ruta')`; sin sesión → `/auth/login?next=/ruta` → campus → vuelve a `/ruta` ya con sesión.
- **Entrada desde el campus con claves**: `/auth/campus?token=…` descifra, confirma el lector en Absys y abre sesión directamente; sin ficha en Absys → `/perfil/alta`.
- **Header**: ya no lee `lenlec` de `localStorage` (cualquiera podía escribirlo). `app/(frontend)/layout.tsx` le pasa la prop `account` (`{ email, nombre } | null`) desde `getSession()`; "Mi Cuenta" enlaza a `/auth/login?next=<ruta actual>`; el desplegable tiene "Perfil" (`/perfil`) y "Cerrar sesión" (form `POST /auth/logout`, que además limpia el `localStorage` del login antiguo).

**Cambios en `loginCampus_service`** (`collections/LoginCampus.service.ts`): cookie `SameSite` de `Strict` a `Lax`; access `read` = admin o uno mismo, `create/update/delete` = solo admin (antes cualquier logueado leía a todos y podía crear usuarios); `dni`/`nombre`/`apellidos` opcionales y campo nuevo `absysId`; se quitaron los endpoints copiados de `loginAbsys_service` (`/signin`, `/login/:credentials`, `/me`); el descifrado pasó a `lib/integrations/campus/token.ts` y el endpoint de prueba `handleDecryptTest` lo usa. Nueva migración `migrations/20260928_114829_login_campus.ts` — la collection no tenía ninguna (se había registrado en `payload.config.ts` sin `migrate:create`).

**Cómo probarlo en desarrollo** (sin campus real):
1. Dejar `NEXT_CAMPUS_LOGIN_URL` vacía y `NEXT_CAMPUS_SECRET_KEY` con la clave de dev.
2. Si se acaba de registrar algo en `payload.config.ts`: `docker restart biblioteca-frontend`.
3. Pulsar "Mi Cuenta" (o abrir `/biblioteca/perfil`) → redirige a `/biblioteca/auth/simular-campus` → escribir un email → hace de campus: cifra `fecha|email` con la clave real y vuelve a `/auth/campus`.
4. Con `curl`: `curl -s -o /dev/null -w '%{redirect_url}' "http://localhost:8085/biblioteca/auth/simular-campus/emitir?email=<email>&next=/perfil"` devuelve la URL del callback con un token válido; llamarla con `-c jar.txt` guarda la cookie, y `-b jar.txt` la reutiliza.
5. Tests: `npm test` (`lib/integrations/campus/__tests__/token.test.ts`, `lib/auth/__tests__/redirects.test.ts`).

**Probado** (contenedor de dev + Absys real, solo lecturas): sin sesión `/perfil` → login → simulador; token basura → `/auth/error?motivo=invalido`; `next` externo ignorado; email existente en Absys → cookie `payload-token` (`HttpOnly`, `SameSite=Lax`) → `/perfil` con los datos de Absys; con sesión `/auth/login` vuelve directo a `next`; email sin ficha → `/perfil/alta` conservando `next`; por la API un lector solo se ve a sí mismo (`totalDocs: 1`, 404 al leer a otro) y no puede crear usuarios (403); logout revoca el `sid` y `/perfil` vuelve a pedir login; las 3 migraciones aplican limpias contra una BD vacía; 62 tests de Vitest y `tsc --noEmit` sin errores.

**Sin probar**: el envío del formulario de `/perfil/alta` — crearía un lector real en Absys y `createLector` sigue con el error -400 pendiente con Baratz.

**Pendiente**:
- Con Daniel: URL de login del campus y nombre de sus parámetros (token y URL de vuelta). Configurables con `NEXT_CAMPUS_LOGIN_URL`, `NEXT_CAMPUS_TOKEN_PARAM`, `NEXT_CAMPUS_RETURN_PARAM`, sin tocar código.
- La lobby de roles del ADR-0005 (el campus no manda el rol) no está hecha: todos entran como lector.
- Reservas: `/reservas` solo muestra un aviso porque Absys responde `Access denied 'reserv'` con el rol actual; pedir a Baratz permiso de lectura sobre `reserv` (ver "Área Mi cuenta")
- El botón "Iniciar sesión con Microsoft" de `app/(auth)/login/page.tsx` apunta a la portada del campus; podría apuntar a `/biblioteca/auth/login`.
- En la BD de dev quedaron 2 lectores de prueba en `loginCampus_service` (`mansour@atlanticomedio.es` y `no.existe.prueba@atlanticomedio.es`).

**Nota de ramas**: `feat/login-campus` sale de `main` tras el merge de los PRs #15 (`refactor/absys-adapter`) y #12 (`feat/login-microsoft-emails`), no de `refactor/absys-adapter`.

### Área "Mi cuenta": `/perfil`, `/prestamos`, `/reservas` (2026-09-28)

- **`/profile` pasa a `/perfil`** (y `/profile/alta` a `/perfil/alta`); `DEFAULT_AFTER_LOGIN` en `lib/auth/redirects.ts` también. `/profile` da 404.
- **Route group `app/(frontend)/(cuenta)/`** con `layout.tsx` común: título "Mi cuenta" + `components/cuenta/CuentaNav.tsx` (`"use client"`, pestañas de texto Perfil · Préstamos · Reservas con subrayado `accent` en la activa, `aria-current="page"`). Cada página sigue llamando a `requireSession('/ruta')` (el layout no conoce la ruta).
- **Estilo**: minimalista/institucional a petición explícita — sin tarjetas ni animaciones; listas `dl` con separadores, tabla simple y avisos con `components/cuenta/AvisoCuenta.tsx` (borde izquierdo `accent` sobre `bg-muted`). `components/ProfileDatosCard.tsx` se eliminó.
- **`/prestamos`**: nuevo `absys.findPrestamosByLector(lenlec)` en el adaptador (`lib/integrations/absys/prestamo.ts` + `mappers/prestamo.ts`, con fixture `prestamo-search.json` y tests). Busca en la tabla `presta` por **`prnlec`** (con `lenlec` Absys responde `Unrecognized field`). Campos usados: `prbarc` (código del ejemplar), `prfpre`/`prfdev` (`"YYYY-MM-DD HH:mm:ss"`, se guarda solo la fecha), `prnren` (renovaciones), `renewable`, `prcosu` (sucursal). `isPrestamoVencido` compara `prfdev` con hoy. La tabla (`components/cuenta/PrestamosTabla.tsx`, cliente porque usa `Badge`) muestra el **código del ejemplar, no el título**: `presta` no trae título y `_secondary`/`_tertiary` no lo añaden; sacarlo requeriría buscar el ejemplar en `copias`/`cata` (pendiente). No está confirmado si `prfdev` es la fecha prevista o la real de devolución — se muestra como "Devolución".
- **`/reservas`**: solo aviso institucional ("disponible próximamente", remite al mostrador o a contacto). Motivo: `search` sobre `reserv` devuelve `code 3 / subcode 32: Access denied 'reserv'` con el rol actual de Connect → **pedir a Baratz permiso de lectura sobre `reserv`**. Marcado con `TODO(F10)` en la página.
- **Header**: enlaces del desplegable a `/perfil`, `/reservas` y `/prestamos`.
- **Probado** en el contenedor de dev contra Absys real (solo lecturas): sin sesión las 3 redirigen al login con su `next`; con sesión las 3 dan 200; `/perfil` muestra el número de lector; `/prestamos` muestra el estado vacío (el lector de prueba tiene 0 préstamos, así que **la tabla con datos solo está cubierta por tests**, no vista con préstamos reales); 69 tests de Vitest y `tsc --noEmit` sin errores.
