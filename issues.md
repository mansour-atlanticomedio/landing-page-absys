# Issues propuestas para GitHub Projects

Generado a partir del roadmap del proyecto en Obsidian (`01 - Roadmap/_Roadmap.md` y cada
`F0X - *.md`), estado al 2026-09-23. Una issue por fase, en el mismo orden y con la misma
granularidad que el roadmap — si quieres partir alguna en tareas más pequeñas al crearla en
GitHub, la lista de "Tareas" de cada una ya viene desglosada para eso.

Copia cada bloque como una issue nueva (título = el `##`, cuerpo = el resto del bloque) y
añádela al Kanban del Project. Las etiquetas sugeridas son solo eso, sugerencias — ajústalas a
las que ya tengas creadas en el repo.

Este fichero no se actualiza solo: es una fotografía del roadmap de hoy. Si el roadmap cambia
en Obsidian, este listado queda desactualizado y habría que regenerarlo.

---

## [F00] Housekeeping urgente: credenciales, migraciones y push pendiente

**Labels:** `priority: alta`, `area: seguridad`, `area: housekeeping`
**Puntos:** 5 · **Estado:** 🔴 pendiente · **Dependencias:** ninguna — punto de partida del roadmap

### Objetivo
Dejar limpio lo que ya está hecho pero no confirmado (credenciales expuestas, migración sin
confirmar, commits sin pushear) para no arrastrar riesgo ni trabajo perdido antes de seguir
construyendo encima.

### Tareas
- [ ] Sacar las credenciales reales de Absys de cualquier sitio en texto plano, mover a
      variables de entorno / gestor de secretos
- [ ] Revisar el historial de git para ver si esas credenciales llegaron a subirse en algún
      commit; si sí, pedir a Baratz rotar la clave de la demo
- [ ] Confirmar si el fix de `payload_migrations` (baseline) funcionó en el segundo ordenador
- [ ] Pasar por regresión completa antes del push
- [ ] Push de los 24 commits pendientes a producción
- [ ] Añadir enlaces al repositorio (DSpace) en el `.env`
- [ ] Añadir enlaces al catálogo en el `.env`
- [ ] Poner las plantillas y los repos en ejecución públicos para que Daniel y Yeray tengan
      acceso

### Criterios de aceptación
- [ ] Las credenciales reales de Absys ya no están en texto plano en ningún sitio del proyecto
- [ ] Se sabe con certeza si el fix de migraciones funcionó en el segundo ordenador
- [ ] Los 24 commits locales están en `origin/main` sin haber roto nada en producción

### Notas
Riesgo de seguridad activo mientras las credenciales sigan expuestas — es la tarea de coste
más bajo y más urgente de todo el roadmap.

---

## [F01] Login: redirect de campus, roles y colectivo EXT

**Labels:** `priority: alta`, `area: login`, `area: seguridad`
**Puntos:** 8 · **Estado:** 🟡 en-curso · **Dependencias:** F00, F02

### Objetivo
Conectar el login de la web con la identidad del campus (Azure, vía
`campus.atlanticomedio.es`) y resolver los roles de usuario, para que el acceso funcione de
verdad y quede la base lista para préstamos, reservas y "mi cuenta". Para lectores externos sin
cuenta de campus (colectivo EXT, ver F02), sigue haciendo falta un mecanismo de contraseña
propio contra Absys.

### Tareas
- [ ] Recibir de Daniel el redirect desde el campus con el token/credenciales
- [ ] Construir la "lobby": pantalla post-login que resuelve el rol (no lo manda el campus) y
      redirige a cada usuario a su parte de la app
- [ ] Confirmar contra Absys que el lector existe (`search`) a partir del correo/usuario que
      llega del campus
- [ ] Para el colectivo EXT (sin campus): implementar la validación de contraseña vía llamada
      `circulation` (truco de "anular reserva" con `renseq` inexistente)
- [ ] Preguntar al servicio técnico de Absys qué algoritmo de cifrado usa `lepass` (relevante
      solo para el colectivo EXT)
