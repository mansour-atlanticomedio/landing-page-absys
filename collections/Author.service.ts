import type { CollectionConfig, PayloadHandler } from "payload";

const WIKIPEDIA_SEARCH_API = "https://es.wikipedia.org/w/api.php";
const WIKIPEDIA_SUMMARY_API = "https://es.wikipedia.org/api/rest_v1/page/summary/";

export interface AuthorDetails {
  name: string;
  normalizedName: string;
  bio: string;
  image: string | null;
  wikipediaUrl: string;
}

const normalizeAuthorName = (rawName: string): string => {
  if (!rawName) return "";
  const clean = rawName.replace(/\s*\([^)]*\)/g, "").trim();

  if (clean.includes(",")) {
    const parts = clean.split(",").map((p) => p.trim());
    return `${parts.slice(1).join(" ")} ${parts[0]}`.trim();
  }

  return clean;
};

const fetchAuthorFromWikipedia = async (rawAuthorName: string): Promise<AuthorDetails | null> => {
  const normalizedName = normalizeAuthorName(rawAuthorName);

  if (!normalizedName || normalizedName.toLowerCase().includes("desconocido")) {
    return null;
  }

  try {
    // 1. Buscamos en Wikipedia
    const searchParams = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: `"${normalizedName}"`, // Buscamos entre comillas para forzar relevancia
      format: "json",
      origin: "*",
    });

    const searchRes = await fetch(`${WIKIPEDIA_SEARCH_API}?${searchParams.toString()}`);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const searchResults = searchData.query?.search || [];

    if (searchResults.length === 0) return null;

    // -------------------------------------------------------------------------
    // 🛡️ FILTRO DE SEGURIDAD ESTRICTO:
    // Extraemos las palabras clave del nombre (ignorando conectores como 'de', 'del', 'la')
    // -------------------------------------------------------------------------
    const ignoreWords = new Set(["de", "del", "la", "las", "los", "y", "vazquez", "vázquez"]);
    const nameKeywords = normalizedName
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !ignoreWords.has(word));

    const matchingArticle = searchResults.find((result: { title: string }) => {
      const titleLower = result.title.toLowerCase();

      // Contamos cuántas palabras del nombre del autor están presentes en el TÍTULO del artículo
      const matchedCount = nameKeywords.filter((keyword) => titleLower.includes(keyword)).length;

      // REGLA: Si el autor tiene 2 o más palabras clave (ej: "Charo" y "Sierra"), 
      // el título DEBE contener al menos 2 de ellas.
      // Esto descarta automáticamente reservas naturales, ríos o calles que coincidan con 1 sola palabra.
      if (nameKeywords.length >= 2) {
        return matchedCount >= 2;
      }

      // Si el autor solo tiene 1 palabra clave relevante, debe coincidir exactamente
      return matchedCount === nameKeywords.length;
    });

    // Si ningún artículo cumple el criterio estricto, DEVOLVEMOS NULL
    if (!matchingArticle) {
      return null;
    }

    // 2. Pedimos el resumen del artículo validado
    const summaryRes = await fetch(`${WIKIPEDIA_SUMMARY_API}${encodeURIComponent(matchingArticle.title)}`);
    if (!summaryRes.ok) return null;

    const summaryData = await summaryRes.json();

    // Filtro adicional: Si la descripción indica que no es una persona (reserva, municipio, etc.)
    const typeOrDesc = `${summaryData.type || ""} ${summaryData.description || ""}`.toLowerCase();
    if (
      typeOrDesc.includes("reserva") ||
      typeOrDesc.includes("municipio") ||
      typeOrDesc.includes("localidad") ||
      typeOrDesc.includes("especie")
    ) {
      return null;
    }

    return {
      name: rawAuthorName,
      normalizedName,
      bio: summaryData.extract,
      image: summaryData.originalimage?.source || summaryData.thumbnail?.source || null,
      wikipediaUrl: summaryData.content_urls?.desktop?.page || "",
    };
  } catch {
    return null;
  }
};

const jsonOk = (data: unknown) => Response.json({ success: true, data }, { status: 200 });
const jsonError = (message: string, status = 500) => Response.json({ success: false, message }, { status });

export const handleGetAuthorInfo: PayloadHandler = async (req) => {
  try {
    const routeParams = req.routeParams as { authorName?: string };
    const rawAuthor = routeParams?.authorName ?? (req.query?.author as string);

    if (!rawAuthor) return jsonError("Nombre del autor requerido", 400);

    const authorInfo = await fetchAuthorFromWikipedia(rawAuthor);
    
    // Si no lo encuentra con seguridad, responde data: null
    return jsonOk(authorInfo);
  } catch (error) {
    req.payload.logger.error(error);
    return jsonError("Error al procesar la solicitud del autor.");
  }
};

export const AuthorService: CollectionConfig = {
  slug: "author_service",
  admin: { hidden: true },
  access: { read: () => true },
  fields: [
    { name: "authorName", label: "Nombre del Autor", type: "text" },
  ],
  endpoints: [
    { path: "/:authorName", method: "get", handler: handleGetAuthorInfo },
    { path: "/", method: "get", handler: handleGetAuthorInfo },
  ],
};