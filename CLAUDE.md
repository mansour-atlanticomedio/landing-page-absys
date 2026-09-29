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
- Migraciones existentes: `migrations/20260731_114550_baseline.ts` (base) + `migrations/20260915_162539_session_2026_09_14_content_globals.ts` (todo el schema de la sesión de recursos-electrónicos/quiénes-somos/investigación/formación/horarios — se generó a posteriori porque no se había estado corriendo `migrate:create` en cada paso; a partir de ahora generar la migración en el mismo momento en que se toca el schema, no al final) + `migrations/20260928_114829_login_campus.ts` (collection `loginCampus_service`) + `migrations/20260929_102432_actualizar_colectivos_campus.ts` (enum `colectivo` de `loginCampus_service`: de ALUMN/PDI/PAS/EXT a los 5 tipos reales ADULT/ALUMN/ANONI/INVIT/PROFE — el `up` remapea filas existentes con `UPDATE ... CASE`, no un cast directo, porque un cast directo revienta con valores que ya no están en el enum nuevo) + `migrations/20260929_110457_layout_enlaces_externos.ts` (tabla nueva para `layout.enlaces_externos[]`)

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
| `client.ts` | Cliente HTTP único (`absysClient`). Solo servidor (lanza si `window` existe). Lee `NEXT_ABSYS_API`, `NEXT_ABSYS_USERNAME`, `NEXT_ABSYS_PASSWORD` (en **base64**, se decodifica aquí) y `ABSYS_TIMEOUT_MS` (10 s por defecto, con `AbortController`). Tres operaciones: `search(params)` → GET con todo en la query; `add(table, fields)` → POST `x-www-form-urlencoded`; `modify(table, fields)` → GET con todo en la query (igual que `search`; a diferencia de `add`, está documentada como probada y funcional en `docs/Absys API.md` del vault). Traduce fallos a errores tipados: red/timeout/HTTP 5xx/JSON inválido/`code` 1 o 4 → `AbsysUnavailableError`; HTTP 4xx y cualquier otro `code` ≠ 0 → `AbsysInvalidDataError`. Nunca mete credenciales ni la respuesta cruda en el mensaje de error |
| `errors.ts` | Jerarquía de errores: `AbsysError` (base, con `code`/`subcode` de Absys) → `AbsysUnavailableError` (Absys caído o inalcanzable), `AbsysInvalidDataError` (Absys rechaza los datos o responde algo incoherente), `AbsysNotFoundError` (definido pero aún sin uso) |
| `mappers/lector.ts` | Traducción pura (sin I/O) entre el formato de Absys (`lenlec`, `lenomb`, `leapel`, `lemail`, `lefubi`...) y nuestros tipos `Lector` / `NuevoLector` / `ActualizarLector`. Contiene `Colectivo` (los 5 tipos de lector reales: ADULT/ALUMN/ANONI/INVIT/PROFE, ver "Login desde el campus") y las constantes institucionales del alta (`COLECTIVOS` con su `lecocf` y perfil de préstamo — solo confirmado para ALUMN/PROFE, `LECOBI`, `LECOSU`, `LECART`), `formatAbsysDateTime` (`dd/mm/yyyy hh:mm:ss`), `resolveColectivo` (cualquier colectivo desconocido cae a `ALUMN`, ADR-0002), `EXTERNAL_ID_FIELD` (campo con el que se cruza la identidad del campus; **provisional**, hoy `lenlec`, ADR-0005), `deriveCampusIdentity` (nombre/apellidos/`rol: Colectivo` a partir del dominio del email del campus, para el alta automática y para guardar el rol aparte) y `toModifyLectorQuery` (query de `modify` solo con nombre/apellidos) |
| `mappers/catalogo.ts` | `toCatalogQuery`: convierte `{ search, page, limit, detalle }` a la query de Absys (`base: cata`, `_start_position`/`_max_records`, 12 por página). Listado → `_doc_fields: "245, 100, 020"` (título/autor/ISBN MARC); `detalle: true` → `_description: "1"` (ficha completa) |
| `lector.ts` | `createLectorService(client)`: `findLectorByExternalId` (null si no existe, `AbsysInvalidDataError` si hay duplicados), `createLector` (alta; **no verificado contra Absys real**, error -400 pendiente con Baratz — usado también por el alta automática del login de campus) y `updateLector` (`operation=modify`; solo nombre/apellidos, editable desde `/perfil`; **tampoco verificado contra Absys real** desde este código, aunque Baratz documenta `modify` como probado y funcional) |
| `catalogo.ts` | `createCatalogoService(client)`: `searchCatalog(params)`, devuelve la respuesta cruda de Absys (el front sigue consumiendo ese formato) |
| `mappers/prestamo.ts` | `toPrestamosQuery` (tabla `presta` filtrada por **`prnlec`**, no `lenlec`), `extractPrestamos`, `toPrestamo` (→ `Prestamo`: `ejemplar`, `fechaPrestamo`, `fechaDevolucion`, `renovaciones`, `renovable`, `sucursal`) e `isPrestamoVencido` (re-exportado desde `index.ts`) |
| `prestamo.ts` | `createPrestamoService(client)`: `findPrestamosByLector(lenlec)` → `Prestamo[]` (sin título: `presta` solo trae el código del ejemplar) |
| `mock.ts` | `absysMock`: el mismo adaptador pero con un cliente falso que responde con las fixtures. Solo existe un lector (el de `lector-search.json`); cualquier otro id devuelve vacío. Los préstamos salen de `prestamo-search.json` |
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
| `layout` | `globals/Layout.ts` | `header` (rel→header), `footer` (rel→footer), `enlaces_externos[]` (`key`/`label`/`url`, ver "Enlaces externos") | Template del sitio |

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

