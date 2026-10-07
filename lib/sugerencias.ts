export interface LibroSugerido {
  titulo: string;
  autor: string;
  editorial?: string;
  anio?: string;
  isbn?: string;
  enlace?: string;
}

export const MAX_LIBROS_SUGERIDOS = 10;

const MAX_LONGITUD = 250;

const texto = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

// Solo http(s): el enlace acaba como <a href> en el correo y no debe poder ser un `javascript:`
const esUrlHttp = (value: string): boolean => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

// El formulario es la frontera con datos del usuario: aquí se validan y se limpian antes de mandarlos por correo
export const validarLibrosSugeridos = (input: unknown): { libros: LibroSugerido[] } | { error: string } => {
  if (!Array.isArray(input) || input.length === 0) return { error: "Añade al menos un libro." };
  if (input.length > MAX_LIBROS_SUGERIDOS) return { error: `Puedes sugerir hasta ${MAX_LIBROS_SUGERIDOS} libros a la vez.` };

  const libros: LibroSugerido[] = [];
  for (const [i, raw] of input.entries()) {
    const item = (raw ?? {}) as Record<string, unknown>;
    const libro: LibroSugerido = {
      titulo: texto(item.titulo),
      autor: texto(item.autor),
      editorial: texto(item.editorial) || undefined,
      anio: texto(item.anio) || undefined,
      isbn: texto(item.isbn) || undefined,
      enlace: texto(item.enlace) || undefined,
    };

    if (!libro.titulo || !libro.autor) return { error: `El libro #${i + 1} necesita título y autor.` };
    if (Object.values(libro).some((v) => v && v.length > MAX_LONGITUD)) return { error: `Algún campo del libro #${i + 1} es demasiado largo.` };
    if (libro.enlace && !esUrlHttp(libro.enlace)) return { error: `El enlace del libro #${i + 1} no es una URL válida (http o https).` };

    libros.push(libro);
  }

  return { libros };
};
