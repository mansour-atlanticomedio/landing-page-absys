export const isProduction = process.env.NODE_ENV === "production";

// Herramientas solo para desarrollo (p. ej. el simulador del campus, que firma tokens para cualquier correo).
// Sin override por variable de entorno: un flag que las active en producción sería una toma de cuenta total
export const devToolsEnabled = !isProduction;
