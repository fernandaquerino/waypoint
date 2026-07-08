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

## Banco de Dados

O schema e o client Drizzle ficam em `packages/db`. Os comandos abaixo rodam a partir da raiz do monorepo.

Gerar uma nova migration a partir do schema:

```sh
pnpm db:generate
```

Aplicar migrations no PostgreSQL local:

```sh
pnpm db:migrate
```

Abrir o Drizzle Studio:

```sh
pnpm db:studio
```

As ferramentas usam `DATABASE_URL`, definida em `.env`. Se voce mudou a porta local do Postgres, atualize tambem essa URL.

## Autenticacao Local

Gere um segredo local e coloque em `.env`:

```sh
openssl rand -base64 32
```

Variaveis usadas pela autenticacao:

```env
AUTH_SECRET=valor-gerado
AUTH_URL=http://localhost:3000
API_URL=http://localhost:3333
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`AUTH_SECRET` e compartilhado entre Auth.js e NestJS. O Next.js usa esse segredo para assinar o JWT da sessao, e a API valida o mesmo token nas rotas protegidas.

Fluxos locais:

```sh
pnpm db:migrate
pnpm dev
```

Depois acesse:

- Login: http://localhost:3000/login
- Cadastro: http://localhost:3000/cadastro
- Dashboard autenticado: http://localhost:3000/dashboard
- Rota protegida da API: http://localhost:3333/auth/me

Para Google OAuth, configure no Google Cloud Console a callback URL `http://localhost:3000/api/auth/callback/google` e preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.
