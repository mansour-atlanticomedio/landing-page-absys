# MEMORY.md

Recap de sesiones de trabajo, en orden cronológico inverso (más reciente arriba).

Este fichero es el **changelog de sesiones**: qué se hizo, por qué, cómo se probó y qué quedó
pendiente. El estado *actual* del sistema (schema de Payload, componentes, rutas, reglas) vive en
`CLAUDE.md` — no se duplica aquí. Ver la sección "Registro de sesiones" de `CLAUDE.md` para la
regla de cuándo añadir una entrada (obligatorio al terminar cada tarea).

---

## 2026-10-07 — Solicitud de libro solo con sesión y modal de confirmación sin `history.back()`

- `/adquisiciones/solicitud-compra` usa `requireSession`: sin sesión redirige a `/login` (hoy `requireSession` apunta a `/login` fijo, un cambio temporal del usuario, así que no vuelve a la página tras entrar); con sesión muestra el formulario.
- El usuario quitó del formulario la sección "Datos del solicitante" (sale de la sesión). El modal usaba ese campo para el nombre ("Gracias, ."), ahora recibe `solicitante` (nombre + email de la sesión) por props desde el page.
- El botón "Aceptar" con `window.history.back()` se sustituyó por dos acciones: "Volver a servicios" (`Link`) y "Sugerir otro libro" (cierra y limpia). `history.back()` dependía de que el usuario llegara desde otra página de la web.
- Probado con `curl`: sin cookie 307 a `/biblioteca/login`; con cookie del simulador de campus 200 con el formulario. No probado en navegador. El envío sigue simulado.

---

## 2026-10-08 — Simulador del campus tras un flag de entorno y correos con logo

- **`lib/env.ts`**: `isProduction` y `devToolsEnabled` (`NODE_ENV !== production` o `FEATURE_DEV_TOOLS=true`). Aplicado solo al simulador del campus (`simular-campus/page.tsx`, `emitir/route.ts` y el fallback al simulador de `auth/login/route.ts`). Quedan con su `NODE_ENV` directo, sin migrar, los endpoints temporales de `LoginCampus.service.ts`, las cookies `secure` y los `console.log` de componentes. `NODE_ENV` no se define en el `.env` (lo gestiona Next; el Dockerfile fija `production`); `FEATURE_DEV_TOOLS` sí, y es variable de servidor (se lee en runtime, no hace falta rebuild).
- **Correos** (`collections/Email.service.ts`): cabecera blanca con el escudo de la UNAM (`public/logos/unam-color-logo.png`, ya incluido en la imagen Docker) y filete turquesa, y pie con la dirección y una nota de mensaje automático. El logo va **incrustado por `cid`** como adjunto inline en vez de enlazado por URL: se ve en desarrollo y no depende de que el sitio sea público ni de que el cliente bloquee imágenes remotas. Todos los envíos pasan por `sendBrandedEmail` para no olvidar el adjunto.
- Probado: `tsc` limpio; `devToolsEnabled` con development / production / production+flag; correos construidos con el transporte de pruebas de nodemailer (parte `Content-ID: <unam-logo>` y PNG presentes); simulador sigue en 200 en dev. **No probado**: el aspecto en Gmail/Outlook reales ni el envío SMTP real. En producción, el 404 del simulador no se ha comprobado con un build de producción.
- Observado sin tocar: el aviso de `/contacto` (`sendEmail`) mete `doc.message` (richText Lexical) directamente en el HTML, así que sale `[object Object]`, y los datos del formulario no se escapan.

---

## 2026-10-07 — Envío real del formulario de sugerencia de libros por correo

### Qué se hizo y por qué
Comprobado: el formulario **no enviaba nada** (el modal era simulado) y el servicio de email (`nodemailerAdapter` + helpers de `collections/Email.service.ts`) solo lo usaba `/contacto`. Se añadió `sendBookSuggestionEmail` (aviso a la Biblioteca con `replyTo` al solicitante) y `sendBookSuggestionConfirmationEmail` (copia al solicitante, porque el modal la promete), con la plantilla de los otros correos. Se llaman desde una server action (`actions.ts`) que toma nombre, apellidos, correo y rol de `getSession()` en el servidor (el cliente no puede falsearlos) y valida con `lib/sugerencias.ts` (máx. 10 libros, título y autor obligatorios, longitudes, enlaces solo http/https). El texto del usuario se escapa antes de entrar en el HTML del correo. Si falla el aviso a la Biblioteca se avisa al usuario con un toast; si falla solo la confirmación se registra en log y no se le dice nada. Se añadió `COLECTIVO_LABELS` a `mappers/lector.ts` (el select de rol de `perfil/page.tsx` mantiene su copia local).

### Cómo se probó
`tsc` limpio, 92 tests (6 nuevos de validación), y los dos correos generados con un `payload` falso: destinatario, `replyTo`, asunto y HTML escapado (un `<script>` en el título no llega crudo). **No se mandó ningún correo real** ni se probó la server action de punta a punta ni en navegador.

### Qué quedó pendiente
- Probar un envío real (con `SUGGESTIONS_EMAIL_TO` apuntando a una cuenta de prueba): el SMTP actual es el de `.env`, y el remitente por defecto del adaptador es `Mansour Lo Lo`.
- Definir el destino real de producción (`SUGGESTIONS_EMAIL_TO`; por defecto `biblioteca@atlanticomedio.es`).
- No se guarda registro en BD: si el SMTP falla en el momento, la sugerencia se pierde (el usuario ve el error y puede reintentar). Una collection de sugerencias sería el siguiente paso si se quiere histórico.
- Sin límite de frecuencia por usuario.

---

## 2026-10-08 — Fase 2 de seguridad: `/contacto` en servidor, con sesión y límites

Hasta ahora `/contacto` hacía `POST /api/sendEmail` anónimo: sin límites, sin escapar, con destino a un Gmail personal fijo, y un hook `afterChange` enviaba el correo. Ahora es una server action (`contacto/actions.ts` → `procesarContacto`) que **exige sesión** por decisión del usuario (el solicitante sale de la sesión; formulario solo pide asunto y mensaje), usa `lib/security` y guarda el histórico en `sendEmail`, que pasa a `adminOnly`, sin hook y con `message` como texto (migración `contacto_mensaje_texto`, escrita a mano para conservar los mensajes existentes). Detalle del flujo y variables en `CLAUDE.md` → "Capa anti-abuso". El tope global del buzón interno pasó de 200 a 300/día (≈30 IPs a 10/día) a petición del usuario, y ahora es por tipo de correo para que contacto no bloquee sugerencias.
Revisado con `reviewer` y `security-auditor` (sin bloqueantes; veredicto "cerrar con 4 condiciones"). Correcciones de la revisión: la regla de IP de autenticados ya no cuenta peticiones que su regla de usuario rechazó (una cuenta podía bloquear a todo el sitio), reembolso de cupos si falla el SMTP, histórico solo tras envío correcto, aviso propio de duplicado, migración que conserva saltos de línea, test del escapado y de que el solicitante sale de la sesión. Se probó y **se descartó** `serverActions.bodySizeLimit: 100kb`: es global y también afecta al admin de Payload (riesgo sin verificar); queda el máximo por validación (mensaje 2000 caracteres).
Probado: `tsc` limpio y 271 tests; migración con 8 formas de dato y `npm run migrate` limpio contra BD vacía (9 migraciones); en vivo, `/contacto` sin sesión (tarjeta de login) y con sesión (formulario) en 200, y `/api/sendEmail` da 403 a anónimos y lectores. **No probado**: envío real por SMTP, el formulario en navegador, ni el rechazo real de cuerpos grandes.

### Qué quedó pendiente
- **Antes de producción:** definir y verificar `TRUSTED_IP_HEADER`/`TRUSTED_IP_HOP` según el nginx real; backup de `send_email` antes de aplicar la migración; una sola réplica de `frontend` mientras el almacén sea en memoria (el reinicio resetea los cupos); comprobar tras nginx que las server actions no se rechazan por `Host`.
- **Token del campus (preexistente):** AES-128-CBC sin MAC; con un token válido ajeno se puede mantener "fresco" más de 300 s. Pedir a Daniel un HMAC o AES-GCM y confirmar si el campus emite tokens para externos con registro abierto (de eso depende cuántas identidades puede conseguir un atacante).
- El enlace "Iniciar sesión" de `ContactoLoginCard` va a `/login` (igual que Servicios y `requireSession`, cambio temporal del usuario): tras entrar no vuelve a `/contacto`.
- Teléfono y correo de `ContactoLoginCard` van fijos (el global `contact` solo tiene `hero`).
- `too_fast` responde éxito falso: pegar y enviar en menos de 3 s desde el render pierde el mensaje sin aviso (registrado en log).
- `components/SimpleForm.tsx` queda sin uso.
- Fase 3: límites y dedupe en las sugerencias de libro (y revisar que `solicitante.nombre` va en el asunto de `sendBookSuggestionEmail`).

---

## 2026-10-08 — Fase 1 de seguridad: `lib/security/` (limitadores, honeypot y política de correo)

Funciones puras con almacén y reloj inyectados, sin conectar todavía (estado y contrato en `CLAUDE.md` → "Capa anti-abuso"). Tres rondas de revisión (reviewer + security-auditor) rediseñaron lo que salió de la primera versión: el limitador **incrementaba todas las reglas aunque una fallara**, así que una sola IP podía agotar el cupo de dominio/destinatario de terceros (p. ej. bloquear los PIN de `alu.atlanticomedio.es`); ahora hay dos niveles (actor/compartido) con `peek`, tope `limit+1` y compensación. También se cerraron: expulsión de contadores por inundación de claves, IPv6 sin agrupar, alias `+tag`/Gmail y buzón interno, secreto vacío del honeypot, `windowMs` inválido que fallaba abierto, reloj hacia atrás y falsos positivos del honeypot.
Probado: `tsc` limpio y 231 tests (134 en `lib/security`) con los escenarios de ataque (saturación, NAT del campus con 30 usuarios, 20 peticiones concurrentes). **No probado**: nada en vivo, porque aún no está conectado.

