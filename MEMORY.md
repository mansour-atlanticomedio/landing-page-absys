# MEMORY.md

Recap de sesiones de trabajo, en orden cronológico inverso (más reciente arriba).

Este fichero es el **changelog de sesiones**: qué se hizo, por qué, cómo se probó y qué quedó
pendiente. El estado *actual* del sistema (schema de Payload, componentes, rutas, reglas) vive en
`CLAUDE.md` — no se duplica aquí. Ver la sección "Registro de sesiones" de `CLAUDE.md` para la
regla de cuándo añadir una entrada (obligatorio al terminar cada tarea).

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
