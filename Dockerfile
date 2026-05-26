FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ENV PAYLOAD_SECRET=un_secret_temporal_para_el_build
# ENV DATABASE_URL=postgresql://mock:mock@localhost:5432/mock

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