### Enlaces externos (2026-09-29)

Registro de enlaces a sitios externos (repositorio, catálogo, redes sociales...) editable desde el
admin de Payload sin tocar código ni redeployar — **alcance deliberadamente limitado a enlaces no
sensibles**; nada relacionado con autenticación (las URLs del login del campus siguen en variables
de entorno, ver "Login desde el campus").

- **Campo** `layout.enlaces_externos[]` (`globals/Layout.ts`): array con `key` (identificador libre
  en minúsculas, ej. `opac`/`dspace`/`instagram` — es lo que usa el código para buscarlo),
  `label` (nombre para el admin) y `url`.
- **`lib/links.ts`**: `resolveEnlaceExterno(enlaces, key, fallback)` — función pura, sin I/O; busca
  por `key` en el array y devuelve `fallback` si no hay entrada o su `url` está vacía. Cualquier
  página/componente que ya haga `payload.findGlobal({ slug: 'layout' })` (o lo reciba como prop)
  puede usarla así: `resolveEnlaceExterno(layout.enlaces_externos, 'dspace', '/enlace/por-defecto')`.
- **Sin migrar automáticamente** los enlaces externos que ya estaban hardcodeados en el código (el
  repositorio institucional en `investigacion/page.tsx`, las redes sociales de
  `FooterSimple.tsx`...) — se creó solo la infraestructura; migrar cada uno es trabajo aparte, a
  hacer cuando haga falta tocar esa página.
- Migración `migrations/20260929_110457_layout_enlaces_externos.ts` (tabla nueva, sin dato que
  remapear).

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
   → verifyCampusToken → deriveCampusIdentity(email) → { nombre, apellidos, rol }
   → absys.findLectorByExternalId(email)
   → sin ficha en Absys: absys.createLector({ ..., colectivo: rol }) — alta automática, validar en
     el campus es suficiente, no hace falta rellenar ningún formulario
   → createCampusSession(email, lector, rol) (crea/actualiza el usuario, guarda `rol` en
     `colectivo`, añade sid, firma JWT) → cookie
   → redirige a `next` (siempre, ya no hay paso intermedio de alta)
