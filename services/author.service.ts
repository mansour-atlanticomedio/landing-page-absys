export interface AuthorData {
    name: string;
    normalizedName: string;
    bio: string;
    image: string | null;
    wikipediaUrl: string | null;
}

interface ApiResponse {
    success: boolean;
    data?: AuthorData;
    message?: string;
}

/**
 * Llama al endpoint de tu API para obtener los datos enriquecidos del autor.
 */
export async function fetchAuthorInfo(authorName: string): Promise<AuthorData | null> {
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL

    if (!authorName || authorName.toLowerCase().includes('desconocido')) {
        return null;
    }

    try {
        // Si cambiaste el slug de la colección a 'author_service', ajusta esta URL
        const res = await fetch(`${BASE_API_URL}/author_service/${encodeURIComponent(authorName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const json: ApiResponse = await res.json();

        if (json.success && json.data) {
            return json.data;
        }

        return null;
    } catch (error) {
        console.error('Error al obtener la información del autor desde la API:', error);
        return null;
    }
}