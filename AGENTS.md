<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:claude-md-sync -->
## CLAUDE.md — Fuente de verdad del proyecto

Antes de hacer CUALQUIER cosa en el código, lee `CLAUDE.md` completo. Contiene:
- Arquitectura del proyecto y sistema de diseño
- Cómo Payload CMS conecta con los componentes
- Reglas de código, git workflow y bugs conocidos

### Reglas de sincronización

1. **Al inicio de cada tarea**: relee `CLAUDE.md` para asegurarte de que tu plan es consistente con lo documentado.
2. **Cada 3-5 acciones significativas** (commits, refactorings, cambios de estructura): relee `CLAUDE.md` para verificar que lo que estás haciendo sigue alineado.
3. **Al terminar una tarea**: si el cambio afecta la arquitectura, componentes, o reglas del proyecto, actualiza `CLAUDE.md` antes de hacer el commit final. Pide confirmación al usuario antes de sobreescribir secciones grandes.
4. **Si `CLAUDE.md` dice algo contrario a lo que ibas a hacer**: para y pregunta al usuario. El documento es la referencia, no tus suposiciones.

### Qué registrar en CLAUDE.md
- Nuevas collections o globals de Payload
- Componentes nuevos y sus props
- Cambios en el flujo de datos
- Bugs encontrados y corregidos
- Decisiones arquitectónicas
- Reglas de código nuevas

NUNCA borres información existente en CLAUDE.md sin preguntar al usuario primero.
<!-- END:claude-md-sync -->

<!-- BEGIN:user-working-style -->
## Cómo trabaja mansour (perfil del desarrollador de este proyecto)

Esta sección describe cómo piensa, escribe código y actúa el desarrollador principal de este
proyecto (mansour.lolo@atlanticomedio.es), basado en el historial de git, el código existente y
las sesiones de trabajo con Claude Code. Úsala para que tu código y tus decisiones se sientan
coherentes con las suyas, no como una imitación forzada.

### Forma de razonar y tomar decisiones

- **Construye por capas, no de golpe**: primero monta la UI con datos de mentira creíbles
  (nombres de libros reales, autores reales, direcciones reales de la biblioteca), y sólo después
  conecta esa UI a Payload o a la API de Absys, página a página. El propio historial de páginas
  documentado en `CLAUDE.md` (algunas con RenderBlocks activo, otras con JSX hardcodeado, otras a
  medio migrar) es el resultado natural de este proceso, no un descuido: es una migración
  incremental deliberada. Cuando te pida "haz X como hice en Y", asume que quiere el mismo
  patrón técnico aplicado literalmente, y si el alcance es ambiguo (p. ej. cuánto contenido pasa
  a ser editable), pregúntale explícitamente antes de decidir por tu cuenta — lo prefiere a que
  asumas de más.
- **Copia el patrón más cercano que ya funciona en vez de inventar uno nuevo**: antes de crear una
  collection, un global o un componente, busca primero si ya existe algo estructuralmente
  parecido (`Features.ts` para arrays de tarjetas con icono, `hero` como relationship reutilizable
  en vez de duplicar campos, `iconMap` de `lib/utils.ts` en vez de un mapeo de iconos nuevo) y
  replícalo. La consistencia entre collections pesa más que la elegancia de una solución nueva.
- **Verifica contra el entorno real, no sólo contra el compilador**: no hay suite de tests
  (jest/vitest) en el proyecto. La forma de validar que algo funciona es sembrar datos con
  `npm run seed` / un seed específico contra el Postgres real del contenedor Docker de desarrollo
  (`biblioteca-frontend` / `biblioteca-db`) y comprobar filas en la base de datos o la página
  renderizada. Si vas a dar algo por terminado, favorece este tipo de verificación sobre
  `tsc --noEmit` a secas.
- **Pide plan y confirmación antes de cambios estructurales, pero no de todo**: cuando la tarea
  toca arquitectura (nuevas collections/globals, cambios de flujo de datos), espera que le
  propongas el plan con la lista de ficheros afectados y confirmes antes de ejecutar — y a veces
  te pedirá releer `CLAUDE.md` explícitamente "por si acaso" antes de dar luz verde, como control
  de coherencia. Para cambios pequeños y acotados no hace falta este ritual.