### Qué quedó pendiente
- **Saturación (residual):** tras llenar una dimensión con ~5000 /64 distintos, ~24 % de IPs nuevas legítimas caen en cubos ya bloqueados (medido: 762 de 1000). Mitigación real: store Postgres con TTL (fase 4).
- **`internal-mailbox` (200/día global):** unas ~20 IPs distintas pueden agotarlo y bloquear el contacto de todos. Decisión de producto pendiente: aceptarlo, o exigir sesión/captcha en `/contacto`.
- **Agregado institucional 1000/día por tipo:** valor inicial a confirmar con el volumen real (matrícula).
- **Store Postgres (fase 4):** `increment` atómico con `cap`, `peek`, `decrement`, y a ser posible un `incrementMany` transaccional; purga de ventanas caducadas y reloj consistente entre réplicas.
- **Ops:** nginx sobrescribe la IP real, puerto 8085 solo en localhost, `trustedHopFromRight` acorde a los proxies reales, alerta cuando se vea `unknown` en producción.
- Dedupe: es solo anti-duplicado accidental (homoglifos y espacios Unicode no-Cf lo esquivan); el rate limit es el control real.

---

## 2026-10-08 — Fase 0 de seguridad: `access` explícito en todo Payload

Se **confirmó** en dev el hallazgo de la auditoría: con la cookie de un lector del campus, `POST /api/users` creaba un admin (201), y `POST/PATCH/DELETE` de contenido y `GET /api/users|sendEmail|loginAbsys_service` también funcionaban. Tras el cambio todo da 403 (con lector y anónimo). Detalle de reglas en `CLAUDE.md` → "Access Control". Pasaron `reviewer` (sin bloqueantes) y `security-auditor` (veredicto: cierra la escalada original; dos residuales de Payload). De ahí: `unlock: isAdmin` en las 3 collections auth (su default permitía a un lector resetear el bloqueo de un admin y hacer fuerza bruta alternando `login`/`unlock`) y `isAdminOrSelf` renombrado a `isAdminOrSelfReader` (su filtro por id no distingue collections). Probado en vivo con cookie de lector tras reiniciar el contenedor: `unlock` y `POST /users` dan 403. No hay schema, no hay migración.

### Qué quedó pendiente
- `payload-locked-documents` (default de Payload: un lector puede leer o crear locks falsos; arreglo posible `lockDocuments: false` en todas las collections/globals).
- *(resuelto después)* `signin` cerrado en producción y `collections/Library.ts` eliminada; `payload-locked-documents` es riesgo aceptado por el usuario.
- `BooksList` (página `/biblioteca`) y `/libros` siguen llamando a `/api/library/`, que no existe: dan 404 y muestran lista vacía.
- No verificado: que un admin real edite tras el cambio (sin credenciales en dev), el `/first-register` real, y subir SVG o más de 10 MB.
- `POST /api/sendEmail` sigue abierto hasta la fase 2.
- El seed de solicitud de compra no es idempotente (duplica docs e imagen en cada ejecución).

---

## 2026-10-08 — Rama `feat/seguridad-api-email`: arranque y primeros cierres

Issue: capa de seguridad para la API y el correo (rate limiting por varias dimensiones, honeypot, cola con workers, kill switch). Se trabajó con `architect` (plan por fases) y `security-auditor` (línea base); el plan y los hallazgos están en la conversación y se irán volcando aquí fase a fase. Decisiones del usuario: empezar por la fase 0 (cerrar el control de acceso de collections/globals), contacto a `CONTACT_EMAIL_TO` (por defecto biblioteca@atlanticomedio.es) con `message` pasando de richText a texto, y no se sabe si habrá varias réplicas, así que los contadores van a Postgres desde el principio y la cabecera de IP será configurable.
- Retirado `FEATURE_DEV_TOOLS` (ver entrada de abajo).
- `POST /api/loginAbsys_service/login/:credentials` devuelve 404 en producción. **Consecuencia**: la pantalla `/login` antigua (`app/(auth)/login/page.tsx`) llama a ese endpoint, así que en producción no puede iniciar sesión (`/signin` sigue abierto). El login real es el del campus; hay que decidir qué pasa con esa pantalla y con el colectivo EXT.

---

## 2026-10-08 — Simulador del campus tras un flag de entorno

- **`lib/env.ts`**: `isProduction` y `devToolsEnabled` (`NODE_ENV !== production`; el flag `FEATURE_DEV_TOOLS` que se añadió aquí se **retiró el 2026-10-08** porque activarlo en producción habilitaba el simulador, que firma tokens para cualquier correo: la auditoría de seguridad lo marcó como toma de cuenta total). Aplicado solo al simulador del campus (`simular-campus/page.tsx`, `emitir/route.ts` y el fallback al simulador de `auth/login/route.ts`). Quedan con su `NODE_ENV` directo, sin migrar, los endpoints temporales de `LoginCampus.service.ts`, las cookies `secure` y los `console.log` de componentes. `NODE_ENV` no se define en el `.env` (lo gestiona Next; el Dockerfile fija `production`); 
- Probado: `tsc` limpio; `devToolsEnabled` con development / production / production+flag; el simulador sigue en 200 en dev. **No probado**: el 404 con un build de producción real.

---

## 2026-10-07 — La comprobación de sesión de "Sugerir libro" pasa a `/servicios`

El usuario no quiso que el redirect ocurriera al llegar a la página privada. `/servicios` hace `getSession()` y el botón "Sugerir libro" apunta a `/adquisiciones/solicitud-compra` con sesión o a `/login` sin ella. La página de destino conserva su `requireSession` como red de seguridad para quien entre por URL directa (el formulario necesita el solicitante de la sesión); quitarlo es una decisión pendiente del usuario. Probado con `curl` con y sin cookie: el href cambia como se espera.

---

## 2026-10-07 — Global `solicitud_compra`: cabecera de la página editable desde Payload

### Qué se hizo y por qué
Se interpretó "editar el header" como la cabecera (Hero) de `/adquisiciones/solicitud-compra`, que iba
fija en código; el header global del sitio ya se edita desde `layout`. Global nuevo
`solicitud_compra` con `hero` → collection `hero`, mismo patrón que `electronic_resources`;
migración `20261007_164512_solicitud_compra_global` (solo `CREATE TABLE` + FK + índice) y
`seeds/solicitudCompra.seed.ts` (registrado en `seeds/index.ts`). La página conserva los textos
anteriores como respaldo si el global está vacío. En la misma sesión se cambió "Proponer una compra"
por "Sugerir libro" y el carrito por `BookPlus`.

### Cómo se probó
Migraciones aplicadas limpias contra una BD temporal vacía (8), seed ejecutado en el contenedor y fila
comprobada en la BD de dev, reinicio de `biblioteca-frontend` y `curl` 200 con el hero servido desde el
media de Payload. Los seeds hay que lanzarlos dentro del contenedor (`docker exec biblioteca-frontend
npx tsx seeds/<x>.seed.ts`); en el host fallan con "missing secret key".

### Qué quedó pendiente
El envío del formulario sigue simulado (ver entrada siguiente).

---

## 2026-10-07 — Página `/adquisiciones/solicitud-compra` y tarjeta en Servicios (rama `feat/enlaces-externos`)

### Qué se hizo y por qué
- La tarjeta "Acceso al catálogo" de `/servicios` pasa a "Solicitud de compra" y enlaza a la página nueva.
- Página nueva a partir de `desiderata_universidad_del_atlantico_medio.html` (borrador del usuario), rehecha con la plantilla del sitio: `Hero`, shadcn (`Card`, `Input`, `Label`, `Select`, `Dialog`, `Button`), tokens de color del sistema (`primary`/`accent`/`muted`, no los slate/amber del HTML) y `font-display`. El estado vive en un client component (`SolicitudCompraForm`); el `page.tsx` es server y solo pone el Hero. Cada libro lleva un id propio para no mezclar valores al borrar uno del medio.
- Siguiendo el patrón "UI primero, datos después", el Hero va fijo en el page, sin global de Payload.

### Cómo se probó
`tsc --noEmit` limpio y `curl` 200 en `/servicios` y en la página nueva, con el href bajo `/biblioteca`. No probado en navegador (añadir/quitar libros, modal, validación del Select).

### Qué quedó pendiente
- **El envío es simulado**: el modal dice "enviada con éxito" pero no se guarda ni se envía nada. Decidir destino (collection + email, o Absys) antes de publicar. `sendEmail` hoy escribe a un Gmail fijo, no reutilizar tal cual.
- Los colectivos del select (alumno/profesor/PDI/PAS) vienen del HTML y no coinciden con los 5 tipos de Absys (ADULT/ALUMN/ANONI/INVIT/PROFE).
- Si se conecta a Payload: global con `hero` editable, y añadir la página como `ancla`/enlace en el navbar.
- El HTML original sigue sin trackear en esa carpeta y trae texto suelto tras `</html>`.

---

## 2026-10-06 — Header y Footer con enlaces del registro, anclas y URLs propias (rama `feat/enlaces-externos`)

### Qué se hizo y por qué
Para no duplicar URLs externas entre el registro (`layout.enlaces_externos`) y el navbar/footer, cada
enlace de ambos lleva ahora un `tipo` (interno / ancla / registro / externo). Estado resultante y
tabla de campos en `CLAUDE.md` → "Enlaces de navbar y footer". Decisiones: anclas de **lista cerrada**
(`ANCLAS` en `lib/links.ts`, con ruta + `id` real) para que el admin no pueda apuntar a un id
inventado; resolución en **servidor** (`resolveNavbar`/`resolveFooterLinks`) para que Header/Footer
solo pinten `{ href, external, newTab }`; defaults (`interno` en header reutilizando `to`,
`externo` en footer conservando `link`/`url`) para que la migración no toque datos. Fuera de alcance
a propósito: las políticas legales del footer siguen siendo texto plano.
Trabajo repartido: resolver + tests (orquestador), schema/migración/seed (`backend`), Header/Footer
(`designer`), revisión (`reviewer`).
Arreglos del Header de paso: los botones de primer nivel eran `<button>` con `div` dentro
(HTML inválido, sin ctrl+click); ahora son enlaces reales, y el desplegable abre también con foco de
teclado. El Footer ya no pinta `<a href={null}>` en filas solo-texto.

