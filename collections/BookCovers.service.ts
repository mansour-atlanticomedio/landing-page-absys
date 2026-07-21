import type { CollectionConfig } from "payload";

// Función auxiliar para convertir ISBN-13 (978...) a ISBN-10 de forma matemática
function convertIsbn13To10(isbn: string): string | null {
    const clean = isbn.replace(/[- ]/g, '').trim();
    
    // Si ya tiene 10 dígitos, lo devolvemos tal cual
    if (clean.length === 10) return clean;
    
    // Amazon solo procesa conversiones estándar desde el prefijo 978
    if (clean.length !== 13 || !clean.startsWith("978")) return null;

    // Tomamos los 9 dígitos centrales (eliminamos el '978' del inicio y el dígito de control final)
    const core = clean.substring(3, 12);

    // Algoritmo de cálculo de dígito de control para ISBN-10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(core[i], 10) * (10 - i);
    }

    const remainder = sum % 11;
    const checkDigit = (11 - remainder) % 11;
    const checkDigitStr = checkDigit === 10 ? "X" : checkDigit.toString();

    return core + checkDigitStr;
}

export const BookCoverService: CollectionConfig = {
    slug: 'book_cover_service',
    admin: {
        hidden: true // Lo mantenemos oculto en el panel de administración ya que es solo un servicio API
    },
    access: {
        read: () => true, // Permite que tu frontend Next.js consulte sin problemas de permisos
        create: () => true,
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text'
        },
    ],
    endpoints: [
        {
            // --- ENDPOINT 1: El motor de búsqueda escalonado ---
            path: '/cover/:isbn',
            method: 'get',
            handler: async (req) => {
                const isbnParam = req.routeParams?.isbn || '';
                // Limpiamos caracteres extraños (guiones, espacios) comunes en el ISBN
                const isbn = isbnParam.toString().replace(/[- ]/g, '').trim();

                if (!isbn) {
                    return Response.json({ error: 'El parámetro ISBN es requerido' }, { status: 400 });
                }

                // ─── PRUEBA 1: AMAZON CDN (Resolución estándar / Alta estabilidad) ───
                try {
                    const isbn10 = convertIsbn13To10(isbn);
                    
                    if (isbn10) {
                        const amazonUrl = `https://images-na.ssl-images-amazon.com/images/P/${isbn10}.01.LZZZZZZZ.jpg`;
                        const amzResponse = await fetch(amazonUrl, { method: 'GET' });

                        if (amzResponse.ok) {
                            // Verificamos el tamaño del archivo para esquivar el píxel transparente falso de Amazon
                            const contentLengthHeader = amzResponse.headers.get('content-length');
                            let size = contentLengthHeader ? parseInt(contentLengthHeader, 10) : null;

                            // Si por configuración de red no viene la cabecera, leemos el buffer para asegurar el tiro
                            if (size === null) {
                                const buffer = await amzResponse.arrayBuffer();
                                size = buffer.byteLength;
                            }

                            // Un píxel vacío pesa menos de 1000 bytes. Una portada real pesará varias decenas de KB.
                            if (size > 1000) {
                                return Response.json({
                                    url: amazonUrl,
                                    source: 'amazon',
                                    success: true
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error("BookCoverService: Falló Amazon CDN ->", error);
                }

                // ─── PRUEBA 2: GOOGLE BOOKS API ───
                try {
                    const googleResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
                    
                    if (googleResponse.ok) {
                        const data = await googleResponse.json();
                        const googleCover = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
                        
                        if (googleCover) {
                            // Saneamos la URL para evitar advertencias de contenido mixto (HTTP en lugar de HTTPS)
                            const secureCoverUrl = googleCover.replace(/^http:/, 'https:');
                            return Response.json({ 
                                url: secureCoverUrl, 
                                source: 'google_books',
                                success: true
                             });
                        }
                    }
                } catch (error) {
                    console.error("BookCoverService: Falló Google Books ->", error);
                }

                // ─── PRUEBA 3: OPEN LIBRARY (Máxima resolución '-L') ───
                try {
                    const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
                    
                    // HEAD solo descarga las cabeceras para verificar el estado 200/404 sin bajar la imagen entera
                    const olResponse = await fetch(openLibraryUrl, { method: 'HEAD' });
                    
                    if (olResponse.ok) {
                        return Response.json({ 
                            url: openLibraryUrl, 
                            source: 'openlibrary',
                            success: true 
                        });
                    }
                } catch (error) {
                    console.error("BookCoverService: Falló OpenLibrary ->", error);
                }

                // ─── PRUEBA 4: FALLBACK CONTROLADO (Sin portada) ───
                // Si ninguna alternativa tiene la portada, resolvemos un null seguro
                return Response.json({ 
                    url: null, 
                    source: 'null',
                    success: false 
                });
            }
        },
        {
            path: '/',
            method: 'get',
            handler: async (req) => {
                return Response.json({ 
                    status: "online", 
                    service: "Book Cover Fetcher Service",
                    version: "1.1.0" 
                });
            }
        }
    ]
};