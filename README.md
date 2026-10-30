# Waypoint

> A personal career dashboard for developers — a single command center for your current professional moment, studies, daily tasks, learnings, achievements, open questions and next steps.

Waypoint is a personal product built to answer, at a glance:

- Where am I professionally right now?
- What do I need to do today?
- What am I studying?
- What did I learn recently?
- Which questions are still open?
- Which professional achievements can't I afford to forget?
- Which links, courses and materials am I using?
- How is my career evolving?

The core idea: **nothing important about your career should live only in your head.** Waypoint is not a generic to-do list — it's an organized professional memory, designed to reduce anxiety and make progress visible.

## Who it's for

Developers and other tech professionals in a growth phase: onboarding at a new company, switching careers, preparing for interviews, or simply trying to stay organized and keep a running record of their work and wins (a "brag document" that's actually maintained).

## Status

Active, early-stage personal project. **Sprint 0 (foundation)** is in place:

- pnpm monorepo (web + API + shared packages)
- Docker Compose with PostgreSQL
- NestJS API base with JWT auth guard
- Next.js (App Router) base with Tailwind and light/dark theming
- Drizzle ORM schema and migrations with a base `users` table
- Auth.js authentication (credentials + Google OAuth) shared between web and API
- An in-code design system (`packages/ui`) with Storybook
- CI (lint, typecheck, test)

Product features (entries, today, work log, studies, achievements, etc.) are built on top of this foundation and tracked in the [Roadmap](#roadmap).

## Tech stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Monorepo      | pnpm workspaces                                |
| Frontend      | Next.js (App Router), React, Tailwind CSS      |
| Backend / BFF | NestJS                                         |
| Language      | TypeScript (strict)                            |
| Database      | PostgreSQL                                     |
| ORM           | Drizzle ORM + drizzle-kit                      |
| Auth          | Auth.js on Next.js + JWT validated in NestJS   |
| Shared types  | Zod schemas in `packages/types`                |
| UI library    | Custom components in `packages/ui` + Storybook |
| Testing       | Vitest / Testing Library                       |
| Local infra   | Docker Compose                                 |
| CI            | GitHub Actions                                 |

## Repository structure

```txt
.
├── apps/
│   ├── api/        # NestJS API / BFF
│   └── web/        # Next.js App Router frontend
├── packages/
│   ├── db/         # Drizzle schema, client, migrations and seed
│   ├── types/      # Shared Zod schemas, enums and contracts
│   └── ui/         # Reusable design system (Storybook)
├── docs/           # Architecture Decision Records (ADRs)
├── docker-compose.yml
├── pnpm-workspace.yaml
└── AGENTS.md       # Product, architecture and contribution guidelines
```

## Getting started

### Prerequisites

- Node.js `>=20` (the repo targets Node 22 — see `.nvmrc`)
- pnpm `>=10`
- Docker and Docker Compose

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure environment variables

Copy the example file and adjust values if needed:

```sh
cp .env.example .env
```

Generate a local auth secret and set it as `AUTH_SECRET` in `.env`:

```sh
openssl rand -base64 32
```

For Google OAuth (optional locally), register the callback URL
`http://localhost:3000/api/auth/callback/google` in the Google Cloud Console and
fill in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 3. Start the database

Start everything with Docker Compose:

```sh
docker compose up
```

Or start only PostgreSQL:

```sh
docker compose up postgres
```

### 4. Run migrations

```sh
pnpm db:migrate
```

### 5. Start the apps

```sh
pnpm dev
```

Local services:

| Service          | URL                          |
| ---------------- | ---------------------------- |
| Web (Next.js)    | http://localhost:3000        |
| API (NestJS)     | http://localhost:3333        |
| API health check | http://localhost:3333/health |
| PostgreSQL       | localhost:5432               |

Useful routes while developing:

- Login: http://localhost:3000/login
- Sign up: http://localhost:3000/cadastro
- Authenticated dashboard: http://localhost:3000/dashboard
- Protected API route: http://localhost:3333/auth/me

PostgreSQL data is persisted in the `postgres_data` volume, so it survives
`docker compose down` / `docker compose up`. To wipe it:

```sh
docker compose down --volumes --remove-orphans
```

## Scripts

Run from the monorepo root:

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Run web + API in parallel                    |
| `pnpm build`       | Build all workspaces                         |
| `pnpm lint`        | Lint the whole repo                          |
| `pnpm typecheck`   | Type-check all workspaces                    |
| `pnpm test`        | Run tests across workspaces                  |
| `pnpm format`      | Format with Prettier                         |
| `pnpm db:generate` | Generate a Drizzle migration from the schema |
| `pnpm db:migrate`  | Apply migrations to the local PostgreSQL     |
| `pnpm db:studio`   | Open Drizzle Studio                          |
| `pnpm storybook`   | Run the design system Storybook              |

## Database

The Drizzle schema and client live in `packages/db`. Database commands use
`DATABASE_URL` from `.env`; if you change the local PostgreSQL port, update that
URL as well. Migrations are generated into `packages/db/drizzle/` and must never
be edited by hand once applied — generate a new one instead.

## Architecture

Key decisions are recorded as ADRs in [`docs/`](docs):

- [ADR-001](docs/ADR-001.md) — Entry model
- [ADR-002](docs/ADR-002.md) — ORM choice (Drizzle)
- [ADR-003](docs/ADR-003.md) — Monorepo structure
- [ADR-004](docs/ADR-004.md) — Authentication

Broader product and engineering guidelines (domains, folder conventions,
backend/frontend rules, security and privacy, testing strategy) are documented
in [`AGENTS.md`](AGENTS.md).

## Roadmap

Delivered incrementally, one usable slice per sprint:

- [x] **Sprint 0** — Foundation: monorepo, Docker, NestJS + Next.js base, Drizzle, auth, design system, CI
- [ ] **Sprint 1** — Entry core: capture learnings, questions, tasks and links from the dashboard
- [ ] **Sprint 2** — Today + Work Log
- [ ] **Sprint 3** — Current professional moment
- [ ] **Sprint 4** — Studies (trails, resources, progress)
- [ ] **Sprint 5** — Open questions
- [ ] **Sprint 6** — Achievements (brag document) + links
- [ ] **Sprint 7** — Projects + skills
- [ ] **Sprint 8–9** — Interviews (processes, stages, résumés, job requirements)
- [ ] **Sprint 10** — Weekly review, weekly focus and professional energy
- [ ] **Sprint 11** — Search, tags and filters
- [ ] **Sprint 12** — Polish: empty states, onboarding tour, deploy

> Note: the product interface is in Brazilian Portuguese (its target user), while
> the code, documentation and contribution guidelines are in English.

## License

[MIT](LICENSE) © fernandaquerino