- [ ] Diseño e implementación de roles de usuario (lector, PAS, gestor, administrador)
- [ ] Reforzar seguridad: transporte cifrado, rate limiting anti fuerza bruta, validación de
      entrada, logs de intentos fallidos
- [ ] Testing end-to-end de login/registro con los distintos roles y casos límite (campus y EXT)

### Criterios de aceptación
- [ ] El login funciona correctamente para un lector de campus (vía redirect) y para un lector
      EXT (vía Absys)
- [ ] Existen roles de usuario diferenciados (lector, PAS, gestor, administrador)
- [ ] La contraseña no se guarda, no viaja ni se procesa en claro en ningún punto evitable del
      flujo
- [ ] Hay protección contra fuerza bruta y quedan registrados los intentos fallidos

### Notas
**Importante — el alcance cambió el 2026-09-23**: se planteó inicialmente como "hashear
contraseña + roles + seguridad" comparando contra Absys directamente. Tras reunión con
Daniel/Yeray se confirmó que el login real para lectores de campus se resuelve por **redirect
SSO**, no comparando `lepass` — Absys siempre devuelve `lepass` enmascarado y su hash no es
reproducible desde fuera. Cualquier PR sobre login debe partir de este alcance, no del bug
original de comparación en claro (que sigue siendo cierto como hallazgo, pero ya no es el
camino de producción para el colectivo de campus).

---

## [F02] Colectivos PAS/EXT en el registro

**Labels:** `priority: media`, `area: registro`
**Puntos:** 3 · **Estado:** 🔴 pendiente · **Dependencias:** F01 (EXT comparte el flujo de
validación de contraseña contra Absys)

### Objetivo
Que un lector de tipo PAS (personal de administración y servicios) o externo pueda registrarse
con su colectivo real, en vez de que la app le obligue a entrar como ALUMN o PDI sin serlo.

### Tareas
- [ ] Backend: nuevos códigos de colectivo y validación
- [ ] Frontend: selector de colectivo en el formulario de registro
- [ ] Testing contra la demo de Absys

### Criterios de aceptación
- [ ] El registro admite colectivo PAS además de ALUMN/PDI
- [ ] El registro admite colectivo externo (EXT) además de ALUMN/PDI
- [ ] Los nuevos colectivos se validan correctamente contra Absys en la demo

### Notas
Ahora mismo solo están implementados ALUMN/PDI.

---

## [F03] Filtrado real del catálogo — BLOQUEADO

**Labels:** `priority: media`, `area: catalogo`, `status: bloqueado`
**Puntos:** 8 · **Estado:** ⚪ bloqueado · **Dependencias:** ninguna técnica — bloqueo de
producto

### Objetivo
Que los filtros de búsqueda del catálogo (materia, idioma, año, etc.) filtren resultados de
verdad, en vez de ser controles solo visuales.

### Tareas
- [ ] Conectar los filtros existentes (materia, idioma, año, título, autor, etc.) a los tags
      MARC reales de Absys — **en pausa, ver bloqueo**
- [ ] Implementar filtros combinados (varios criterios a la vez)
- [ ] Testing con casos reales del catálogo

### Criterios de aceptación
- [ ] Los filtros visibles en la interfaz filtran resultados reales del catálogo
- [ ] Se pueden combinar varios filtros a la vez en una misma búsqueda
- [ ] Probado con casos reales del catálogo (no solo datos de seed)

### Notas
**Bloqueada por decisión de producto, no técnica**: Absys Cloud gestiona y refina toda la
interfaz del catálogo — la integración podría pasar por incrustar esa interfaz bajo el dominio
de la UNAM en vez de construir un filtrado propio (propuesta de decisión pendiente de
confirmar). Esta issue podría quedar obsoleta y sustituida por una tarea de integración distinta
una vez se decida. No empezar el desarrollo hasta que se resuelva esa decisión.

---

## [F04] Bug: admin de Payload no renderiza en producción

**Labels:** `priority: media`, `area: infraestructura`, `type: bug`
**Puntos:** 3 · **Estado:** 🔴 pendiente · **Dependencias:** ninguna

### Objetivo
Que el panel de administración de Payload cargue en producción, para poder editar el contenido
sin depender de seeds ni de tocar código.

