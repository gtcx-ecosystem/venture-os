# syntax=docker/dockerfile:1
# venture-os production image — Next.js standalone (app/)
# Build from repo root:
#   docker build -f deploy/docker/Dockerfile -t gtcx-venture-os:local .

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app/package.json ./app/
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/app/node_modules ./app/node_modules
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app ./app
COPY clients ./clients
COPY prototype ./prototype
COPY docs/operations/workflows/newsletter-source-registry.json ./docs/operations/workflows/newsletter-source-registry.json
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=1
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN apk add --no-cache wget postgresql-client \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/app/public ./app/public
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./app/.next/static
COPY --from=builder /app/docs/operations/workflows/newsletter-source-registry.json ./docs/operations/workflows/newsletter-source-registry.json

WORKDIR /app/app
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