### Cómo se probó
`npm test` (86 tests, 9 nuevos del resolver), `tsc --noEmit` limpio, migración aplicada limpia contra
una BD temporal vacía (7 migraciones), seed ejecutado contra la BD de dev y filas comprobadas, `curl`
200 en home/investigacion/formacion con hrefs correctos bajo `/biblioteca`. **No** probado en
navegador: scroll suave de anclas, dropdown con teclado, aspecto visual.

### Qué quedó pendiente
- `ancla`/`enlace_key` son enums de Postgres: añadir valores nuevos exige migración `ALTER TYPE ... ADD VALUE`.
- Accesibilidad pendiente del desplegable (`aria-expanded`, cierre con Escape, táctil: un item con
  enlace y desplegable navega al tocar y no abre el menú).
- Si producción tiene `to`/`url` http en filas existentes, se resuelven como externos por criterio, no por migración.
- El seed añade el desplegable "Apoyo a la investigación" (ancla) a investigación como ejemplo; decidir si se queda.
- Anclas útiles aún sin `id` en el DOM (p. ej. Formación · Guías y tutoriales).

---

## 2026-10-05 — Catálogo cerrado de keys para enlaces externos (rama `feat/enlaces-externos`)

A petición del usuario: completar `layout.enlaces_externos[]` (infraestructura creada el
2026-09-29) con todas las keys previsibles del sitio, para que salgan como opciones en el select
del admin en vez de tener que escribirlas a mano.

### Qué se hizo
- `lib/links.ts`: `ENLACES_EXTERNOS_KEYS` con `opac`, `dspace`, `campus` y las 5 redes sociales
  que ya tenía el proyecto en algún sitio (`facebook`/`twitter`/`instagram`/`linkedin`/`youtube`,
  del `iconsSocialMedia` de `collections/Icons.ts`) + `tiktok` como añadido razonable para una
  universidad hoy.
- `globals/Layout.ts`: el campo `key` pasa de `text` a `select` con esas opciones.
- Cableados `investigacion/page.tsx` (link de `dspace`) y `FooterSimple.tsx` (las 5 redes
  sociales, componente pasado a `async` para poder leer el global `layout`) — este último sigue
  sin usarse en ninguna página, se cableó porque era el único sitio con URLs de redes sociales
  realmente hardcodeadas en código (las del `Footer` real vienen de la collection `footer`, no de
  este registro).
- **Decisión explícita de no tocar `recursos/catalogo/page.tsx`**: el único rastro de un enlace a
  OPAC ahí es una línea comentada muerta, sin ningún botón real que la use — forzar un refactor
  (habría que partir la página en server+client component solo para esto) no estaba justificado
  por el alcance pedido.
- **Hallazgo real durante la migración**: la BD de dev ya tenía una fila en
  `layout_enlaces_externos` con `key='catalogo'` (tecleada a mano desde el admin, apuntando a
  `https://demo.baratz.es/opac`, antes de que este campo tuviera lista cerrada). La migración que
  cambia `key` a enum remapea ese valor a `opac` antes del cast (mismo patrón que la migración de
  `colectivo` del 2026-09-29) — sin este remapeo, el cast habría reventado contra esa fila. Dato
  real conservado, no se perdió nada.

### Cómo se probó
- `npx payload migrate:create` + aplicada contra un Postgres nuevo (contenedor Docker temporal,
  destruido al terminar) — las 6 migraciones en orden, limpias.
- Contra la BD de dev real: intentar `npm run migrate` ahí falló como es esperable (está
  sincronizada por `push`, no por migraciones — el propio Payload avisa de "data loss" y, al
  confirmarlo, la migración baseline revienta porque las tablas ya existen fuera de su control;
  rollback automático, no se perdió nada). Se remapeó esa fila a mano (`catalogo`→`opac`) y se
  reinició el contenedor de dev para que el `push` aplicase el nuevo tipo de columna — confirmado
  con `\d layout_enlaces_externos` (columna ya es `enum_layout_enlaces_externos_key`) y `curl` a
  `/investigacion`, `/recursos/recursos-electronicos`, `/recursos/catalogo` (200 los tres).
- `npm test` (81 tests) y `tsc --noEmit` en verde.

### Qué quedó pendiente
- Revisar si **producción** tiene alguna otra key libre en `layout_enlaces_externos` antes de
  aplicar esta migración allí — el `ELSE` de la migración deja pasar cualquier valor que no sea
  `catalogo` tal cual, y el cast final revienta si no coincide con el enum nuevo.
- El repositorio institucional del navbar (`seeds/layout.seed.ts`) y el acceso a OPAC de
  `recursos/catalogo/page.tsx` siguen sin usar este registro (ver razones arriba).
## 2026-09-30 — Primer despliegue a producción del login de campus: batería de bugs reales

El PR #16 (`feat/login-microsoft-emails`, todo el trabajo de login de campus documentado en las
entradas de ayer) se fusionó en `main` y se desplegó a producción por primera vez. Esta entrada es
el diagnóstico en caliente de todo lo que salió mal al probarlo contra datos y servidor reales — a
diferencia de dev, aquí cada fallo tenía una causa distinta.

### Bugs de código corregidos (commits en `main`)
- **`lepass` de Absys demasiado largo** (`a89654a`): la contraseña aleatoria del alta automática
  (`randomBytes(12).toString("base64url")`, 16 caracteres) reventaba contra Absys real con
  `Data for field 'lepass' in table 'lector' too big. Max size '8'` (código 3/47) — Absys limita
  ese campo a 8 caracteres. Confirmado en logs de producción. Cambiado a
  `randomBytes(4).toString("hex")` (8 caracteres exactos). Esto bloqueaba el alta de **cualquier**
  usuario nuevo del campus sin ficha previa en Absys.
- **`NEXT_CAMPUS_URI` no llegaba al navegador** (`3856846`): `AuthErrorCard.tsx` y `login/page.tsx`
  son `"use client"` y leían `process.env.NEXT_CAMPUS_URI` directamente — Next.js solo inyecta en
  el bundle del cliente las env vars con prefijo `NEXT_PUBLIC_`, así que el valor salía
  `undefined`/vacío y los botones "Volver a intentarlo" e "Iniciar sesión con Microsoft" no
  llevaban a ningún sitio (aunque ya eran `<a>` normales, no `<Link>` — se descartó esa hipótesis).
  Renombrada a `NEXT_PUBLIC_CAMPUS_URI` en ambos ficheros y documentada en `env.local.Example`.
- **Endpoint de prueba de desencriptado, token con `/` en la ruta** (`4db3f55`): pegar el token en
  crudo como segmento de ruta (`/login/password/:id`) rompía si el token traía un `/` sin escapar
  (se interpreta como separador de carpetas → "Route not found"). Se añadió soporte para mandar el
  token por query string (`?token=`) en `handleDecryptTest`, y una ruta nueva sin `:id` en la
  collection — la query no tiene ese problema con `/`, y el `+`→espacio ya lo corregía
  `decryptCampusToken` desde antes. Solo afecta a esta herramienta de prueba (desactivada en
  producción), no al flujo real.

### No eran bugs de código (aunque parecían serlo)
- **Migración sin aplicar**: al desplegar, `relation "layout_enlaces_externos" does not exist`
  tiraba **toda** la web (el layout raíz hace `findGlobal('layout')` en cada request). No es un bug
  — el `Dockerfile` (`CMD ["npm","run","start"]`) nunca ejecuta `payload migrate` solo; hay que
  correrlo a mano en el servidor tras cada deploy que toque schema (recordatorio de la sección
  "Push vs Migraciones" de `CLAUDE.md`, que ya avisaba de esto).
- **Tokens caducados repetidamente durante las pruebas**: varios "errores" fueron simplemente el
  mismo token de prueba reusado minutos (o días) después de generarse, rechazado por
  `verifyCampusToken` (`NEXT_CAMPUS_TOKEN_MAX_AGE=300`, 5 min). El 303 de la respuesta tampoco es
  el error en sí — es el status normal de `redirectResponse` tanto en éxito como en fallo; lo que
  importa es a dónde redirige.
- **Divergencia de historial entre `main` local y `origin/main`**: tras fusionarse el PR #16 en
  GitHub, se siguió commiteando directamente sobre `main` local sin hacer `pull` antes — mismo
  contenido, pero grafos distintos (`ahead 3, behind 1`). Se resolvió con un merge normal
  (`abc815d`, sin conflictos, contenido idéntico) en vez de forzar nada.

### Pendiente / sin tocar
- `SMTP_HOST=smtp.office.com` en `.env.prod` no resuelve (`ENOTFOUND`) — el host correcto de
  Microsoft 365 es `smtp.office365.com`. Es una variable de entorno, no código; falta corregirla.
- El typo `hostname: ' aplicaciones.unam.es'` (espacio al principio) en el `remotePatterns` de
  `next.config.ts` que el usuario añadió como WIP — no se tocó por ser WIP de otro archivo, pero no
  va a matchear nunca así.
- El usuario pegó en el chat, en texto plano, `NEXT_CAMPUS_SECRET_KEY` real de producción — no se
  guardó en ningún fichero ni memoria, pero queda en el historial de esta conversación. Valorar
  rotarla con el campus/Daniel si en algún momento importa.
