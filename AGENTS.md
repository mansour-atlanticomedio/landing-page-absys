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
