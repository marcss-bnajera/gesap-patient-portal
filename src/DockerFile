FROM node:20-alpine

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npx prisma migrate deploy || true

EXPOSE 3002

CMD ["node", "dist/main"]