### Tareas
- [ ] Revisar logs del contenedor para diagnosticar el error
- [ ] Aplicar el fix según la causa raíz encontrada

### Criterios de aceptación
- [ ] El admin de Payload carga correctamente en producción tras hacer login
- [ ] Causa raíz identificada y documentada

### Notas
Error actual: "An error occurred in the Server Components render" (genérico, sin detalle
todavía).

---

## [F05] Contenido real y limpieza de campos huérfanos

**Labels:** `priority: baja`, `area: contenido`
**Puntos:** 5 · **Estado:** 🔴 pendiente · **Dependencias:** ninguna

### Objetivo
Que la web publicada muestre el contenido definitivo de la biblioteca en vez de datos de
prueba, reflejando la información real acordada con Comunicación.

### Tareas
- [ ] Volcar el contenido real del brief de Comunicación a las páginas ya migradas a Payload
- [ ] Decidir y borrar campos huérfanos (`about_us.quienes_somos`, `about_us.horarios`)
- [ ] Arreglar el typo en la ruta de fuentes (`Monserrat` → `Montserrat`)
- [ ] Revisión visual con Comunicación/Verónica

### Criterios de aceptación
- [ ] Las páginas migradas a Payload muestran el contenido real del brief de Comunicación, no
      el de los seeds
- [ ] Decisión tomada sobre los campos huérfanos (borrar o mantener)
- [ ] Comunicación/Verónica ha revisado visualmente el resultado

---

## [F06] Separar layouts de sitio y autenticación

**Labels:** `priority: baja`, `area: infraestructura`
**Puntos:** 3 · **Estado:** 🔴 pendiente · **Dependencias:** F01

### Objetivo
Que la página de login tenga su propio layout en vez del header/footer global del sitio, para
que la pantalla de acceso no arrastre navegación que no le corresponde.

### Tareas
- [ ] Crear route groups y layouts separados en Next.js
- [ ] Regresión visual de todas las páginas

### Criterios de aceptación
- [ ] Existe un route group `auth` separado del `site`
- [ ] `LoginPage` usa su propio layout, no el header/footer global
- [ ] El resto de páginas del sitio no sufren regresión visual tras el cambio

---

## [F07] Emails transaccionales (verificación, bienvenida, préstamos)

**Labels:** `priority: media`, `area: email`
**Puntos:** 5 · **Estado:** 🔴 pendiente · **Dependencias:** F01

### Objetivo
Que el lector reciba por email el PIN de verificación, la bienvenida al registrarse y avisos de
préstamos/reservas, sin depender de entrar a la web a comprobarlo.

### Tareas
- [ ] Conectar `Email.service.ts` a los triggers reales (verificación, bienvenida,
      notificaciones de préstamo)
- [ ] Testing de envío real (proveedor SMTP/API, plantillas)

### Criterios de aceptación
- [ ] El PIN de verificación se envía por email en el flujo correspondiente
- [ ] El email de bienvenida se envía al completar el registro
- [ ] Las notificaciones de reservas/préstamos (los 4 subtipos) se envían en sus disparadores
      reales
- [ ] Probado el envío real (no solo en local)

### Notas
`Email.service.ts` ya está escrito (3 tipos de correo, 4 subtipos de notificación) pero sin
commitear ni conectado a ningún flujo todavía.

---

## [F08] Integración campus (Azure) + Scopus + infraestructura — parcialmente bloqueado

**Labels:** `priority: alta`, `area: integraciones`, `status: bloqueado-parcial`
**Puntos:** 13 · **Estado:** ⚪ bloqueado (parcialmente) · **Dependencias:** F01

### Objetivo
Sincronizar identidad con el campus, dar acceso a Scopus, y adaptar la infraestructura para el
tráfico real de estudiantes, PDI, gestores y administradores (~6000 usuarios potenciales) —
dejar de tratar el proyecto como una landing page simple.

### Tareas
- [ ] Implementar el redirect de login desde el campus — diseño ya acordado con Daniel,
      pendiente de que él active la opción de redirigir a la Biblioteca
