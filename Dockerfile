# --- ETAPA DE BASE ---
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

# --- ETAPA DE DEPENDENCIAS ---
FROM base AS deps
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo devDeps para el build)
RUN npm ci

# --- ETAPA DE BUILD (Solo para Producción) ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Importante: Ten el output: 'standalone' en tu next.config.mjs
RUN npm run build

# --- ETAPA DE RUNNER (Producción Final) ---
FROM base AS runner
ENV NODE_ENV=production
# Copiamos solo lo necesario del builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]