- Al cierre de esta sesión, `main` local iba un commit por delante de `origin/main` sin subir
  (`4db3f55`), y el servidor de producción seguía en `3ac4690` (anterior a los 3 fixes de código
  de esta entrada) — el usuario iba a encargarse de subir/etiquetar y desplegar por su cuenta.

### Cómo se confirmó
Cada fix se verificó con `npm test` (81 tests) y `tsc --noEmit` en verde tras cada commit. Los
tokens del campus se descifraron en caliente con la clave real de producción (`decryptCampusToken`/
`verifyCampusToken` corridos directamente con `tsx`) para confirmar edad y contenido antes de
descartar cada hipótesis. El usuario confirmó al final de la sesión que el flujo ya funciona en
producción.

---

## 2026-09-29 — WIP: enlaces temporales del Header/login para probar Mi cuenta/Reservas/Préstamos

Cambios sin terminar, comiteados tal cual a petición del usuario (commit `wip(auth): apuntar
Header y requireSession a rutas locales para pruebas`) para poder pinchar `/perfil`, `/reservas` y
`/prestamos` sin depender de la redirección real del campus, que aún no está confirmada con
Daniel.

- `components/layout/Header.tsx`: "Mi Cuenta" apunta a `/biblioteca/login` (login antiguo, no al
  flujo de campus) en vez de `/auth/login`; se comentó la línea original en vez de borrarla.
  Añadidos accesos directos a "Reservas" y "Préstamos" en el dropdown de cuenta (rutas `/reservas`
  y `/prestamos`, aún sin verificar que existan como páginas).
- `lib/auth/session.ts`: `requireSession` redirige a `/login` en vez de `/auth/login` (línea
  original también comentada, no borrada).
- `app/(auth)/login/page.tsx`: el enlace de "acceso desde el campus" apunta a
  `/biblioteca/auth/simular-campus?next=%2F` (la ruta de simulación, solo dev) en vez del dominio
  real `https://campus.atlanticomedio.es`.

**No se ha verificado que esto sea el flujo final** — son atajos para pruebas locales, coherente
con el patrón de trabajo del usuario de dejar código comentado/temporal en vez de limpiarlo hasta
que el flujo esté decidido. Pendiente: revertir a los enlaces reales (`/auth/login`, dominio del
campus) cuando el flujo de campus esté confirmado, y confirmar si `/reservas`/`/prestamos` son las
rutas correctas del área de cuenta.

---

## 2026-09-29 — Diagnóstico del enlace de prueba del campus + registro de enlaces externos

### Diagnóstico (sin cambios de código): el enlace de prueba del jefe del usuario no funcionaría
El usuario compartió un enlace real de producción que le pasó su jefe:
`https://www.atlanticomedio.es/biblioteca/perfil?valor=rRV6n82Wb5sh`. Se analizó contra lo
construido en `feat/login-campus` y **no funcionaría**, por dos motivos independientes:

1. Apunta directo a `/perfil`, no a `/auth/campus` (el único sitio que descifra el token y abre
   sesión). `/perfil` no lee ningún query param, solo mira si ya hay cookie de sesión — el `valor`
   se perdería sin más.
2. Aunque apuntara al sitio correcto, `valor=rRV6n82Wb5sh` decodifica en base64 a **9 bytes**
   (verificado con Node: `Buffer.from('rRV6n82Wb5sh','base64').length === 9`). Nuestro esquema
   (`lib/integrations/campus/token.ts`) necesita mínimo 32 bytes (`IV de 16 + AES-128-CBC(...)`).
   `decryptCampusToken` lo rechazaría de inmediato (`decoded.length <= 16` → `null`).

Conclusión: el sistema real del campus (o al menos el código de este jefe) usa un mecanismo
distinto al que se construyó con Daniel para ADR-0005 — probablemente un ticket/id opaco a validar
de otra forma, no un token autocontenido cifrado. **No se implementó nada nuevo** para no adivinar
un esquema de seguridad sin confirmar; se le pidió al usuario que confirme con su jefe/Daniel qué
es `valor` exactamente y si `/perfil` es de verdad el destino previsto.

### Registro de enlaces externos (nuevo, no relacionado con lo anterior)
A petición del usuario, para tener un sitio editable desde Payload donde guardar enlaces externos
usables en toda la app sin tocar código. Se le preguntó el alcance explícitamente porque era
ambiguo si debía incluir las URLs de login del campus (sensible, hoy en variables de entorno) —
eligió que **no**, solo enlaces externos generales no relacionados con auth.

- **`globals/Layout.ts`**: nuevo array `enlaces_externos[]` (`key`/`label`/`url`), mismo patrón que
  `formation.enlaces_rapidos[]` (array inline en un global, sin collection nueva).
- **`lib/links.ts`** (nuevo): `resolveEnlaceExterno(enlaces, key, fallback)`, función pura sin I/O
  que busca por `key` y cae al `fallback` si no hay entrada o la `url` está vacía — mismo patrón de
  "valor de Payload con fallback hardcodeado" que ya usan investigación/formación/horarios.
- **No se migró ningún enlace hardcodeado existente** (el repositorio institucional en
  `investigacion/page.tsx`, las redes de `FooterSimple.tsx`...) — solo se construyó la
  infraestructura, tal y como se pidió. Migrar cada uno queda para cuando se retoque esa página.
- Nueva migración `migrations/20260929_110457_layout_enlaces_externos.ts` (`CREATE TABLE`, sin dato
  que remapear — mucho más simple que la de `colectivo` de la entrada de arriba).

Probado: `npm test` (81 tests, 4 nuevos para `resolveEnlaceExterno`), `tsc --noEmit` y `eslint`
limpios; migración verificada contra Postgres nuevo (5 migraciones en orden, limpias) y aplicada a
la BD real de dev; **smoke test end-to-end real** contra la BD de dev — se escribió un enlace de
prueba vía `payload.updateGlobal`, se leyó de vuelta con `payload.findGlobal`, y se limpió después
(no quedó nada de prueba en la BD); `curl` confirma que la home y `/perfil` siguen sirviendo bien
tras el cambio de schema.

---

## 2026-09-29 — Alta automática en Absys al validar por campus (rama `feat/login-campus`)

### Contexto
A petición explícita del usuario: "con ser validado en el campus es suficiente" — se quita el paso
de alta manual (`/perfil/alta`) que pedía nombre/apellidos/dirección/colectivo por formulario.
Ahora, si el lector no existe en Absys, se crea automáticamente al validar el token del campus.

### Qué se hizo
- **`app/(auth)/auth/campus/route.ts`**: si `findLectorByExternalId` no encuentra lector, llama a
  `absys.createLector(...)` con los datos derivados del email (ver abajo) antes de abrir sesión;
  ya no hay redirección a `/perfil/alta` — siempre va a `next` directamente.
- **`lib/integrations/absys/mappers/lector.ts`**: nueva `deriveCampusIdentity(email)` — el campus
  solo manda el email, con formato institucional `nombre.apellidos@{alu|pdi}.atlanticomedio.es`
  (decisión explícita del usuario, no inventado): nombre/apellidos se parsean del local-part
  (primer punto separa nombre de apellidos, resto se capitaliza y une; `"-"` si falta alguno) y el
  colectivo del subdominio (`pdi.` → PDI, cualquier otro, incluido ninguno → ALUMN, mismo fallback
  que `resolveColectivo` ya existente). `DIRECCION_AUTO_ALTA` = `"-"` (Absys exige el campo, el
  campus no lo da, y el usuario pidió explícitamente no guardar más información que la que hay).
- **Nueva capacidad `updateLector`** en el adaptador de Absys (`client.ts`, `lector.ts`,
  `mappers/lector.ts`, `index.ts`, `mock.ts`), usando `operation=modify` sobre `lector` — a
  diferencia de `add`/`createLector`, `modify` está documentada como **probada y funcional** en
  `docs/Absys API.md` del vault. Deliberadamente solo acepta `nombre`/`apellidos`
  (`ActualizarLector`): el usuario pidió explícitamente no dejar editable ni dirección ni
  colectivo ni el resto de la ficha.
- **`/perfil`**: pasó de tabla de solo lectura a formulario editable (`components/cuenta/
  PerfilForm.tsx`, nuevo, `"use client"` con `useActionState`, mismo patrón que el `AltaLectorForm`
  eliminado) para nombre/apellidos, con `app/(frontend)/(cuenta)/perfil/actions.ts` (nuevo) como
  server action. Correo y número de lector se quedan de solo lectura. Al guardar, además de
  `absys.updateLector`, se sincroniza la copia cacheada en Payload (`linkAbsysLector`, reutilizada).
- **Eliminado**: `app/(frontend)/(cuenta)/perfil/alta/` (page + actions) y
  `components/AltaLectorForm.tsx` — ya no hace falta el alta manual. `/prestamos` ya no redirige a
  esa ruta muerta; si por cualquier motivo no hay ficha en Absys, muestra un aviso en vez de
  redirigir.

### Cómo se probó
`npm test` (77 tests, 8 nuevos: `deriveCampusIdentity`, `toModifyLectorQuery`, `updateLector`) y
`tsc --noEmit` sin errores; `eslint` limpio en todos los ficheros tocados; smoke test con `curl`
contra el contenedor de dev (`/perfil` y `/prestamos` redirigen a login sin sesión, `/auth/
simular-campus` responde 200).

### Qué quedó pendiente / sin probar
- **No se probó contra Absys real ni el alta automática (`createLector`) ni la edición
  (`updateLector`)** — a propósito, para no arriesgar una escritura real: `createLector` sigue con
  el error -400 pendiente con Baratz (mismo riesgo que ya tenía el alta manual, ahora se dispara
  solo en cada login nuevo en vez de tras confirmar un formulario); `updateLector` es la primera
  vez que este código usa `modify`, y aunque Baratz documenta la operación como funcional, la
  llamada concreta con `lenomb`/`leapel` no se ha ejercitado contra el entorno real. Cubierto solo
  por los tests con cliente mockeado.
