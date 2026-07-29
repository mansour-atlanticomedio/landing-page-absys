# === ETAPA 1: CONSTRUCCIÓN ===
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

COPY package*.json tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

# === ETAPA 2: PRODUCCIÓN ===
FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/payload.config.ts ./
COPY --from=builder /app/next.config.ts ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/collections ./collections
COPY --from=builder /app/globals ./globals
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/types ./types
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/seeds ./seeds
COPY --from=builder /app/payload-types.ts ./
COPY --from=builder /app/.next/static ./.next/standalone/.next/static
COPY --from=builder /app/public ./.next/standalone/public

ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["npm", "run", "start"]