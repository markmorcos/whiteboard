FROM node:alpine AS deps
WORKDIR /app

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  libc6-compat \
  cairo-dev \
  pango-dev \
  jpeg-dev \
  giflib-dev \
  pixman-dev \
  pangomm-dev \
  libjpeg-turbo-dev

COPY package.json package-lock.json ./
RUN npm ci

FROM node:alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000
CMD ["npm", "start"]
