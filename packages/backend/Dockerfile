FROM node:24.13.0-alpine3.23 AS build

ENV CI=true

WORKDIR /app/

COPY ./pnpm-lock.yaml \
    ./pnpm-workspace.yaml ./

COPY ./packages/backend/package.json ./packages/backend/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm install --frozen-lock

COPY ./packages/backend/src/ ./packages/backend/src/
COPY ./packages/backend/prisma/ ./packages/backend/prisma/
COPY ./packages/backend/tsconfig.build.json \
    ./packages/backend/tsconfig.json \
    ./packages/backend/nest-cli.json ./packages/backend/

WORKDIR /app/packages/backend/

RUN pnpm prisma:generate

RUN pnpm build

RUN rm -rf src tsconfig.json tsconfig.build.json nest-cli.json

RUN pnpm deploy --filter=backend --prod --legacy /prod-app

RUN wget https://gobinaries.com/tj/node-prune --output-document - | /bin/sh && \
    node-prune /prod-app/node_modules

FROM node:24.13.0-alpine3.23 AS app

WORKDIR /app/

RUN corepack enable

COPY --from=build /prod-app .

COPY ./packages/backend/prisma.config.ts ./

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "pnpm", "start:prod" ]
