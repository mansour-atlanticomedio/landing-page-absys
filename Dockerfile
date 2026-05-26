FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ENV PAYLOAD_SECRET=un_secret_temporal_para_el_build
# ENV DATABASE_URL=postgresql://mock:mock@localhost:5432/mock

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM base AS builder

ENV PAYLOAD_SECRET=un_secret_temporal_para_el_build
ENV DATABASE_URL=postgresql://mock:mock@localhost:5432/mock
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]