B) Página privada sin sesión: requireSession('/ruta') → /auth/login?next=/ruta
   → NEXT_CAMPUS_LOGIN_URL?return=<site>/auth/campus?next=/ruta → campus → vuelve por A
```

**Alta automática (2026-09-29)**: el campus solo manda el email, así que `deriveCampusIdentity`
(`lib/integrations/absys/mappers/lector.ts`) lo parsea asumiendo el formato institucional
`nombre.apellidos@{pdi|alu|unam}.atlanticomedio.es`, o sin subdominio para el resto de personal
(`nombre.apellidos@atlanticomedio.es`) — nombre/apellidos del local-part (separados por el primer
punto, capitalizados; `"-"` si falta alguno). La dirección se manda como `"-"` (`DIRECCION_AUTO_ALTA`,
constante) porque Absys la exige y el campus no la da. Nada de esto se vuelve a pedir en un
formulario — `/perfil/alta` ya no existe.

**Tipos de lector / rol (2026-09-29, dados por el usuario)**: `Colectivo`
(`lib/integrations/absys/mappers/lector.ts`) tiene los 5 tipos reales de Absys, cada uno con su
dominio de correo institucional — `deriveCampusIdentity` los comprueba **en este orden**:

| Dominio del correo | `Colectivo` | Quién |
|---|---|---|
| `@pdi.atlanticomedio.es` | `PROFE` | Profesores |
| `@alu.atlanticomedio.es` | `ALUMN` | Alumnado |
| `@unam.atlanticomedio.es` | `INVIT` | Externos |
| `@atlanticomedio.es` (a secas) | `ADULT` | Personal |
| Cualquier otro dominio | `ANONI` | Rol más básico (fallback) |

El mismo valor sirve como `colectivo` al dar de alta en Absys (`createLector`) y se guarda tal cual
en el campo `colectivo` de `loginCampus_service` (select con estas 5 opciones — antes tenía
ALUMN/PDI/PAS/EXT, un intento previo de esta misma sesión con nombres distintos; migración
`20260929_102432_actualizar_colectivos_campus`, que remapea PDI→PROFE/PAS→ADULT/EXT→INVIT en
las filas existentes en vez de un cast directo, porque Absys mismo ya usa/usaba "PDI" como código
real en algunas fichas existentes — **si Baratz confirma que "PDI" sigue siendo el código correcto
en Absys y "PROFE" no existe ahí, hay que revisar esto**, ver `lecocf`/`fromNuevoLector`).
`resolveColectivo` sigue cayendo a `ALUMN` para cualquier string que no sea uno de estos 5 (ADR-0002,
p. ej. si llega el código antiguo `PDI`/`PAS`/`EXT` desde algún sitio que no se haya actualizado).
`lecocf`/perfil de préstamo solo están confirmados para `ALUMN`/`PROFE` (venían de antes); para
`ADULT`/`ANONI`/`INVIT` no se manda `lecocf` (campo opcional) por no inventar un valor institucional
que no se ha confirmado con Baratz. Se recalcula y resincroniza en **cada** login de campus, no solo
en el alta, así que también corrige el rol de lectores que ya existían antes de este cambio.
Expuesto de solo lectura en `/perfil` (fila "Rol", con las mismas etiquetas que el select del admin).

| Fichero | Función |
|---------|---------|
| `lib/integrations/campus/token.ts` | `decryptCampusToken` (port del PHP del campus: base64(IV 16 bytes + AES-128-CBC("fecha\|email")), clave `NEXT_CAMPUS_SECRET_KEY` recortada/rellenada a 16 bytes), `verifyCampusToken` (además rechaza tokens de más de `NEXT_CAMPUS_TOKEN_MAX_AGE` s, 300 por defecto), `encryptCampusToken` (solo para simular el campus en dev/tests). Los `+` del base64 que lleguen como espacios se corrigen |
| `lib/auth/redirects.ts` | Puro, sin Payload: `safeNextPath` (solo rutas internas, evita open redirect y bucles a `/auth/*`), `buildCampusLoginUrl`, `redirectResponse` (Location **relativa** con el basePath, para que funcione igual detrás de nginx que contra el contenedor) |
| `lib/auth/session.ts` | Servidor: `getSession()` (incluye `colectivo` en `CampusSession`), `requireSession(next)` (para Server Components de páginas privadas), `createCampusSession(email, lector, rol?)`, `linkAbsysLector`, `destroyCampusSession` (revoca el `sid` en BD, no solo borra la cookie) |
| `app/(auth)/auth/campus/route.ts` | Callback A |
| `app/(auth)/auth/login/route.ts` | Entrada única al login: con sesión vuelve a `next`; sin ella, al campus. Sin `NEXT_CAMPUS_LOGIN_URL`: en dev → `/auth/simular-campus`, en prod → `/auth/error?motivo=config` |
| `app/(auth)/auth/logout/route.ts` | `POST`, revoca la sesión y vuelve a `/` |
| `app/(auth)/auth/error/page.tsx` | Motivos: `invalido`, `caducado`, `absys`, `config` |
| `app/(auth)/auth/simular-campus/` | **Solo dev** (404 en producción): formulario con un email que genera un token real y vuelve al callback. Es la forma de probar el flujo hasta que Daniel tenga lista la redirección |
| `app/(frontend)/(cuenta)/perfil/page.tsx` + `perfil/actions.ts` + `components/cuenta/PerfilForm.tsx` | Privada: datos del lector en Absys, con nombre/apellidos editables (`absys.updateLector`, vía `operation=modify`); dirección/colectivo/email no se pueden editar desde aquí (decisión del usuario, 2026-09-29). Muestra también el rol (`session.colectivo`, solo lectura). Si Absys está caído muestra los guardados en Payload |

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
- Página `/servicios` importa `RenderBlocks` pero no lo usa — tiene JSX hardcodeado (`/investigacion` y `/formacion` ya no importan `RenderBlocks`, ver `MEMORY.md` para el porqué)

---

## Registro de sesiones — `MEMORY.md`

El historial de **qué se hizo, cuándo y por qué** vive en `MEMORY.md` (raíz del repo), no aquí.
`CLAUDE.md` describe el estado *actual* del sistema (arquitectura, collections, globals,
componentes, reglas); `MEMORY.md` es el changelog cronológico de sesiones de trabajo, con qué se
probó y qué quedó pendiente en cada una.

**Regla obligatoria**: al terminar cualquier tarea o unidad de trabajo verificable (ver "Cuándo
commitear" en Git workflow), añade una entrada a `MEMORY.md`. No es opcional ni queda a criterio
de la tarea — toda sesión de trabajo termina con su entrada en `MEMORY.md`, igual de obligatorio
que el commit final.

**Qué va en cada sitio, para no duplicar**:
- Un global/collection/componente nuevo, o un cambio de flujo de datos → actualiza las tablas de
  referencia de este fichero (`CLAUDE.md`) con el estado resultante, y en `MEMORY.md` deja solo el
  *por qué* de la decisión, cómo se probó y qué quedó pendiente — no repitas aquí la lista de
  campos ni allí la arquitectura completa.
- Un bug corregido que deja una lección para el futuro (un gotcha de Payload, un patrón que no
  funcionó) → si es una regla permanente a seguir, a "Bugs conocidos" o a la sección técnica que
  corresponda en `CLAUDE.md`; si es solo el relato de cómo se encontró y arregló, a `MEMORY.md`.
- Como con `CLAUDE.md`, no se borra información existente de `MEMORY.md` sin preguntar antes —
  solo se añaden entradas nuevas.
