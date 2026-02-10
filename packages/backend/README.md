# UGram Backend

The backend uses NestJS to provide the API routes with security features and
self-documented objects, thanks to OpenAPI.

## Production deployment

If you want to deploy the backend in a production environmnent, you would follow
the following steps.

### The database

The backend expects a PostgreSQL database to be available. There is one ready-to
-use inside the [`docker-compose.yml`](./docker-compose.yml) file. The database
will be exposed locally on port `5432` as per the standard, but if this port is
already buisy on your environment, you can change it.

#### Configuration

You can configure the credentials and the database name through an environment
variables file called `.env`. You can see an example of what is expected in the
[`.env.example`](./.env.example)

#### Deployment

To deploy the database, use the following command :
```bash
docker compose up -d postgres
```

Once ran successfully, your database will be up and running.

## Development deployment

The backend does not have a production deployment environment, so you will have
to deploy it locally for now.

### The backend

#### Install the required modules

```bash
pnpm install -D
```

#### Build the backend application

```bash
pnpm build
```

#### Start the backend application

```bash
pnpm start:prod
```

Once up and running, the application will be reachable on port `3000`, and the
OpenAPI documentation will be accessible on path `/openapi`.
