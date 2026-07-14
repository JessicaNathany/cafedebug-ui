# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/admin-design-tokens/package.json packages/admin-design-tokens/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS dev
COPY . .
WORKDIR /app/apps/admin
EXPOSE 3000
CMD ["sh", "-c", "pnpm exec next dev --hostname 0.0.0.0 --port ${PORT:-3000}"]

FROM deps AS build
COPY . .
RUN pnpm --filter @cafedebug/admin build

FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app /app
WORKDIR /app/apps/admin
EXPOSE 3000
CMD ["sh", "-c", "pnpm exec next start --hostname 0.0.0.0 --port ${PORT:-3000}"]
