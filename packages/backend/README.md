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
variables file called `.env.prod`. You can see an example of what is expected in
the [`.env.example`](./.env.example)

#### Deployment

To deploy the database, use the following command :
```bash
docker compose up -d postgres
```

Once ran successfully, your database will be up and running.

### The backend

The backend depends on the `postgres` service. They must be on the same Docker
network. The server will be exposed locally on port `3000`, but if this port is
already buisy on your environment, you can change it.

#### Configuration

You can configure the credentials and the database name through an environment
variables file called `.env.prod`. You can see an example of what is expected in
the [`.env.example`](./.env.example)

#### Deployment

To deploy the backend, use the following command :
```bash
docker compose up -d --build backend
```

Once up and running, the application will be reachable on port `3000`, and the
OpenAPI documentation will be accessible on path `/openapi`.

## Development deployment

For development purpose, you should follow the following steps to get a backend
instance up and running.

### Install the required modules

```bash
pnpm install -D
```

### Configuration

You should then configure a `.env.dev` file based on the [`.env.example`](./.env.example) file.

### Start the backend application

```bash
pnpm start:dev
```

Once up and running, the application will be reachable on port `3000`, and the
OpenAPI documentation will be accessible on path `/openapi`.
