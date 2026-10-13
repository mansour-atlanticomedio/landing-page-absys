export const isProduction = process.env.NODE_ENV === "production";

// Herramientas solo para desarrollo (p. ej. el simulador del campus). FEATURE_DEV_TOOLS=true las fuerza en
// un entorno de pruebas con build de producción; nunca debe estar activo en producción real
export const devToolsEnabled = !isProduction || process.env.FEATURE_DEV_TOOLS === "true";
