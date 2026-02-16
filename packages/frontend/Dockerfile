FROM node:24-alpine AS build

ARG API_URL
ENV API_URL=${API_URL}

ENV CI=true

WORKDIR /app/

COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
COPY ./packages/backend/package.json ./packages/backend/
COPY ./packages/frontend/package.json ./packages/frontend/
COPY ./packages/frontend/.npmrc ./packages/frontend/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm install --frozen-lock

COPY ./packages/backend/src/ ./packages/backend/src/
COPY ./packages/frontend/src/ ./packages/frontend/src/
COPY ./packages/frontend/static/ ./packages/frontend/static/
COPY ./packages/frontend/components.json ./packages/frontend/
COPY ./packages/frontend/tsconfig.json ./packages/frontend/
COPY ./packages/frontend/svelte.config.js ./packages/frontend/
COPY ./packages/frontend/vite.config.ts ./packages/frontend/

WORKDIR /app/packages/frontend/

RUN pnpm build

FROM build AS app

WORKDIR /app/

RUN corepack enable

COPY --from=build /app/packages/frontend/build/ ./build/

ENV PORT=3001
EXPOSE 3001

ENTRYPOINT ["node", "build/index.js"]
