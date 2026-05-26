# === ETAPA 1: CONSTRUCCIÓN ===
FROM node:24-alpine AS builder
WORKDIR /app

# Instalar dependencias esenciales para compilar ciertos paquetes de Node si hiciera falta
RUN apk add --no-cache libc6-compat

COPY package*.json tsconfig.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Desactivar telemetría de Next.js en la compilación
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_SECRET=9fc076e667cb808e40733d2b

RUN npm run build

# === ETAPA 2: PRODUCCIÓN ===
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiamos solo lo necesario para ejecutar la app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/payload.config.ts ./
COPY --from=builder /app/collections ./collections
COPY --from=builder /app/globals ./globals

EXPOSE 3000

# comando clave: Primero corre las migraciones hacia la DB, y si todo va bien, arranca Next.js
CMD ["sh", "-c", "npx payload migrate && npm run start"]