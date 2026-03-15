FROM node:24.13.0-alpine3.23 AS build

ENV CI=true

WORKDIR /app/

COPY ./pnpm-lock.yaml \
    ./pnpm-workspace.yaml ./

COPY ./packages/backend/package.json ./packages/backend/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.32.1 --activate

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

FROM node:24.13.0-alpine3.23 AS app

RUN apk add curl --no-cache


RUN mkdir -p /certs && \
curl -L "https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem" --output /certs/global-bundle.pem

RUN apk add postgresql-client

WORKDIR /app/

RUN corepack enable
RUN corepack prepare pnpm@10.32.1 --activate

COPY --from=build /prod-app .

COPY ./packages/backend/prisma.config.ts ./

COPY ./packages/backend/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh" ]
