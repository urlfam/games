FROM node:18-alpine AS builder
WORKDIR /app

# install deps (including dev deps) and build
COPY package.json package-lock.json* ./
COPY tsconfig.json next.config.js tailwind.config.js postcss.config.js ./
COPY . .
RUN npm install --silent
RUN npm run build
RUN npm prune --production

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npm", "start"]