- [ ] Construir la "lobby" de resolución de roles (compartida con F01)
- [ ] Integración Scopus — **bloqueado**, pendiente de acceso/credenciales de Daniel
- [ ] API propia de portadas — **bloqueado**, pendiente de recursos/decisión de Daniel (valorar
      "Absys Covers" si se contrata el módulo Connect)
- [ ] Revisión de capacidad e infraestructura (carga concurrente, sesiones, caché de
      catálogo/Payload, límites de BD, monitorización) — **no bloqueado, se puede empezar ya**
- [ ] RGPD / política de retención de datos — **bloqueado**, pendiente de criterio legal de
      Daniel
- [ ] Módulo/servicio base de integración con otras aplicaciones, pensado para soportar el
      tráfico conjunto (campus + Scopus + Absys)
- [ ] Acceso al campus para consultar emails de lectores

### Criterios de aceptación
- [ ] Los lectores de campus entran a la Biblioteca vía redirect desde
      `campus.atlanticomedio.es`, sin comparar contraseñas contra Absys
- [ ] Scopus está integrado y accesible desde la web
- [ ] Se ha auditado la capacidad del servidor actual bajo carga concurrente
- [ ] Existe una política de retención de datos acorde a RGPD

### Notas
Este es el bloque que marca el paso de "landing page" a "aplicación completa". La auditoría de
capacidad/infraestructura es la única tarea de esta fase que **no** depende de Daniel — se puede
arrancar ya en paralelo mientras se resuelven los accesos. El servidor para DSpace ya lo dio
Daniel (por PPK) — esa tarea queda fuera de esta fase, es despliegue normal.

---

## [F09] Manuales de usuario final (no técnico)

**Labels:** `priority: baja`, `area: documentacion`
**Puntos:** 5 · **Estado:** 🔴 pendiente · **Dependencias:** ninguna — deliberadamente al final

### Objetivo
Dar al lector sin conocimientos técnicos un manual claro de cómo registrarse, buscar en el
catálogo, pedir préstamos y gestionar su cuenta.

### Tareas
- [ ] Redacción y maquetación de manuales para usuario no técnico (registro, préstamos,
      catálogo, mi cuenta)
- [ ] Revisión con un usuario real no técnico

### Criterios de aceptación
- [ ] Existe un manual de registro, préstamos, catálogo y "mi cuenta" redactado para usuario no
      técnico
- [ ] El manual ha sido revisado por una persona real no técnica

---

## [F10] Área de usuario ("Mi cuenta")

**Labels:** `priority: media`, `area: producto`
**Puntos:** 5 · **Estado:** 🔴 pendiente · **Dependencias:** F01

### Objetivo
Dar al lector ya logueado una ruta propia (p. ej. `/profile`) donde ver sus reservas, sus
préstamos y su información guardada en Absys, en vez de tener esos datos repartidos o
inaccesibles desde la web.

### Tareas
- [ ] Definir la ruta `/profile` (o equivalente) en la app
- [ ] Consultar y mostrar reservas activas del lector (Absys `search` sobre `reserv`)
- [ ] Consultar y mostrar préstamos activos del lector (Absys `search` sobre `presta`)
- [ ] Mostrar los datos del lector guardados en Absys (`search` sobre `lector`)

### Criterios de aceptación
- [ ] Un lector logueado puede ver sus reservas, préstamos y datos personales desde una única
      página
- [ ] Los datos mostrados vienen en tiempo real de Absys, no de caché desactualizada

### Notas
Nace de una tarea suelta detectada fuera del roadmap original, sin fase previa asignada.

---

## Orden de prioridad sugerido (según el propio roadmap)

1. **F00** — housekeeping urgente (coste bajo, riesgo de seguridad activo)
2. **F01** — login (base de la que dependen F02, F06, F07, F10)
3. **F08** (solo la parte no bloqueada: auditoría de infraestructura) — se puede arrancar en
   paralelo ya, no depende de Daniel
   4. Resto de fases sin bloqueo (F02, F04, F05, F06, F07, F09, F10) — pueden avanzar en paralelo
      sin competir por prioridad con las tres anteriores
      5. **F03** y el resto de **F08** — a la espera de decisiones/accesos externos (producto y
         Daniel respectivamente)