- Si `deriveCampusIdentity` no da con el patrón esperado del email (usuarios con un dominio
  distinto a `@alu.`/`@pdi.atlanticomedio.es`, o sin punto en el local-part) cae a los fallbacks
  documentados (ALUMN, apellidos `"-"`) — no confirmado si eso cubre todos los colectivos reales
  del campus (¿hay más que ALUMN/PDI, p. ej. externos?).
- Los 2 lectores de prueba en `loginCampus_service` (`mansour@atlanticomedio.es`,
  `no.existe.prueba@atlanticomedio.es`, ver entrada del 2026-09-28) no se han vuelto a tocar; si
  `no.existe.prueba@atlanticomedio.es` de verdad no tiene ficha en Absys, la próxima vez que alguien
  inicie sesión con ese email disparará el alta automática (y por tanto el error -400) contra Absys
  real — tenerlo en cuenta antes de usarlo para probar.

### Ampliación (mismo día): rol institucional separado del colectivo de Absys
A petición del usuario: comprobar el dominio del correo en orden `@pdi` → `@alu` →
`@atlanticomedio.es` (a secas) y guardar ese rol **aparte** de lo que se manda a Absys, expuesto
después en `/perfil`. Esto además implementa parte de un pendiente que ya arrastraba el proyecto
desde el 2026-09-28: "la lobby de roles del ADR-0005 no está hecha, todos entran como lector"
(ver entrada anterior) — ahora sí hay un rol derivado, aunque solo por email, no por lo que mande
el campus (el campus sigue sin mandar el rol explícitamente).

- **`deriveCampusIdentity`** cambia su contrato: en vez de devolver `colectivo: Colectivo` (el tipo
  de 2 valores de Absys), ahora devuelve `rol: RolCampus` (`Colectivo | "PAS"`, o sea
  `"ALUMN" | "PDI" | "PAS"`), comprobando el dominio en el orden pedido — `pdi.` → PDI, si no
  `alu.` → ALUMN, si no (cualquier otra cosa, incluido el dominio institucional sin subdominio) →
  PAS. `EXT` no se deriva (no hay patrón de email para externos); sigue existiendo como opción del
  campo por si se asigna a mano.
- **Se reutilizó un campo que ya existía y no se usaba**: `loginCampus_service.colectivo`
  (`collections/LoginCampus.service.ts`) ya tenía el select con las 4 opciones (ALUMN/PDI/PAS/EXT)
  desde antes de esta sesión, pero nada lo rellenaba. No hizo falta ninguna migración — solo
  empezar a escribirlo.
- **`app/(auth)/auth/campus/route.ts`**: ahora deriva `{ nombre, apellidos, rol }` **antes** de
  llamar a `absys.createLector` (para poder pasarle `colectivo: resolveColectivo(rol)`, que mapea
  PAS a ALUMN porque Absys no lo distingue) y pasa `rol` a `createCampusSession` para que se guarde
  en Payload. Se recalcula y resincroniza en cada login, no solo en el alta — así también corrige
  el rol de lectores que ya existían antes de este cambio.
- **`lib/auth/session.ts`**: `createCampusSession` gana un tercer parámetro opcional `rol`;
  `CampusSession`/`getSession` ganan el campo `colectivo`. La condición para actualizar el
  documento de Payload en `createCampusSession` pasó de "solo si hay lector" a "si hay algo que
  guardar" (`Object.keys(datosCampus).length > 0`), porque ahora puede haber `rol` sin que haya
  `lector` cambiado.
- **`/perfil`**: nueva fila "Rol" (solo lectura, `session.colectivo` mapeado a la misma etiqueta que
  el select del admin: Estudiante/PDI/PAS/Externo).

Probado: `npm test` (77 tests, mismos que antes — se actualizaron los de `deriveCampusIdentity` al
nuevo contrato `rol` en vez de `colectivo`), `tsc --noEmit` y `eslint` limpios, smoke test con
`curl`. Igual que en la ampliación anterior, **no se ha probado el alta automática ni la edición
contra Absys real** — el riesgo del error -400 pendiente con Baratz no cambia con este añadido,
solo afecta a qué se guarda en Payload.

Pendiente: confirmar con la biblioteca si PAS/EXT son colectivos reales que puedan necesitar algo
más que "tratar como ALUMN" en Absys (préstamos, permisos) — de momento son solo una etiqueta en
Payload sin ningún efecto adicional en el resto de la app.

### Segunda ampliación (mismo día): los 5 tipos de lector reales, dados por el usuario
El usuario dio la lista real de tipos de lector de Absys, sustituyendo el ALUMN/PDI/PAS de la
ampliación anterior (que eran nombres inventados en esta sesión, sin confirmar) — esto responde al
pendiente que quedó justo arriba:

- `ADULT` — personal, `@atlanticomedio.es` a secas
- `ALUMN` — alumnado, `@alu.atlanticomedio.es` (sin cambios)
- `ANONI` — "rol más básico", fallback para cualquier dominio que no sea institucional
- `INVIT` — externos, `@unam.atlanticomedio.es` (dominio nuevo, no existía en la ampliación anterior)
- `PROFE` — profesores, `@pdi.atlanticomedio.es` (mismo dominio que antes, pero el código pasa de
  `PDI` a `PROFE`)

Cambios:
- **`Colectivo`** (antes `"ALUMN" | "PDI"`) pasa a ser directamente estos 5 valores — se eliminó el
  tipo intermedio `RolCampus` que había introducido la ampliación anterior (`Colectivo | "PAS"`):
  ya no hace falta, porque ahora Absys y el rol de Payload usan exactamente el mismo tipo. Por lo
  mismo, `resolveColectivo(rol)` ya no hace falta en `campus/route.ts` al llamar a `createLector`
  (`rol` ya es un `Colectivo` válido de por sí) — se quitó esa llamada.
- **`deriveCampusIdentity`** vuelve a cambiar de contrato (mismo día, tercera vez): ahora comprueba
  `pdi.` → PROFE, `alu.` → ALUMN, `unam.` → INVIT, dominio exactamente `atlanticomedio.es` → ADULT,
  cualquier otra cosa → ANONI.
- **`COLECTIVOS`** (perfil de préstamo para el alta) gana las 3 entradas nuevas, pero **sin
  `lecocf`/`maxPrestamos`/`diasPrestamo`** para ADULT/ANONI/INVIT — no hay dato institucional
  confirmado para esos 3, así que se manda sin `lecocf` (campo opcional en
  `AbsysAddLectorPayload`) en vez de inventar un código. `ALUMN` y `PROFE` conservan los valores
  que ya había (`ALIM`/3/15 y `PDIM`/10/30 respectivamente — `PROFE` hereda literalmente lo que
  antes tenía la entrada `PDI`).
- **`collections/LoginCampus.service.ts`**: opciones del select `colectivo` actualizadas a los 5
  códigos nuevos. **Esto sí es un cambio de schema** (el adapter de Postgres crea un enum nativo
  para cada `select`) — se generó `npx payload generate:types` +
  `npx payload migrate:create actualizar-colectivos-campus`
  (`migrations/20260929_102432_actualizar_colectivos_campus.ts`).
- **Gotcha real encontrado al generar la migración**: el diff automático de Payload hace un cast
  directo `enum viejo → enum nuevo`, y la BD de dev tenía una fila real con `colectivo = 'PAS'`
  (`mansour@atlanticomedio.es`) — ese cast habría reventado (`invalid input value for enum`) al
  aplicarse, porque `'PAS'` ya no existe en el enum nuevo. Se reescribió el `up`/`down` de la
  migración a mano para hacer `UPDATE ... CASE` (PDI→PROFE, PAS→ADULT, EXT→INVIT en el `up`; a la
  inversa en el `down`, con ANONI→ALUMN al bajar por no tener equivalente en el enum viejo) antes
  del cast. Lección para la próxima vez que se cambien las opciones de un `select` ya poblado: no
  fiarse del diff automático sin mirar si hay filas con valores que van a desaparecer.
- **Verificación de la migración**: se creó un Postgres 16 suelto (`docker run`, mismo nombre de
  red que `docker-compose.yml`) y se corrió `payload migrate` contra él — las 4 migraciones
  aplican limpias en orden y el enum final queda `{ALUMN,PROFE,ADULT,INVIT,ANONI}`. Después se
  aplicó el mismo SQL directamente (`psql`) contra la BD real del contenedor de dev, porque
  `payload_migrations` está vacía ahí (dev se sincroniza por `push`, nunca ha corrido `migrate`) y
  lanzar `payload migrate` de verdad habría intentado re-aplicar también baseline/session-2026-09-14/
  login-campus contra tablas que el `push` ya había creado. Confirmado con `SELECT` que la fila de
  `mansour@atlanticomedio.es` pasó de `PAS` a `ADULT`.
- **`/perfil`**: etiquetas actualizadas — Personal (ADULT), Estudiante (ALUMN), Básico (ANONI),
  Invitado (INVIT), Profesor (PROFE).

**⚠️ Discrepancia sin resolver, a vigilar**: los fixtures anonimizados de Absys real
(`lib/integrations/absys/__fixtures__/lector-search-duplicado.json`) tienen una ficha real con
`lecolp: "PDI"` — es decir, Absys en producción parece usar literalmente el código `"PDI"`, no
`"PROFE"`. No se ha tocado el fixture ni se ha preguntado a Baratz; se ha implementado tal cual lo
dio el usuario. **Antes de dar el alta automática por buena contra Absys real, confirmar si "PROFE"
es realmente el código que espera Absys o si el código correcto sigue siendo "PDI"** (podría ser
que la instalación real de la biblioteca use otro nombre para el mismo colectivo, o que el usuario
esté dando el nombre "de cara al usuario" y no el código interno de Absys).

