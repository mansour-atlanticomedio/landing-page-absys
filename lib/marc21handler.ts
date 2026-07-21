import { BookInterface, TagProps } from "@/types/absys.type";

export const transformMarcToBook = (datafields: TagProps[]): BookInterface => {
  // 1. Inicializamos el objeto con valores por defecto seguros para evitar 'undefined' en la UI
  const book: BookInterface = {
    isbn: '',
    author: 'Autor desconocido',
    title: 'Título no disponible',
    year: '',
    synopsis: 'Sinopsis no disponible.',
    editorial: '',
    published: '',
    language: 'Español', // Idioma por defecto o recuperado de la 041/008
    tags: [],
    available: true,     // Valor por defecto, idealmente vendrá de otro endpoint de ejemplares
    location: 'Biblioteca Central',
    signature: 'N/A',
    authorBio: 'Biografía del autor no disponible.'
  };

  // Auxiliares para procesar campos de publicación (260/264)
  let pubPlace = '';
  let pubName = '';
  let pubDate = '';

  datafields.forEach((field) => {
    const tagStr = String(field.tag).padStart(3, '0');
    if (!field.subfield) return;

    const subfields = Array.isArray(field.subfield) ? field.subfield : [field.subfield];

    switch (tagStr) {
      case '020': // --- ISBN ---
        const isbnSub = subfields.find(s => s.code === 'a');
        if (isbnSub) {
          // Limpiamos posibles textos adjuntos que a veces vienen en el ISBN (ej: " (rúst.)")
          book.isbn = String(isbnSub.content).split(' ')[0].trim();
        }
        break;

      case '100': // --- AUTOR PRINCIPAL ---
        const autorSub = subfields.find(s => s.code === 'a');
        if (autorSub) {
          book.author = String(autorSub.content)
            .replace('.', '')    // Elimina todos los puntos
            .replace(/[()]/g, '')    // Elimina todas las '(' y ')'
            .replace(/,\s*$/, '')    // Elimina la coma final si existe
            .trim();
        }
        break;

      case '245': // --- TÍTULO Y SUBTÍTULO ---
        const tituloSub = subfields.find(s => s.code === 'a');
        const subtituloSub = subfields.find(s => s.code === 'b');

        if (tituloSub) {
          // Limpiamos barras o signos de puntuación finales típicos de MARC21
          book.title = String(tituloSub.content).replace(/[:.\s\/]+$/, '').trim();
        }
        if (subtituloSub) {
          const subClean = String(subtituloSub.content).replace(/^[:\s\/]+/, '').replace(/[:.\s\/]+$/, '').trim();
          if (subClean) {
            // Es mejor concatenar el subtítulo al título principal (ej: "El Quijote: Edición escolar")
            book.title = `${book.title}: ${subClean}`;
          }
        }
        break;

      case '260': // --- PUBLICACIÓN (Tradicional) ---
      case '264': // --- PUBLICACIÓN (Moderna / RDA) ---
        const place = subfields.find(s => s.code === 'a');
        const expr = subfields.find(s => s.code === 'b');
        const date = subfields.find(s => s.code === 'c');

        if (place) pubPlace = String(place.content).replace(/[;:\s,]+$/, '').trim();
        if (expr) pubName = String(expr.content).replace(/[;:\s,]+$/, '').trim();
        if (date) {
          pubDate = String(date.content).replace(/[.\s[\]\(\)]+/g, '').trim(); // Limpia corchetes/puntos del año
          book.year = pubDate;
        }

        // Construimos una cadena legible para el campo 'published' (Ej: "Madrid : Alfaguara, 2021")
        if (pubPlace || pubName) {
          book.editorial = pubName || 'Editorial no disponible';
          book.published = `${pubPlace}${pubPlace && pubName ? ' : ' : ''}${pubName}${pubDate ? ', ' + pubDate : ''}`;
        }
        break;

      case '520': // --- SINOPSIS / RESUMEN ---
        const resumenSub = subfields.find(s => s.code === 'a');
        if (resumenSub) {
          book.synopsis = String(resumenSub.content).trim();
        }
        break;

      // --- MATERIAS / TEMAS Y GÉNEROS (Bloque 6XX completo) ---
      case '600': // Nombre de persona como materia (ej: biografías o estudios)
      case '610': // Entidad corporativa como tema
      case '650': // Término temático (Materia principal)
      case '651': // Nombre geográfico como tema
      case '653': // Términos de indización no controlados
      case '655': // Género / Forma (ej: Novela, Diccionario, Manuales)
        // Extraemos el término principal ($a) y sus subdivisiones ($x temática, $z geográfica, $y cronológica, $v forma)
        const relevantCodes = ['a', 'x', 'z', 'y', 'v'];
        const topicParts = subfields
          .filter(s => relevantCodes.includes(s.code) && s.content)
          .map(s => String(s.content).replace(/[;:\.\s\/]+$/, '').trim())
          .filter(Boolean);

        if (topicParts.length > 0) {
          // Concatenamos las partes con " - " para formar el encabezamiento completo (ej: "Historia - España - Siglo XX")
          const cleanTag = topicParts.join(' - ');

          // Evitamos duplicados en el array de tags
          if (book.tags && !book.tags.includes(cleanTag)) {
            book.tags.push(cleanTag);
          }
        }
        break;

      case '041': // --- IDIOMA ---
        const langSub = subfields.find(s => s.code === 'a');
        if (langSub) {
          const langCode = String(langSub.content).toLowerCase().trim();
          // Mapeo rápido de códigos comunes a nombres legibles
          const langMap: Record<string, string> = { spa: 'Español', eng: 'Inglés', cat: 'Catalán', glg: 'Gallego', eus: 'Euskera', fre: 'Francés' };
          book.language = langMap[langCode] || langCode.toUpperCase();
        }
        break;

      default:
        break;
    }
  });

  return book;
};