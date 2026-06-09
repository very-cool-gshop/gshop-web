FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV PORT=3003
EXPOSE 3003
CMD ["node", ".output/server/index.mjs"]
