import { BookInterface, TagProps } from "@/types/absys.type";

export const transformMarcToBook = (datafields: TagProps[]): BookInterface => {
  const book: BookInterface = {
    isbn: '',
    author: '',
    title: '',
  };

  datafields.forEach((field) => {
    // 1. Normalizamos el tag a string con ceros a la izquierda (ej: 100 -> "100", 20 -> "020")
    const tagStr = String(field.tag).padStart(3, '0');

    // 2. Normalizamos subfield para que SIEMPRE sea un Array, evitando el fallo de Baratz
    if (!field.subfield) return;
    const subfields = Array.isArray(field.subfield) ? field.subfield : [field.subfield];

    // 3. Mapeo de etiquetas MARC21
    switch (tagStr) {
      case '020': // ISBN
        const isbnSub = subfields.find(s => s.code === 'a');
        if (isbnSub) book.isbn = String(isbnSub.content).trim();
        break;

      case '100': // Autor Principal
        const autorSub = subfields.find(s => s.code === 'a');
        if (autorSub) book.author = String(autorSub.content).replace(/,\s*$/, '').trim().replace(".", ""); // Limpia comas finales
        break;

      case '245': // Título y Subtítulo
        const tituloSub = subfields.find(s => s.code === 'a');
        const subtituloSub = subfields.find(s => s.code === 'b');
        
        if (tituloSub) {
          book.title = String(tituloSub.content).trim();
        }
        if (subtituloSub) {
          // Limpiamos los caracteres de puntuación raros que mete MARC21 al inicio (como los dos puntos ":")
          book.description = String(subtituloSub.content)
            .replace(/^[:\s\/]+/, '') 
            .replace(/[\s\/]+$/, '')
            .trim();
        }
        break;
        
      default:
        // Puedes añadir más casos si necesitas más campos (como el año en la 260)
        break;
    }
  });

  return book;
};