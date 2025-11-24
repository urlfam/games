# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/app ./app
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/components ./components
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/test-all-games.js ./test-all-games.js

# Create a dedicated, writable directory for our dynamic data
RUN mkdir -p /app/data
RUN chown node:node /app/data

# Switch to a non-root user for security
USER node

EXPOSE 3000
CMD ["npm", "start"]
