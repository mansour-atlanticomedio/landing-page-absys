# === ETAPA 1: CONSTRUCCIÓN ===
FROM node:24-alpine AS builder
WORKDIR /app

# Instalar dependencias esenciales para compilar ciertos paquetes de Node
RUN apk add --no-cache libc6-compat

COPY package*.json tsconfig.json ./
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Desactivar telemetría de Next.js en la compilación y asignar el secreto
ENV NEXT_TELEMETRY_DISABLED=1
ENV PAYLOAD_SECRET=9fc076e667cb808e40733d2b

RUN npm run build

# === ETAPA 2: PRODUCCIÓN ===
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiamos los archivos de configuración base de la raíz
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/payload.config.ts ./
COPY --from=builder /app/next.config.ts ./

# Copiamos los directorios del compilado y código fuente necesario
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/collections ./collections
COPY --from=builder /app/globals ./globals
COPY --from=builder /app/migrations ./migrations

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ejecuta las migraciones y arranca la aplicación si la base de datos responde
CMD ["sh", "-c", "npx payload migrate && npm run start"]