- **Historial de commits real**: los commits más antiguos del proyecto ("fix docker compose" x5,
  "fix ports", "fix dockerfile" x3) muestran iteración por prueba y error en temas de
  infraestructura/despliegue hasta que algo arrancaba, en vez de diagnosticar todo de antemano.
  Los commits recientes ya siguen Conventional Commits de forma disciplinada (ver reglas de git
  en `CLAUDE.md`) — el proceso se volvió más estructurado con el tiempo, así que sigue ese
  estándar más reciente como la norma vigente.

### Forma de escribir código

- **Comentarios cortos en español que explican el "por qué" o la intención de una acción concreta**,
  pegados justo encima de la línea, nunca bloques largos ni JSDoc. Ejemplos reales del código:
  `// Solo actualiza el texto, no dispara peticiones`, `// Sincronizamos la URL de manera
  silenciosa para que se pueda compartir el enlace`, `// Función encargada de hablar con la API`.
  Esto es al revés de la regla "no comentar" que rige el código que escribe Claude — esa regla es
  para ti, no describe cómo escribe él. Si estás extendiendo código suyo ya comentado así, sigue
  su convención en vez de borrar sus comentarios.
- **Tipado permisivo cuando Payload se pone en medio**: usa `as any`, `: any` y `as never` sin
  reparo en los sitios donde los tipos autogenerados de Payload (`payload-types.ts`) no encajan
  limpiamente con `findGlobal`/`updateGlobal` (ver `horarios-ubicacion-y-contacto/page.tsx`,
  todos los `seeds/*.seed.ts`). No es descuido generalizado — en el resto del código (props de
  componentes, interfaces en `types/`) sí tipa con cuidado. El `any` aparece específicamente en la
  frontera con la API de Payload.
- **`try/catch` defensivo en llamadas a Payload**, con el error volcado por `console.log`/
  `console.error` en vez de relanzarlo, típicamente
  `JSON.stringify(err.data?.errors ?? err, null, 2)`. El objetivo es poder ver qué campo falló al
  sembrar datos, no crashear el script.
- **Dev tools) `console.log`/`console.warn` de depuración se quedan en el código** (`RenderBlocks.tsx`,
  varias páginas) en vez de limpiarse tras usarlos. No los borres por iniciativa propia si no es
  parte de lo que te pidió — puede que los siga usando activamente.
- **Datos de prueba creíbles, nunca "Lorem ipsum"**: títulos de libros reales (Cien años de
  soledad, El principito, Don Quijote...), autores reales, direcciones y teléfonos reales de la
  biblioteca de la Universidad Atlántico Medio. Si necesitas rellenar contenido de ejemplo (seeds,
  placeholders), sigue este criterio de realismo del dominio.
- **`name` de campo en inglés, `label` siempre en español** en todas las collections/globals de
  Payload — convención constante, mantenla en cualquier campo nuevo.
- **Dead code convive con código activo sin limpiar** (imports sin usar, arrays de datos
  definidos pero nunca renderizados, como `resourceCategories` en `recursos-electronicos`): es
  fruto de la construcción incremental por capas, no lo elimines de oficio salvo que te lo pida o
  sea estrictamente parte del fichero que ya estás reescribiendo por otro motivo.

### Forma de comunicarse y actuar

- **Mensajes cortos, directos, en imperativo**, sin rodeos ("confirmo pero antes lee CLAUDE.md",
  "Necesito que revises..."). No espera cortesías ni resúmenes largos: prefiere que actúes y
  reportes en pocas frases qué cambió.
- **Confía en delegar el detalle de implementación** una vez que confirma un plan, pero quiere
  ver ese plan antes con la lista concreta de ficheros — no le importa el "cómo" línea a línea,
  sí el "qué" va a tocarse.
- Trabaja en un proyecto real y en producción (biblioteca universitaria), con Docker Compose para
  dev (`docker-compose.yml`, contenedores `biblioteca-frontend`/`biblioteca-db`) y prod
  (`docker-compose.prod.yml`) separados — ten en cuenta esa distinción antes de tocar
  configuración de Docker, migraciones o variables de entorno.
<!-- END:user-working-style -->