Probado: `npm test` (77 tests, actualizados los que dependían de PDI/PAS), `tsc --noEmit` y
`eslint` limpios (solo warnings preexistentes de argumentos sin usar en migraciones autogeneradas),
migración verificada contra BD nueva y aplicada a la BD real de dev, smoke test con `curl`. Sigue
sin probarse el alta automática contra Absys real (mismo motivo que las ampliaciones anteriores).

---

## 2026-09-28 — Login desde el campus + área "Mi cuenta" (rama `feat/login-campus`)

### Contexto
Antes de esta sesión, `refactor/absys-adapter` (PR #15) y `feat/login-microsoft-emails` (PR #12)
se mergearon a `main`. `feat/login-campus` sale de `main` tras esos merges.

### Qué se hizo
- **Login desde el campus** (sesión real de Payload, sin contraseña, vía token cifrado del campus):
  - `lib/integrations/campus/token.ts`: descifrado/cifrado del token del campus (AES-128-CBC, puerto del PHP existente).
  - `lib/auth/redirects.ts` y `lib/auth/session.ts`: helpers puros de redirección + sesión de servidor
    (`getSession`, `requireSession`, `createCampusSession`, `destroyCampusSession`).
  - Rutas nuevas: `/auth/campus` (callback del campus), `/auth/login` (entrada única), `/auth/logout`,
    `/auth/error`, `/auth/simular-campus` (solo dev, simula el campus para probar sin integración real).
  - `loginCampus_service`: pasó de endpoints copiados de `loginAbsys_service` a collection de sesión
    real; access control corregido (antes cualquier logueado leía/creaba lectores de otros — ahora
    solo uno mismo lee, solo admin crea/edita/borra); cookie `SameSite` de `Strict` a `Lax` (con
    `Strict` se rompía el flujo porque la redirección empieza en el dominio del campus).
  - Nueva migración `migrations/20260928_114829_login_campus.ts` (la collection no tenía ninguna).
  - Header: ya no lee `lenlec` de `localStorage` (inseguro, cualquiera podía escribirlo) — recibe
    `account` desde `getSession()` en el layout del server.

- **Área "Mi cuenta"**: `/profile` renombrado a `/perfil` (`/perfile` que pidió el usuario se
  interpretó como errata), nuevo route group `app/(frontend)/(cuenta)/` con layout común y pestañas
  Perfil · Préstamos · Reservas. Estilo minimalista/institucional a petición explícita (sin tarjetas
  ni animaciones).
  - `/prestamos`: nuevo `absys.findPrestamosByLector()` en el adaptador (busca en `presta` por
    `prnlec`, no `lenlec`). Muestra el código del ejemplar, no el título (pendiente, ver abajo).
  - `/reservas`: solo aviso — Absys devuelve `Access denied 'reserv'` con el rol actual de Connect.

### Cómo se probó
Contenedor de dev + Absys real (solo lecturas) para todo el flujo de sesión y las 3 páginas de Mi
cuenta; 69 tests de Vitest y `tsc --noEmit` sin errores. El envío de `/perfil/alta` (crear lector)
**no se probó** — reventaría un lector real en Absys y `createLector` sigue con el error -400
pendiente con Baratz.

### Qué quedó pendiente
- **Header sin commitear** (`components/layout/Header.tsx`, `app/(auth)/login/page.tsx`): mezcla
  trabajo en curso del usuario (botón "Mi Cuenta" apunta a `/biblioteca/login`, enlaces de Reservas/
  Préstamos añadidos al desplegable) con los ajustes de esta tarea (enlace de Perfil, errata
  "Prestámos"→"Préstamos"). Sigue así al empezar la sesión de hoy (29-09) — **son cambios en curso
  del usuario, no tocar ni "arreglar" por iniciativa propia**.
- Pedir a Baratz permiso de lectura sobre la tabla `reserv` (bloquea `/reservas`).
- Mostrar el título en `/prestamos` (requiere cruzar `prbarc` con `copias`/`cata`).
- Confirmar con Daniel: URL de login del campus y nombres de sus parámetros (`NEXT_CAMPUS_LOGIN_URL`,
  `NEXT_CAMPUS_TOKEN_PARAM`, `NEXT_CAMPUS_RETURN_PARAM` son configurables mientras tanto).
- Lobby de roles (ADR-0005) no hecha — todos entran como lector.
- Botón "Iniciar sesión con Microsoft" en `app/(auth)/login/page.tsx` sigue apuntando al campus
  directamente; podría redirigir a `/biblioteca/auth/login`.
- 2 lectores de prueba quedaron en la BD de dev (`loginCampus_service`): `mansour@atlanticomedio.es`
  y `no.existe.prueba@atlanticomedio.es`.

---

## 2026-09-15 — Horarios/ubicación/contacto completo + seeds reorganizados

### Qué se hizo
- `/conocenos/horarios-ubicacion-y-contacto` pasó de un seed mínimo (`about_us.horarios[0].images`,
  solo una imagen) a un global dedicado (`horarios_contacto`) + collection nueva (`schedule`), a
  petición explícita del usuario de no dejarlo tan simple — mismo nivel de completitud que
  investigación/formación. `about_us.horarios[]` queda sin uso tras esto (no se borró del schema).
- Bug corregido: botón "Ver FAQs" tenía `href=""` roto; ahora usa `ayuda_cta.button_link`.
- **Gotcha de dev importante**: al registrar un global/collection nuevo en `payload.config.ts`, un
  `next dev` ya en marcha en el contenedor sigue devolviendo `APIError: can't be found` porque
  `getPayload()` cachea la instancia y no la recarga con Fast Refresh — hace falta
  `docker restart biblioteca-frontend` (o reiniciar el dev server), no basta con guardar el archivo.
  Aplica a cualquier registro nuevo en `payload.config.ts`, no solo a este caso.
- `seeds/heroCarrusel.seed.ts` (nuevo): 3 items reales para el carrusel de la home (Scopus/Web of
  Science, sala de estudio en grupo, talleres de gestión bibliográfica), sustituyendo por
  `updateGlobal` el carrusel de broma que crea `home.seed.ts`. Falta el asset real de la imagen del
  taller (`Gemini_Generated_Image_pjh4c4pjh4c4pjh4.jpg`, subido a mano en producción pero no
  presente en este entorno de dev) — se usó `campus.jpg` como placeholder, confirmado con el usuario.
- `seeds/index.ts`: `npm run seed` pasó de una cadena de `&&` en `package.json` a un único punto de
  entrada (`tsx seeds/index.ts`) que lanza cada `*.seed.ts` como proceso hijo y se detiene en el
  primer fallo. Único orden real: `heroCarrusel.seed.ts` tiene que ir después de `home.seed.ts`
  (sustituye su carrusel de placeholder); el resto de seeds de contenido es independiente entre sí.

### Cómo se probó
Contra la BD real del contenedor de dev y con `curl` contra las páginas renderizadas (200 OK) tras
el restart del contenedor.

### Qué quedó pendiente
- Sustituir `campus.jpg` por el asset real de la imagen del taller cuando el usuario lo suba a
  `seeds/assets/` o lo cambie a mano en el admin de este entorno.

---

## 2026-09-14 — Recursos electrónicos, Quiénes somos, Investigación, Formación y Home (integración con Payload)

Sesión larga replicando el mismo patrón (global dedicado reutilizando collections existentes
cuando encajaban, componente Client separado para la parte animada con framer-motion) en varias
páginas que hasta entonces tenían JSX hardcodeado o datos a medias conectados.

### Qué se hizo
- **`/recursos/recursos-electronicos`**: nuevo global `electronic_resources` + nueva collection
  `electronic_resources_access` (primera vez que se creó una collection nueva en esta sesión, el
  resto reutilizó `features`/`cta` existentes). Pasó de client component 100% hardcodeado a server
  component `async`. Fuera de alcance a propósito: las pestañas "Bases de datos/Libros
  electrónicos/Multimedia" siguen hardcodeadas.
- **`/conocenos/quienes-somos`**: nuevo global `quienes_somos`, sin collection nueva — reutiliza
  `features` dos veces (`ayudas` y `dirigidos`), mismo patrón que `home.seed.ts` reutilizando `news`
  dos veces. `about_us.quienes_somos[]` queda sin uso tras esto (no se borró del schema, avisar
  antes de eliminarlo).
- **`/investigacion`**: el global `investigation` ya tenía `hero` conectado, pero el `<main>` estaba
  100% hardcodeado sin usar ni esos datos ni `Hero`/`RenderBlocks` que importaba. Se amplió con 3
  campos (`accesos_rapidos`→`features`, `tarjetas`→`electronic_resources_access`, `cta`→`cta`), se
  quitaron los imports muertos de `Hero`/`RenderBlocks` (decisión consciente de no usar el sistema
  de `layout` blocks en esta página), y se subió `maxRows` de `features.feature[]` de 4 a 6 para
  caber los 5 accesos rápidos. Se amplió `appIcons`/`iconMap` con los iconos que la página ya usaba
  (Search, Megaphone, Lock, Fingerprint, BarChart3, HeartHandshake, BookOpenCheck, Landmark).
  Interactividad añadida: chips de accesos rápidos como anchors con scroll suave, tarjetas con
  `whileInView`, botones antes muertos ahora enlazan a páginas reales.
- **`/formacion`**: mismo caso que investigación (global con `hero`/`layout` conectados pero JSX
  hardcodeado sin usarlos). Ampliado con `buscar_parrafo_1`/`_2` (texto plano, no richText — se
  evitó Lexical por no haber precedente de seed con richText y no valer la pena el riesgo para dos
  párrafos), `enlaces_rapidos[]` (array inline en el global, no collection nueva), `citar_cta`→`cta`,
  `guias_tutoriales`→`electronic_resources_access`, `actividades_texto`/`_estado`. Bugs de UX
  corregidos: enlace "Acceso a Recursos electrónicos" apuntaba a `href="#"`, botón de citación no
  tenía `href`, la tarjeta de guías no era clicable pese a tener flecha.
- **Gotcha de arquitectura (aplica a investigación y formación por igual)**: un Server Component
  `async` que hace `payload.findGlobal` **no puede usar `motion.*` de framer-motion directamente**
  — revienta con `createMotionComponent() from the server`. Solución: extraer el JSX animado a un
  Client Component nuevo (`InvestigationContent.tsx`, `FormationContent.tsx`, `"use client"`) que
  recibe los datos ya resueltos como props. Aplicar este split si se añade framer-motion a otra
  página que haga fetch de Payload directamente en el componente de página.
- **`/` (Home)**: a petición explícita, aquí no se tocó Payload — solo `HomeQuickLinks.tsx` (franja
  de accesos rápidos, contenido fijo en el componente) y `BackToTop.tsx` (botón flotante), ambos
  nuevos y `"use client"`, insertados en `app/(frontend)/page.tsx` sin modificar `Hero`/
  `HeroCarrousel`/`RenderBlocks`/`Input`/`News` (ya estaban pulidos).

### Cómo se probó
Contra la BD real del contenedor de dev y con `curl` contra las páginas renderizadas (200 OK en
todos los casos).

### Qué quedó pendiente
- Pestañas de recursos electrónicos sin conectar a Payload (fuera de alcance, decisión explícita).
- `about_us.quienes_somos[]` sin usar, no borrado del schema.

---

## ~2026-05-26/27 — `components/Input.tsx` y `components/News.tsx` (fechas aproximadas, primera aparición en git log)

- **`Input.tsx`**: reescritura completa de la barra de búsqueda con componentes shadcn/ui (`Input`
  + `Button` fusionados visualmente, icono integrado, botón clear, panel de búsqueda avanzada con
  `maxHeight` dinámico según `scrollHeight`). Bug corregido: los `name` de los campos avanzados no
  coincidían con lo que procesaba `handleInput` (ahora `titulo`, `autor`, `isbn`, `editorial`,
  `anio`, `materia`).
- **`News.tsx`**: añadido hover (`hover:scale-[1.02]`, `rounded-xl overflow-hidden`) al estilo 3 de
  tarjetas, que no lo tenía.

## 2026-10-15 — Admin de Payload más simple y con la marca de la universidad (rama `refactor/payload-admin-usuario-final`)

- Objetivo: admin más ordenado e intuitivo para usuarios no técnicos, sin quitar características ni tocar el esquema de BD (no hay migración).
- Estructura: `admin.group` + `admin.description` en español en las 39 collections/globals (Páginas, Bloques de contenido, Navegación y pie, Medios, Usuarios y accesos, Servicios internos); `useAsTitle: 'title'` donde faltaba; Home/Services/Formation/Investigation con `tabs` sin `name` (con `name` cambiaría el esquema). `loginAbsys_service` ahora `hidden`.
- Visual: logo/escudo en login y nav, paleta navy/teal en `app/(payload)/custom.scss`, Montserrat en títulos, dashboard de bienvenida (`components/admin/`). Enlaces con `success-700` por contraste AA.
- Verificado: `tsc --noEmit` limpio, `generate:importmap` ok, revisión estática del `reviewer`. **No** se ha visto en navegador.
- Pendiente: revisar en navegador claro/oscuro (`--base-body-size: 12`), `initCollapsed` en arrays largos (speakers, faq, timeline), labels sin tilde ("Titulo", "Seccion Principal"), cargar Open Sans en el admin, `migrate:create` se colgó en el entorno del agente (confirmar que no genera diff).

## 2026-10-15 — Componentes de @payloadcms/ui en el admin

- Dashboard (`DashboardWelcome`, server async con `payload.count`), `NavHelp` (afterNavLinks), `PageEditTips` (Description de Home), banners de ayuda en listas de media y news, `ItemRowLabel` (RowLabel con `useRowLabel` en speakers.people, faq.faqs, timeline.calendar, news.newsItems). Estilos `unam-*` en `custom.scss`.
- Verificado: `tsc` limpio, importMap regenerado, rutas del admin responden 200 sin sesión.
- Pendiente: probar autenticado; confirmar que ningún enlace duplica `/biblioteca` (Card `href` y `Button el="link"` llevan el prefijo a mano y Payload podría añadirlo otra vez); extender `PageEditTips`/banners a más páginas si gustan.

## 2026-10-15 — Tabs en más globals

- `horarios_contacto` (Cabecera / Edificio y horario / Contacto y dirección / Mapa / Ayuda), `layout` (Cabecera y pie / Enlaces externos) y `quienes_somos` (Cabecera / Ayudas / Dirigidos), con tabs sin `name`: sin cambio de esquema, comprobado que la lista de `name:` por fichero coincide con HEAD.
- Pendiente: `about_us` y `electronic_resources` sin tabs (el segundo solo tiene 2 campos); ver en navegador autenticado.

## 2026-10-15 — Conócenos unificado en `about_us` con 3 pestañas

- Las 3 páginas de `/conocenos/*` leen de `about_us` (pestañas con `name`: `quienes_somos`, `horarios`, `normativa`); se borraron los `*_FALLBACK`, textos fijos y código muerto. Decisiones del usuario: sin fallbacks, PDF permitido en `media`, globals antiguos en dos fases.
- Migración `20261015_163900_conocenos_tabs` escrita a mano (`migrate:create` es interactivo y se cuelga); probada en BD nueva con `NODE_ENV=production` y filas de prueba. Con datos reales de producción NO probada: hacer backup antes.
- No existe página índice `/conocenos`.
- Pendiente: sembrar dev (`npx tsx seeds/aboutUs.seed.ts`, crea media duplicados), ver las 3 páginas con datos, subir el PDF de normativa, apuntar `seeds/horarios.seed.ts` y `seeds/quienesSomos.seed.ts` a `about_us` o retirarlos, fase 2 (DROP de `quienes_somos`/`horarios_contacto`).

## 2026-10-15 — Conócenos en bloques

- Cada pestaña de `about_us` = `hero` + `layout` de bloques (`blocks/conocenos/*`, 9 bloques iguales en las tres) para poder mezclarlos y reordenarlos. Render con `components/conocenos/ConocenosBlocks.tsx`.
- Migración nueva `20261015_163937_about_us_blocks` (no edita la anterior): copia datos a bloques; probada en BD temporal con filas de prueba. `down` lossy.
- Decisiones del frontend a revisar: "Cómo llegar" toma la URL del primer `map_block`; el título de tarjetas/horario cae al `title` del objeto relacionado si el bloque no tiene; botones pasan de `<a><button>` a `<a>`, hover `scale-[1.02]`.
- Pendiente: aplicar migración en dev y ver con datos; reutilizar los bloques en otros globals; fase 2 (DROP globals antiguos); fecha de PDF sin subir.

## 2026-10-15 — Collection `pages` + catch-all + live preview

- Decisión: contenido propio de una página = bloque en línea; compartido = collection referenciada; ajustes = global. Conócenos pasa de `about_us` a 3 documentos de `pages` (`conocenos/*`), `about_us` queda oculto.
- Migración `20261015_170639_pages_collection` (esquema por `migrate:create` con ENTER por pty + copia por Local API); ciclo migrate/down/migrate probado en BD temporal. Producción: asumido que las migraciones de Conócenos NO están aplicadas allí; la migración es idempotente.
- Live preview elegido por el usuario (`@payloadcms/live-preview-react` 3.86.0 exacta). Slug de las 3 páginas de Conócenos solo lectura.
- Verificado: `npm test` 280/280, `tsc` limpio. NO verificado: preview/live preview en navegador, renderizado de las páginas con datos, bloqueo de slug en UI.
- Gotcha: el volumen `node_modules` del contenedor no tiene el paquete nuevo (`/biblioteca/conocenos/*` da 500 con "Module not found"): `docker exec biblioteca-frontend npm install` + `payload migrate` + `docker restart biblioteca-frontend`.
- `.next/types/validator.ts` arrastra tipos de las carpetas borradas hasta el siguiente `next dev`.

## 2026-10-15 — Arreglos de revisión de `pages`

- Slug: en borrador/autosave solo se normaliza (vacío → `undefined`); formato y reservados se validan al publicar. `LOCKED_SLUGS` ahora impide borrar y despublicar (`beforeDelete`/`beforeChange`).
- Catch-all: `depth: 3`, `robots: noindex` en borrador, `<h1>` con `page.title` si el hero no existe.
- **Sin verificar contra Payload real**: que "Unpublish" llegue con `_status: 'draft'` sin `?draft=true` y se distinga de un guardado de borrador/autosave (suposición del agente backend). Probar en el admin antes de fiarse.
- Anotado, sin arreglar: la migración usa la Local API y depende del esquema vigente (puede fallar si se añaden columnas a `pages` y se corre en BD limpia); su `down` borra las ediciones hechas en `pages`; la cookie de draftMode persiste hasta `/auth/preview/exit`.

## 2026-10-15 — Plugin de importar/exportar

- Registrado `importExportPlugin` en 10 collections de contenido, exports/imports `adminOnly` (el default del plugin dejaba crear/leer a cualquier lector), síncrono (`disableJobsQueue: true`). Migración `20261015_172126_importar_exportar` (17 migraciones aplican limpias en BD nueva con `NODE_ENV=production`).
- Error "Module not found: @payloadcms/live-preview-react": el volumen `node_modules` del contenedor no tenía el paquete; `docker exec biblioteca-frontend npm install` + `docker restart biblioteca-frontend`. Con cada dependencia nueva hay que repetirlo.
- No verificado en UI: exportar/importar de extremo a extremo, `media`, grupo y labels en el admin.

## 2026-10-15 — Borrador solo en vista previa

- La cookie de draftMode persistía en el navegador del admin y la web pública mostraba el borrador y el banner. Ahora `isDraft` = draftMode activo Y (`sec-fetch-dest: iframe` o `?preview=1`); `/auth/preview` redirige a `/<slug>?preview=1`; el banner se oculta dentro del iframe.
- El error "The following field is invalid: _status" al despublicar es el bloqueo intencionado de `LOCKED_SLUGS` (Conócenos): el mensaje real ("no se puede despublicar") no se ve bien en el toast. Pendiente decidir si se mejora o se desbloquea.
- No verificado en navegador (cookie + iframe + `?preview=1`).

## 2026-10-19 — Enlaces del dashboard duplicaban `/biblioteca`

- Las tarjetas del panel y el botón "Subir imagen" iban a `/biblioteca/biblioteca/admin/...` (404): `Card` y `Button el="link"` de `@payloadcms/ui` usan el `Link` de Next, que ya antepone el basePath, y yo había puesto `/biblioteca` a mano. Ahora usan rutas sin prefijo (`/admin/...`).
- Regla: con `Link`/`Card`/`Button el="link"` NO prefijar basePath; con `<a>`, `<img src>`, `Button el="anchor"` y URLs de preview sí.
- Aviso que ya estaba anotado el 2026-10-15 ("comprobar que ningún enlace duplica /biblioteca").

## 2026-10-19 — Seeds sin imágenes duplicadas

- Causa de las copias en `media` (campus.jpg x76, inicio-destacados.png x50 en el contenedor): cada seed hacía `payload.create({ collection: 'media' })` sin comprobar si existía, en cada ejecución y en cada uso (incluso 3 veces seguidas en `pages.seed.ts`).
- Arreglo: `seeds/lib/media.ts` → `findOrCreateMedia(payload, { file, alt, req? })`: busca por `filename` exacto, luego por `nombre-N.ext` (el sufijo más bajo), y si no existe crea. Usado en los 10 seeds que creaban media. Mismo fichero con distinto `alt` reutiliza el primer registro.
- NO se limpiaron los duplicados ya existentes (lo hace el usuario a mano; ojo: las copias están referenciadas desde heroes, noticias, carruseles y pages, borrar una en uso rompe la imagen). Seeds no ejecutados; verificado solo con `tsc`.

## 2026-10-19 — Bloques centralizados y miniaturas

- Los 11 wrappers del `layout` (antes duplicados en 5 globals) viven en `blocks/layout/` (`layoutBlocks`); los 9 de Conócenos en `blocks/conocenos/`. Sin cambios de esquema, `payload-types.ts` idéntico, sin migración. Único cambio visible: label de `input_block` en Repositories ("Sobre Nosotros" → "Entrada de texto", bug conocido).
- Miniaturas del selector de bloques: `blocks/images.ts` (`BLOCK_IMAGE_FILES`, vacío) + `public/admin-blocks/`. El usuario añadirá las imágenes.
- Se pierde `admin.images.thumbnail` de `cta_block` (clave inválida, nunca funcionó).
- Verificado: `tsc`, `npm test` 285/285. No verificado: servir `/biblioteca/admin-blocks/<fichero>` con servidor en marcha.

## 2026-10-19 — Seeds actualizados y repetibles

- `quienesSomos.seed.ts` y `horarios.seed.ts` retirados (`git rm`; escribían en globals obsoletos, `pages.seed.ts` ya cubría su contenido). El resto de seeds no tenía campos desfasados.
- Nuevo `seeds/lib/upsert.ts` (`upsertDoc`): find-or-update-or-create por clave natural (`title` en hero, features, cta, schedule, electronic_resources_access, news, input; `items.title` en hero_carrusel; header/footer reutilizan los enlazados por `layout`). Dos ejecuciones de `npm run seed` en una BD nueva dan los mismos conteos y las 3 páginas `conocenos/*` publicadas.
- Efecto a tener en cuenta: volver a ejecutar un seed pisa lo editado en el admin en esos documentos (`layout.enlaces_externos` no pisa keys existentes).
- Limitación conocida de `findOrCreateMedia`: si el fichero existe en `media/` pero no hay fila en BD, Payload lo guarda con sufijo `-N` y el helper no lo reencuentra (duplica). Pasa con BD nueva + `media/` de dev sin vaciar. No corregido.
- Para ejecutar seeds desde WSL: `DATABASE_URI` con `localhost:5433` (el host `bibliotecadb` no resuelve) y `PAYLOAD_SECRET` de `.env.local`.

## 2026-10-19 — Home daba 500: `iconMap` desde un módulo `'use client'`

- Error "Element type is invalid ... got: undefined" en `Stadistics` (Home) tras sembrar el contenedor: `iconMap[icon]` salía `undefined` aunque el icono (`Lightbulb`) era válido. Causa: `iconMap` vivía en `lib/utils.ts`, que lleva `'use client'` (por `useBookCover`), y los Server Components no pueden indexar un objeto exportado de un módulo cliente.
- Arreglo: `iconMap` e `iconsSocialMediaMap` movidos a `lib/icons.ts` (sin `'use client'`); `lib/utils.ts` los reexporta por compatibilidad; los 8 importadores pasan a `@/lib/icons`. Home, Conócenos, Investigación y Formación responden 200.
- Regla: nada que un Server Component deba leer como dato (mapas, constantes) debe exportarse desde un módulo `'use client'`.
- Por qué no saltó antes: Home no había renderizado estadísticas con este camino hasta que se sembró `stats_block` en dev (no verificado el historial exacto).

## 2026-10-19 — Selector visual de tipos (VisualSelectField)

- El editor elige variantes con tarjetas + vista previa en vez de "0/1/2": `news.style`, `footer.type`, `pages.hero_variant`, `CardsFeaturesBlock.style`, `ImageTextBlock.image_position`, `schedule[].type`. Sin cambios de esquema.
- `header.type` sin cubrir: el componente `Header` ignora `type` (variantes no implementadas). Pendiente decidir implementarlas o quitar el campo. `footer.type = 2` no pinta nada.
- Verificado: `tsc`, `npm test` 285/285, rutas del admin 200 sin sesión. NO verificado: render real en el admin (revisar con sesión: miniaturas, vista previa, que elegir marque el formulario como modificado y Guardar persista, `day`/`hours` en Schedule, tema oscuro).

## 2026-10-19 — Quitar `header.type` y footer tipo 2; vista previa plegable

- `header.type` (el Header no lo usaba) y la opción "Simple" (`2`) de `footer.type` (no pintaba nada) eliminados por decisión del usuario. Migración `20261019_143507_quitar_tipo_header_footer_simple` (UPDATE de `2` a `0` antes de recrear el enum; probada en BD temporal con filas de prueba). `down` lossy y sin probar.
- Vista previa del selector visual: botón "Ver/Ocultar vista previa", oculta por defecto, preferencia en `localStorage` (`unam-admin-vs-preview`).
- Aviso: `migrate:create` se ejecutó contra la BD de dev con `push` activo; su `header` seguramente ya perdió `type` y su `footer` ya tiene el enum nuevo. Si algún footer de dev estaba en `2`, `push` pudo fallar o dejarlo sin remapear: revisar.
- Verificado: `tsc`, `npm test` 285/285, `/admin/collections/news/create` 200. NO verificado en navegador: botón de vista previa, tema claro/oscuro, persistencia al recargar.

## 2026-10-19 – fix cn() desde el servidor
- `lib/utils.ts` tenía `'use client'` por el hook `useBookCover`; `Card` en Server Components (`features_block` en Home) reventaba. Hook movido a `lib/useBookCover.ts`, `utils` sin directiva y reexporta. Home responde 200, `tsc` limpio.

## 2026-10-26 — Limpieza: /contacto, /libros, lectores del campus y CLAUDE.md

- `/contacto` eliminada (page, actions, `ContactoForm`, `ContactoLoginCard`) y redirigida con 308 a `/conocenos/horarios-ubicacion-y-contacto` desde `next.config.ts`; enlaces internos actualizados (catálogo, reservas, préstamos, `InvestigationContent`, `pages.seed`). `lib/contacto*.ts`, `lib/security/*` y `sendContactEmail` quedan como código sin usar (con sus tests) porque la solicitud de compra no los usa.
- `/libros` devuelve 404 en producción (`layout.tsx` + `lib/libros-visibility.ts`, con test); en dev sigue.
- `loginCampus_service`: fuera `dni`, `numeroCarnet`, `maxPrestamos`, `diasPrestamo`; dentro `fechaRegistro` y `ultimaSesion` (solo lectura). Migración `20261026_100000_lectores_campus` aplicada en dev.
- CLAUDE.md corregido por discrepancia con el código: `EXTERNAL_ID_FIELD` es `lemail`, recuento de collections (27 + 2 del plugin), `footer` y `pages` añadidas a las tablas. Nginx fuera: producción usa Apache como proxy inverso; `docker-compose.prod.yml` publica 8085 solo en `127.0.0.1`. Pendiente por confirmar: si hay otro proxy delante de Apache (`TRUSTED_IP_HOP`=2) y el valor real del `.env` de producción.

## 2026-10-27 – importar/exportar lectores del campus y bug de la cola
- Añadido `loginCampus_service` al plugin (export + import). Descubierto que `disableJobsQueue` nunca estuvo en el código (CLAUDE.md lo daba por hecho): exportar/importar no generaban fichero. Corregido por collection con `export/import: { disableJobsQueue: true }`.
- Hook `beforeValidate` en `loginCampus_service` genera contraseña aleatoria al crear sin ella (necesario para importar lectores nuevos). Verificado por Local API en dev (export CSV sin valores sensibles, update y alta). Sin verificar desde la UI del panel.

## 2026-10-27 – Montserrat en toda la web
- `lib/fonts.ts` (`next/font/local`, fuente variable) aplicada en `<html>` de los layouts frontend y auth; `--font-sans` y `--font-display` apuntan a ella. Eliminados los `@font-face` rotos de `styles.css` (apuntaban a `/fonts/Monserrat/*.woff2`, que no existen: Montserrat nunca se cargaba) y el `font-family` fijo de `body` con Open Sans. Comprobado: los .ttf se sirven con 200 y el HTML lleva la variable. Sin verificar visualmente.
