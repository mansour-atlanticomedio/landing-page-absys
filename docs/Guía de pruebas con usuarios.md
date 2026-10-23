# Guía de pruebas del panel de administración

Para quien prueba: no hace falta saber programar. Anota **todo lo que te confunda o falle**, aunque te parezca una tontería: "no sabía dónde pulsar" es un resultado válido.

## Cómo anotar cada problema
- Qué intentabas hacer
- Qué pasos seguiste
- Qué esperabas y qué pasó (captura de pantalla si puedes)
- Si te quedaste bloqueado o pudiste continuar

## Antes de empezar
- Usa una ventana de incógnito o un navegador distinto para el panel, porque entrar como administrador cierra la sesión de lector en el mismo navegador.
- Trabaja solo con contenido de prueba (títulos que empiecen por "PRUEBA"). No edites las tres páginas de Conócenos reales.

---

## Parte A. Tareas para usuarios reales (no técnicos)
Son tareas sin explicación previa; solo se les da el objetivo. Se observa si las completan solos y cuánto tardan.

1. **Orientarse.** Entra al panel y, sin ayuda, di para qué sirve cada grupo del menú.
2. **Crear una página** de prueba (ruta `prueba/nombre`) con: cabecera, un bloque "Imagen con texto", un bloque "Aviso" y un bloque "Descarga de documento" con un PDF.
3. **Reordenar y contraer bloques**: cambiar el orden de dos bloques y contraerlos.
4. **Elegir estilos con el selector visual**: probar las opciones de "Estilo de cabecera", del estilo de Noticias y del pie de página; mostrar y ocultar la vista previa.
5. **Vista previa en vivo**: abrirla, editar un texto y ver que cambia.
6. **Guardar borrador, publicar y comprobar en la web** que se ve (y que antes no se veía).
7. **Despublicar** la página de prueba y comprobar que desaparece.
8. **Equivocarse y recuperar**: cambiar un texto, guardar y restaurar la versión anterior desde "Versiones".
9. **Editar contenido compartido**: cambiar un horario o una tarjeta y ver en qué páginas se refleja.
10. **Subir imágenes** (JPG/PNG/WebP) con texto alternativo; intentar subir un archivo no permitido y un archivo de más de 10 MB; subir la misma imagen dos veces.
11. **Editar una noticia** de la portada y comprobar el resultado.
12. **Usar el manual**: intentar una tarea solo con el manual y anotar qué falta o está mal explicado.

Al terminar, preguntar: ¿qué fue lo más confuso? ¿qué esperabas encontrar y no estaba? ¿te atreverías a usarlo solo?

---

## Parte B. Pruebas técnicas (las 2 cuentas de prueba / quien administra)
Comprobaciones que aún no se han verificado en un navegador real.

**Páginas y rutas**
- Crear una página con ruta ya reservada (`admin`, `contacto`, `libros`...) → debe rechazarla con un mensaje claro.
- Cambiar la ruta de una página ya publicada → no debe dejar.
- Intentar despublicar o borrar una de las 3 páginas de Conócenos → debe mostrar el motivo.
- Abrir una ruta que no existe → comprobar qué se muestra (aún no hay página 404 propia).
- Dos usuarios editando la misma página a la vez → ver si avisa del bloqueo.

**Borradores y vista previa**
- Con borrador sin publicar, navegar la web pública en otra ventana: no debe verse ni aparecer el aviso de borrador.
- Tras previsualizar, salir de la vista previa y comprobar que desaparece el aviso.
- Autoguardado: escribir, cerrar la pestaña sin guardar y volver; comprobar que el borrador está.

**Importar y exportar**
- Exportar noticias a CSV y a JSON; abrirlos.
- Modificar el archivo e importarlo: comprobar que actualiza y no duplica.
- Importar una página con bloques, y un archivo con errores (columnas mal, campo vacío obligatorio).
- Comprobar que un usuario sin rol de administrador no ve estas opciones.

**Medios**
- Subir PDF, probar el botón de descarga en la web.
- Comprobar que no se pueden subir SVG ni archivos de más de 10 MB.

**Selectores visuales y bloques**
- Cada selector (noticias, pie, cabecera, tarjetas, posición de imagen, tipo de horario): elegir cada opción, guardar, recargar y ver que la web coincide con el dibujo.
- Miniaturas de "Añadir bloque": verificar que se ven (faltan las de blogs y de varios bloques de Conócenos).
- Mirar el panel en un móvil/tablet y en modo oscuro.

**Sitio público**
- Home, Servicios, Formación, Investigación, Repositorios y las 3 páginas de Conócenos: que carguen, con enlaces del menú y del pie correctos y sin enlaces rotos (en especial anclas `#noticias`).
- Rendimiento y aspecto en móvil.

**Cuentas de lector (campus)**
- Login por el campus, `/perfil`, `/contacto` (envío con límite de mensajes) y solicitud de compra; comprobar que se reciben los correos.

---

## Antes de pasar a producción (solo equipo técnico)
- Hacer copia de la base de datos y probar las migraciones sobre una copia con datos reales.
- Revisar que la BD de desarrollo y la de producción coinciden con las migraciones.
- Comprobar los permisos: un lector no debe ver nada del panel.
