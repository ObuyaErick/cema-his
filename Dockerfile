# Use Node.js LTS as the base image
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
# Copy package.json and yarn.lock (if it exists)
COPY package.json yarn.lock* ./
# # Install dependencies for building bcrypt
# RUN apk add --no-cache python3 make g++
# Install dependencies with yarn
RUN yarn install --frozen-lockfile
# Copy the rest of the application
COPY . .
# Generate Prisma client
RUN yarn prisma generate
# Build the Nuxt application
RUN yarn build
# Production stage
FROM node:18-alpine AS production
# Set working directory
WORKDIR /app
# Copy built app from builder stage
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/.nuxt /app/.nuxt
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/yarn.lock* /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/lib /app/lib
COPY --from=builder /app/generated /app/generated
# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
# Expose the port Nuxt.js runs on
EXPOSE 3000
# Start the application
# CMD ["node", ".output/server/index.mjs"]
# Start application from a yarn script
CMD ["yarn", "start:migrate:up"]
