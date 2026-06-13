# syntax=docker/dockerfile:1

# Base stage with pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy workspace and package files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/errors/package.json ./packages/errors/
COPY packages/observability/package.json ./packages/observability/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/test-config/package.json ./packages/test-config/

# Install all dependencies (including dev for build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=api...

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy everything from deps (includes node_modules)
COPY --from=deps /app ./

# Copy source code
COPY turbo.json ./
COPY packages/typescript-config ./packages/typescript-config
COPY packages/database ./packages/database
COPY packages/errors ./packages/errors
COPY packages/observability ./packages/observability
COPY packages/utils ./packages/utils
COPY apps/api ./apps/api

# Build
RUN pnpm turbo build --filter=api

# Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install dumb-init and pnpm
RUN apk add --no-cache dumb-init
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 apiuser

# Copy built application
COPY --from=builder --chown=apiuser:nodejs /app/apps/api/dist ./apps/api/dist

# Install only production dependencies
COPY --from=builder /app/pnpm-lock.yaml /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/errors ./packages/errors
COPY --from=builder /app/packages/observability ./packages/observability
COPY --from=builder /app/packages/utils ./packages/utils
COPY --from=builder /app/packages/typescript-config ./packages/typescript-config
COPY --from=builder /app/packages/eslint-config/package.json ./packages/eslint-config/
COPY --from=builder /app/packages/test-config/package.json ./packages/test-config/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=api... --prod --ignore-scripts

# Create logs directory
RUN mkdir -p /app/logs/api && chown -R apiuser:nodejs /app/logs

# Set environment
ENV NODE_ENV=production
ENV LOG_LEVEL=info

# Security options
USER apiuser
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "import('http').then(h=>h.default.get('http://localhost:4000/health',r=>r.statusCode===200?process.exit(0):process.exit(1)))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
WORKDIR /app/apps/api
CMD ["node", "--import", "tsx", "dist/index.js"]
