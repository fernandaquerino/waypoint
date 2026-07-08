# Waypoint

Monorepo pnpm com Web, API, tipos compartilhados e UI.

## Ambiente Local

Copie as variaveis de exemplo se quiser sobrescrever os valores padrao:

```sh
cp .env.example .env
```

Subir todos os servicos:

```sh
docker compose up
```

Subir apenas o Postgres:

```sh
docker compose up postgres
```

Derrubar os servicos mantendo os dados do banco:

```sh
docker compose down
```

Derrubar os servicos e apagar o volume persistente do Postgres:

```sh
docker compose down --volumes --remove-orphans
```

Servicos locais:

- Web Next.js: http://localhost:3000
- API NestJS: http://localhost:3333
- Health da API: http://localhost:3333/health
- Postgres: localhost:5432

O banco usa o volume `postgres_data`, entao os dados sao mantidos entre reinicios com `docker compose down` e `docker compose up`.
