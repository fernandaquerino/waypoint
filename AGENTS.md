# AGENTS.md — Waypoint

> Persistent instructions for AI agents working in this repository.
> Read this file before making any change. It is the contract for product, architecture, folders, scope and quality.

---

## 0. How to use this file

This file should guide any AI agent, such as Codex, Claude Code or Cursor Agent, when working on the **Waypoint** project.

Before acting:

1. Read this `AGENTS.md`.
2. Read the current issue or request.
3. Read the relevant repository files before editing.
4. Make the smallest complete change possible.
5. Run the available checks.
6. At the end, explain what changed, where it changed, what was validated and what is still pending.

This project is personal, but it should be treated as a real product: **production-minded, portfolio-grade, incremental, testable and secure**.

---

## 1. Product vision

**Product name:** Waypoint  
**Repository:** `fernandaquerino/waypoint`  
**Type:** personal app for professional organization, studies and career growth.  
**Primary user:** Fernanda, a developer growing professionally, using the app to organize onboarding, studies, deliverables, achievements, questions and next steps.

Waypoint is a personal career dashboard. It helps answer:

- Where am I professionally right now?
- What do I need to do today?
- What am I studying?
- Which questions are still open?
- What did I learn recently?
- Which technical decisions did I make?
- Which professional achievements do I need to remember?
- Which links, courses, books and resources am I using?
- How am I evolving in my skills?
- Which next steps make sense for my career?

The product's core pain:

> Nothing important about your career should live only in your head.

The app is not a generic to-do list. The app is an organized professional memory.

---

## 2. Product principles

1. **Clarity before quantity.** The app should reduce anxiety, not create an infinite hub of pending items.
2. **Quick capture is the heart.** Recording a learning, question, task, link or achievement should take very few clicks.
3. **Achievements are a central feature.** The product should help the user remember professional evidence for interviews, résumés, LinkedIn and performance reviews.
4. **The work log becomes memory.** The work diary should turn confusing days into visible progress.
5. **Every sprint ships something usable end to end.** Avoid "backend-only sprints" or "layout-only sprints".
6. **CRUD before AI.** AI is out of v1. The data structure needs to prove its value before automation.
7. **The design system is born in code.** Don't create loose mockups that never become real components.
8. **Interface in Brazilian Portuguese.** Code can use English. The UI should use PT-BR.
9. **Personal data is private.** Professional energy, interviews, achievements and notes are sensitive data.
10. **A simple working feature beats an ambitious half-done one.**

---

## 3. v1 scope

v1 should contain:

- authentication and user;
- initial dashboard;
- quick capture / Entry core;
- today's tasks;
- professional moment;
- work log;
- studies;
- questions;
- achievements / brag document;
- useful links;
- projects;
- skills;
- interviews;
- weekly review;
- weekly focus;
- professional energy;
- search, tags and filters;
- empty states, loading, error, toasts, README and deploy.

### Out of v1

Don't implement in v1 without an explicit issue and an approved ADR:

- generative AI;
- weekly summary with AI;
- automatic résumé × job-description comparison;
- embeddings / pgvector;
- PDF export;
- automatic GitHub integration;
- native mobile app;
- multi-user for teams;
- public profile sharing;
- push notifications;
- complex gamification;
- marketplace, community or social network.

These items are `Future`.

---

## 4. Official stack

Don't add libraries outside this stack without clearly justifying the trade-off.

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| Monorepo    | pnpm workspaces                                                   |
| Frontend    | Next.js App Router                                                |
| Backend/BFF | NestJS                                                            |
| Language    | TypeScript strict                                                 |
| Database    | PostgreSQL                                                        |
| ORM         | Drizzle ORM + drizzle-kit                                         |
| Auth        | Auth.js in Next.js + JWT validated in NestJS                      |
| UI          | Tailwind CSS + own components in `packages/ui`                    |
| Validation  | Zod in `packages/types` when it makes sense to share the contract |
| Tests       | Vitest / Testing Library / Playwright, per the available setup    |
| Local infra | Docker Compose                                                    |
| CI          | GitHub Actions                                                    |

Before installing any new package, answer:

```md
## Why do I need this package?

- Problem it solves:
- Alternatives considered:
- Why it can't be done with what already exists:
- Impact on bundle/maintenance:
```

If there's no justification, don't install it.

---

## 5. Expected folder structure

The monorepo's target structure is:

```txt
.
├── apps/
│   ├── api/                         # NestJS API/BFF
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/              # typed config / env validation
│   │   │   ├── common/              # generic pipes, filters, guards, interceptors
│   │   │   ├── database/            # NestJS providers for Drizzle / @waypoint/db
│   │   │   └── modules/             # modules per domain
│   │   │       ├── auth/
│   │   │       ├── users/
│   │   │       ├── entries/
│   │   │       ├── professional-moments/
│   │   │       ├── study/
│   │   │       ├── questions/
│   │   │       ├── achievements/
│   │   │       ├── links/
│   │   │       ├── projects/
│   │   │       ├── skills/
│   │   │       ├── interviews/
│   │   │       ├── weekly-reviews/
│   │   │       ├── weekly-focus/
│   │   │       └── energy/
│   │   ├── test/
│   │   └── package.json
│   │
│   └── web/                         # Next.js App Router
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/           # login, sign up, callback
│       │   │   ├── (app)/            # authenticated routes
│       │   │   │   ├── dashboard/
│       │   │   │   ├── hoje/
│       │   │   │   ├── registros/
│       │   │   │   ├── momento-atual/
│       │   │   │   ├── work-log/
│       │   │   │   ├── estudos/
│       │   │   │   ├── duvidas/
│       │   │   │   ├── conquistas/
│       │   │   │   ├── links/
│       │   │   │   ├── projetos/
│       │   │   │   ├── skills/
│       │   │   │   ├── entrevistas/
│       │   │   │   └── review-semanal/
│       │   │   ├── api/              # only Auth.js or very Next-specific endpoints
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/           # components without strong domain, web app only
│       │   │   ├── layout/           # AppShell, Sidebar, Topbar
│       │   │   ├── feedback/         # EmptyState, ErrorState, LoadingState
│       │   │   └── data-display/     # MetricCard, SectionHeader, Timeline
│       │   ├── features/             # features per domain
│       │   │   ├── dashboard/
│       │   │   ├── entries/
│       │   │   ├── professional-moments/
│       │   │   ├── today/
│       │   │   ├── work-log/
│       │   │   ├── study/
│       │   │   ├── questions/
│       │   │   ├── achievements/
│       │   │   ├── links/
│       │   │   ├── projects/
│       │   │   ├── skills/
│       │   │   ├── interviews/
│       │   │   ├── weekly-review/
│       │   │   └── energy/
│       │   ├── hooks/                # genuinely global reusable hooks
│       │   ├── lib/                  # api client, auth helpers, pure formatters
│       │   └── styles/               # tokens/css vars if not in globals
│       └── package.json
│
├── packages/
│   ├── db/                           # Drizzle schema, client, migrations and seed
│   │   ├── src/
│   │   │   ├── client.ts             # Drizzle client creation
│   │   │   ├── index.ts              # package public exports
│   │   │   └── schema/
│   │   │       ├── users.ts
│   │   │       └── index.ts
│   │   ├── drizzle/                  # migrations generated by drizzle-kit
│   │   ├── seed.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── types/                        # shared types, enums, Zod schemas and contracts
│   │   └── src/
│   │       ├── entries/
│   │       ├── professional-moments/
│   │       ├── study/
│   │       ├── interviews/
│   │       └── shared/
│   │
│   └── ui/                           # reusable design system
│       └── src/
│           ├── tokens/
│           ├── components/
│           │   ├── button/
│           │   ├── input/
│           │   ├── card/
│           │   ├── badge/
│           │   ├── chip/
│           │   ├── checkbox/
│           │   ├── textarea/
│           │   └── dialog/
│           ├── icons/
│           └── utils/
│
├── docs/
│   ├── adr/
│   │   ├── ADR-001-entry-model.md
│   │   ├── ADR-002-orm.md
│   │   ├── ADR-003-monorepo.md
│   │   └── ADR-004-auth.md
│   ├── architecture.md
│   └── product-map.md
│
├── scripts/                          # idempotent project scripts
├── .github/workflows/                # CI
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── README.md
└── AGENTS.md
```

### Golden rule for folders

If something has product domain, put it inside the corresponding feature/domain.  
If something is a generic visual primitive, put it in `packages/ui`.  
If something is a shared contract, put it in `packages/types`.  
If something is a backend rule, put it in `apps/api/src/modules/<domain>`.

---

## 6. What goes in each folder

### `apps/api/src/modules/<domain>`

Each NestJS domain should follow, whenever it makes sense:

```txt
modules/<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts
├── <domain>.service.ts
├── <domain>.repository.ts
├── dto/
├── mappers/
├── entities/             # if needed for internal domain types
└── tests/
```

Rules:

- the controller is thin;
- the service holds business logic;
- the repository holds Drizzle access through the `@waypoint/db` package;
- the DTO validates input/output;
- the mapper converts database → response;
- a module should not directly access another domain's repository without a public service or a clear use case.

### `apps/web/src/features/<domain>`

Each web feature should follow:

```txt
features/<domain>/
├── components/
├── hooks/
├── services/             # calls to the api client or thin server actions
├── types/                # local UI types, not global contracts
├── utils/                # feature-specific util
└── constants.ts
```

Rules:

- a feature component can know the domain;
- a feature component should not be exported as generic UI without reason;
- query/mutation hooks live in the feature;
- heavy data transformation should not live in the JSX;
- don't create `features/shared` as a junk drawer.

### `packages/ui`

Use it for components with no business logic:

- `Button`
- `Input`
- `Textarea`
- `Card`
- `Badge`
- `Chip`
- `Checkbox`
- `Dialog`
- `Dropdown`
- `Tabs`
- `Skeleton`
- `Toast` base, if it exists

Don't put in `packages/ui`:

- `AchievementCard`;
- `QuickCapture`;
- `ProfessionalMomentCard`;
- `StudyProgressCard`;
- `InterviewKanban`;
- any component that speaks of Waypoint directly.

Those live in `apps/web/src/features/...`.

### `packages/types`

Use it for shared contracts:

- domain enums;
- input/output Zod schemas;
- shared DTOs;
- API types when used by both web and api.

Don't put database, React, NestJS or Drizzle logic here.

### `packages/db`

Use it for:

- Drizzle schema split by domain;
- Drizzle client and minimal connection helpers;
- migrations generated by `drizzle-kit`;
- local seed;
- reset/dev scripts when it makes sense.

Rules:

- the schema lives in `packages/db/src/schema/`;
- migrations live in `packages/db/drizzle/`;
- `drizzle.config.ts` lives in `packages/db/`;
- don't put business logic in this package;
- don't import NestJS or React in `packages/db`;
- never manually edit old migrations after they've been applied. Create a new migration.

### `docs/adr`

Use it for architectural decisions. An ADR is not decoration. If a decision changes, update the ADR.

---

## 7. "Never do this under any circumstances" rules

These rules are mandatory.

### Product and scope

- Don't turn Waypoint into a generic to-do list.
- Don't implement AI in v1 without an explicit issue and ADR.
- Don't build an advanced feature before the foundation and Entry core are stable.
- Don't create screens with only mocked data and call them done.
- Don't create a dashboard full of metrics with no clear action.
- Don't add gamification, ranking, social network or public sharing in v1.
- Don't mix clinical/therapy health with professional energy. The thermometer is purely professional and light.

### Architecture

- Don't put business logic inside a React component.
- Don't put business logic inside a NestJS controller.
- Don't access Drizzle directly from the frontend.
- Don't duplicate business logic across Next and Nest.
- Don't create a giant `utils.ts`.
- Don't create one monolithic global store for everything.
- Don't store server data in Zustand/localStorage as the source of truth.
- Don't create duplicate types when they can come from `packages/types` or from the Drizzle-inferred schemas.
- Don't create an abstraction with only one real usage.
- Don't refactor the whole architecture during a small issue.

### Security and data

- Don't trust `userId` coming from the client.
- Don't return another user's data.
- Don't log tokens, passwords, JWTs, cookies, full email addresses or sensitive personal data.
- Don't store tokens in localStorage.
- Don't commit `.env`, secrets, keys or credentials.
- Don't expose stack traces in production responses.
- Don't skip authorization on update/delete routes.

### Database

- Don't manually edit an applied migration.
- Don't create a domain table without `userId`, except for a justified global table.
- Don't hard delete domain data by default, except in an explicit flow.
- Don't use JSONB as a shortcut to avoid modeling without an ADR.
- Don't remove fields/tables without a migration and without adjusting consumers.

### Frontend

- Don't use `any` to silence TypeScript.
- Don't use `// @ts-ignore` without an explanation and a follow-up issue.
- Don't create a Client Component when a Server Component solves it.
- Don't remove the focus outline without replacing it with a visible focus.
- Don't leave a screen without empty/loading/error when it fetches data.
- Don't use hardcoded English text in the UI, except for unavoidable technical terms.
- Don't use arbitrary colors without a token when the token exists.
- Don't use a design system component for domain logic.

### Tests and quality

- Don't remove a test to make the build pass without explaining.
- Don't skip lint/typecheck if the command exists.
- Don't leave stray `console.log`.
- Don't swallow errors with an empty `catch {}`.
- Don't finish an issue saying it's done if you didn't run the checks or explain why not.

---

## 8. Product domains

### 8.1 Auth and user

Responsible for:

- login/sign up;
- persistent session;
- profile;
- timezone;
- theme preferences;
- editable professional status.

Rules:

- `userId` always comes from the session.
- Protected APIs require authentication.
- Don't return the password hash.

### 8.2 Entry core

`Entry` is the product's core.

Planned types:

- `learning` — a learning;
- `achievement` — an achievement;
- `question` — a question;
- `task` — a task;
- `link` — a useful link;
- `study_log` — a study record;
- `decision` — a technical decision;
- `feedback` — feedback received.

Suggested model:

- a base `entries` table;
- specific tables per subtype;
- a 1:1 relation between `entries` and the subtype;
- tags via an N:N relation;
- an optional link to a professional moment, project, interview or study.

Don't switch to JSONB without an ADR.

### 8.3 Professional moment

`ProfessionalMoment` is context, not an Entry.

Expected fields:

- company;
- project;
- role;
- phase: onboarding, ramp-up, cruising, transition;
- goal of the week;
- main challenge;
- recommended next action;
- start date;
- end date.

Rules:

- only one active moment per user;
- the active moment has `endedAt = null`;
- when creating a new active moment, close the previous one or prevent creation;
- entries can be linked to the active moment.

### 8.4 Today

Responsible for the day's professional tasks.

Rules:

- list tasks with `dueDate` of today;
- allow complete/uncomplete;
- discrete priority;
- clear category;
- don't become an infinite, unfocused list.

### 8.5 Work Log

A browsable timeline of:

- learnings;
- technical decisions;
- studies;
- solved problems;
- relevant records of the day.

Group by date. It should make it easy to answer: "what did I do/learn this week?".

### 8.6 Studies

Entities:

- `StudyTrail`;
- `StudyResource`;
- `StudyProgress`;
- `StudyLog`.

Rules:

- a resource can be a course, video, book, article, documentation or exercise;
- progress can be manual;
- a timer is optional;
- today's studies should prioritize in-progress resources.

### 8.7 Questions

A question is an Entry subtype, but it has its own screen.

Statuses:

- `open` / Aberta;
- `needs_validation` / Precisa validar;
- `answered` / Respondida.

When answering a question, it may create a linked learning.

### 8.8 Achievements / Brag Document

An achievement is a central subtype.

Important fields:

- title;
- context;
- action;
- result;
- type: onboarding, technical, process, leadership, communication;
- impact: autonomy, clarity, performance, documentation, productivity, quality;
- technologies;
- linked moment;
- flags: use in interview, résumé, LinkedIn.

Don't model an achievement as a simple note. It needs to become professional evidence.

### 8.9 Useful links

Fields:

- URL;
- title;
- category;
- tags;
- reviewed/to review;
- optional link to a trail, project or moment.

### 8.10 Projects

Fields:

- name;
- description;
- stack;
- status: active, paused, archived;
- linked entries;
- linked technical decisions.

### 8.11 Skills

Fields:

- name;
- category;
- current level 1–5;
- target level 1–5;
- notes;
- evolution history.

Don't use skills as a metric to generate guilt. The UX should show evolution.

### 8.12 Interviews

Entities:

- process;
- stage;
- feedback;
- résumé version;
- job requirements.

Rules:

- feedback can become a learning;
- a requirement can be `meets`, `partial`, `doesn't meet`;
- a process has a clear status.

### 8.13 Weekly review

One review per week.

It should consolidate:

- what happened;
- what I learned;
- what's still pending;
- main achievements;
- focus for next week;
- automatic counters of entries by type.

### 8.14 Weekly focus

A dashboard widget with:

- title;
- description;
- checklist.

At the end of the week, it can be consolidated into the review.

### 8.15 Professional energy

A professional thermometer, not a clinical one.

Levels:

- confident;
- neutral;
- lost;
- overwhelmed.

It allows a short note, for example: "Lost, but making progress".

### 8.16 Search, tags and filters

It should let you find anything in seconds.

- global tags;
- filters by type/status/date;
- full-text search across Entries, Moments and Processes;
- optional Cmd+K.

---

## 9. Roadmap per sprint

### Sprint 0 — Foundation

Focus: infrastructure, no deep product feature.

Deliverable: the app runs locally, login works, the sidebar appears, the theme toggles.

Issues:

- monorepo with pnpm workspaces;
- Docker Compose with Postgres 16, API and Web;
- NestJS base setup;
- Next.js base setup with App Router, Tailwind and theme;
- base Drizzle schema with the `users` table;
- Auth.js in Next + JWT guard in NestJS;
- CI with lint, typecheck and test;
- minimal design system in `packages/ui`;
- dashboard shell with sidebar;
- ADR-001, ADR-002, ADR-003, ADR-004.

### Sprint 1 — Quick capture / Entry core

Deliverable: record a learning, question, task or link from the dashboard and view it in the listing.

### Sprint 2 — Today + Work Log

Deliverable: the dashboard shows the day's tasks and the work log becomes a professional diary.

### Sprint 3 — Current moment

Deliverable: the dashboard shows real, editable professional context.

### Sprint 4 — Studies

Deliverable: trails, resources, progress and today's studies.

### Sprint 5 — Questions

Deliverable: open questions with status and a link to the current moment.

### Sprint 6 — Achievements + Links

Deliverable: an initial brag document and organized links.

### Sprint 7 — Projects + Skills

Deliverable: projects, skills and technical evolution.

### Sprint 8 — Interviews part 1

Deliverable: hiring processes and stages.

### Sprint 9 — Interviews part 2

Deliverable: résumés, job requirements and the process × résumé link.

### Sprint 10 — Weekly review + Focus + Energy

Deliverable: a weekly professional review ritual.

### Sprint 11 — Search, tags and filters

Deliverable: find any information quickly.

### Sprint 12 — Polish

Deliverable: v1 in production with empty states, toasts, an onboarding tour, README and deploy.

---

## 10. Mandatory ADRs

Write or update ADRs in `docs/adr`.

Sprint 0 ADRs:

- `ADR-001-entry-model.md`
- `ADR-002-orm.md`
- `ADR-003-monorepo.md`
- `ADR-004-auth.md`

Template:

```md
# ADR-000 — Title

## Status

Proposed | Accepted | Superseded

## Context

Explain the problem and the forces involved.

## Options considered

- Option A
- Option B

## Decision

Explain the choice.

## Consequences

- Positive
- Negative
- Trade-offs
```

Don't implement a solution that contradicts an accepted ADR without updating the ADR.

---

## 11. Backend guidelines — NestJS

### Controllers

Controllers should:

- validate session/authorization;
- receive parameters;
- validate input;
- call the service;
- return the response.

Controllers should not:

- contain business logic;
- assemble complex Drizzle queries;
- decide domain logic;
- do heavy transformation.

### Services

Services should:

- concentrate business logic;
- orchestrate repositories;
- apply authorization rules when tied to the domain;
- be testable.

### Repositories

Repositories should:

- be the only domain layer that talks directly to Drizzle;
- always filter by `userId` on domain data;
- not return unnecessary sensitive data;
- not contain complex product rules.

### DTOs and validation

- Always validate input on the backend.
- If the schema is shared with the frontend, use `packages/types`.
- Reject invalid input with a structured error.

Suggested envelope:

```ts
{
  data: T;
}
```

Suggested error:

```ts
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

### HTTP status

- `200` read/update OK;
- `201` creation OK;
- `204` delete with no body;
- `400` malformed request;
- `401` not authenticated;
- `403` no permission;
- `404` resource not found;
- `422` input validation;
- `500` unexpected error with no sensitive details.

### Expected REST routes

```txt
GET    /entries
POST   /entries
GET    /entries/:id
PATCH  /entries/:id
DELETE /entries/:id

GET    /professional-moments/active
GET    /professional-moments
POST   /professional-moments
PATCH  /professional-moments/:id
POST   /professional-moments/:id/close

GET    /study/trails
POST   /study/trails
GET    /study/resources
POST   /study/resources
PATCH  /study/progress/:id

GET    /weekly-reviews
POST   /weekly-reviews
GET    /weekly-reviews/current
```

---

## 12. Frontend guidelines — Next.js

### Server Components by default

Use Server Components when:

- the screen only loads data;
- there's no local interactive state;
- it doesn't use browser APIs;
- it doesn't use user events.

Use Client Components when:

- there's an interactive form;
- there are client-side filters;
- there's a controlled modal/dropdown;
- there's drag and drop;
- there's local state;
- there's React Query or a mutation.

Mark `"use client"` on the smallest possible component, never on the whole page without need.

### Page organization

Pages in `app/` should be thin. They can:

- assemble layout;
- fetch initial data;
- call feature components;
- define metadata.

Pages should not:

- contain giant JSX;
- contain domain logic;
- contain complex transformation;
- fetch in a scattered way without a layer.

### API client

Centralize HTTP calls in:

```txt
apps/web/src/lib/api/
```

or in services per feature:

```txt
features/entries/services/entries-api.ts
```

Don't scatter raw `fetch()` across many components.

### State

Use local state for simple UI.  
Use a query/mutation library if the project already has one.  
Don't duplicate server data in a global store.

### Forms

- Client-side validation improves UX, but the backend is the final source.
- Errors should appear near the field.
- Submit should have a loading state.
- Don't clear the form if the request fails.

### Lists and tables

- Every list with remote data needs loading, error and empty.
- Large lists should have pagination or virtualization.
- Important filters should be able to live in the URL when it makes sense.

### Accessibility

Mandatory:

- labels on inputs;
- buttons with accessible text;
- visible focus;
- keyboard navigation;
- adequate contrast;
- `aria-describedby` for field errors;
- modals with focus trap.

---

## 13. Design system and UI

The design should be:

- clean;
- professional;
- calm;
- useful;
- with clear visual hierarchy;
- with few decorative elements;
- with functional cards, not random cards.

Visual references:

- Linear;
- Raycast;
- Notion;
- Cron Calendar;
- Height;
- Arc Browser;
- Superhuman.

Suggested base palette:

```txt
Background: #F8FAFC or #FAFAFB
Surface: #FFFFFF
Text primary: #111827
Text secondary: #6B7280
Primary: #7C6FF7
Primary dark: #5B4FE8
Success soft: soft green
Warning soft: soft yellow
Danger: red only for real alerts
```

### Minimum Sprint 0 components

In `packages/ui`:

- `Button`
- `Input`
- `Textarea`
- `Card`
- `Badge`
- `Chip`
- `Checkbox`
- `Skeleton`
- color tokens;
- spacing tokens;
- radius tokens;
- light/dark theme with CSS variables.

### UI rules

- Don't create a cluttered dashboard.
- Don't use more than one attention-grabbing color per section.
- Don't create a visual component with no real function.
- Don't use emoji as interface structure.
- Don't hide the primary action.
- Don't leave the user without a clear next step.

### Microcopy

Use phrases like:

- "Nada importante precisa ficar só na sua cabeça."
- "Registre agora, organize depois."
- "O que você aprendeu hoje?"
- "Essa conquista pode virar um case de entrevista."
- "Você não precisa entender tudo hoje. Só o próximo passo."

Avoid:

- a childish tone;
- exaggerated motivational phrases;
- clinical language;
- too many emojis;
- unnecessary English in the UI.

---

## 14. Database and Drizzle

### Conventions

- Drizzle ORM is the official source of schema and migrations.
- The schema lives in `packages/db/src/schema/`, split by domain.
- Generated migrations live in `packages/db/drizzle/`.
- Use `drizzle.config.ts` in `packages/db/`.
- Table and column names in the database should use `snake_case`.
- TypeScript names should use `camelCase`.
- Use Drizzle helpers such as `pgTable`, `uuid`, `text`, `timestamp`, `boolean`, `integer`, `pgEnum`, `index` and `uniqueIndex`.
- Every domain entity should have `id`, `userId`, `createdAt`, `updatedAt`.
- Use `deletedAt` on main entities when it makes sense to preserve history.

### Mandatory rules

- Every domain query should filter by `userId`.
- Don't accept `userId` from the client.
- Don't create a domain table without an FK to the user, except for a documented exception.
- Don't manually edit an old applied migration.
- Don't use JSONB as an excuse not to model the domain.
- Don't cascade-delete data without understanding the impact.
- Don't scatter the Drizzle schema inside `apps/web` or `apps/api/modules`.
- Don't create a new Drizzle client in each repository. Reuse the client/provider defined in the database layer.
- Don't use raw SQL when Drizzle's query builder solves it clearly.
- Raw SQL is only allowed with justification, typing and care about injection.

### Recommended database package structure

```txt
packages/db/
├── src/
│   ├── client.ts
│   ├── index.ts
│   └── schema/
│       ├── users.ts
│       ├── entries.ts              # Sprint 1+
│       ├── professional-moments.ts # Sprint 3+
│       ├── study.ts                # Sprint 4+
│       ├── interviews.ts           # Sprint 8+
│       └── index.ts
├── drizzle/
│   └── ... generated migrations
├── seed.ts
├── drizzle.config.ts
└── package.json
```

### Drizzle schema

Rules for schemas:

- Each file should represent a domain or a small set of related tables.
- `users.ts` should contain the initial `users` table from Sprint 0.
- `index.ts` should export all tables and enums.
- Shared enums should be defined with `pgEnum` when persisted in the database.
- Indexes should be declared in the schema next to the table.
- Important constraints should be explicit, not just validated in the application.

Conceptual example:

```ts
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

### Migrations

- Generate migrations with `drizzle-kit generate`.
- Apply migrations with `drizzle-kit migrate`.
- Review the generated SQL before considering it done.
- Never edit an old, already-applied migration. Generate a new one.
- A broken migration in the local environment can only be reset if there's no real data.
- CI should validate typecheck and, when configured, migration consistency.

### Repositories with Drizzle

Repositories should:

- receive or import the Drizzle client through a central point;
- use the schemas exported by `@waypoint/db`;
- always filter by `userId` on domain entities;
- return only the needed data;
- keep queries clear and testable.

Conceptual example:

```ts
await db
  .select()
  .from(entries)
  .where(and(eq(entries.id, id), eq(entries.userId, userId)));
```

Never:

```ts
await db.select().from(entries).where(eq(entries.id, id));
```

### Inferred types

- Use `$inferSelect` and `$inferInsert` when it makes sense.
- Database types don't replace API contracts when the public response differs.
- Don't export internal table details directly to React components.
- API DTOs can be defined in `packages/types` with Zod.

### Soft delete

Prefer `deletedAt` for:

- entries;
- moments;
- projects;
- hiring processes;
- study resources.

Hard delete only in an explicit account-deletion or local-reset flow.

### Seeds

Seeds should use fictional, realistic data.  
Don't put the user's real personal data in a public seed.

### Drizzle Studio

- `pnpm db:studio` should open Drizzle Studio.
- Drizzle Studio is a development tool, not a product feature.
- Don't rely on Studio to validate business rules; use tests or the real flow.

---

## 15. Authentication and authorization

Suggested architecture:

- Auth.js in Next.js;
- session/JWT issued by Next;
- NestJS validates the JWT via a guard;
- `userId` extracted from the session/token on the server;
- the frontend never chooses the `userId`.

### Rules

- Every private route requires authentication.
- Every mutation checks resource ownership.
- Never trust ids sent by the client for authorization.
- When fetching a resource by `id`, also filter by `userId`.

Conceptual example:

```ts
findEntryById({ id, userId });
```

Never:

```ts
findEntryById(id);
```

---

## 16. Security and privacy

Waypoint stores sensitive professional and personal data.

Never log:

- passwords;
- password hashes;
- JWTs;
- cookies;
- refresh tokens;
- full email addresses;
- the full text of sensitive feedback;
- private notes;
- professional-energy/health data;
- secrets.

### LocalStorage

Don't use localStorage for:

- tokens;
- session;
- sensitive data;
- entries;
- achievements;
- feedback;
- interviews;
- professional energy.

localStorage may be used only for non-sensitive ephemeral UI, such as a local visual preference, if there's no better alternative.

### Env

- `.env` should never be committed.
- `.env.example` should contain variable names without real values.
- Validate envs at startup when possible.

### Errors

- In production, responses must not leak stack traces.
- Messages for the user should be clear but not reveal internal details.

---

## 17. AI — rule for v1

AI is out of v1.

Don't implement:

- an AI chat;
- automatic summarization;
- automatic study suggestions;
- automatic classification of entries;
- embeddings;
- automatic job comparison;
- automatic résumé generation.

You may prepare the data model for export or future use, but without integrating an LLM.

When AI comes in the future:

- it will need its own ADR;
- it will need explicit consent;
- it won't be allowed to change data without confirmation;
- it must treat the user's content as data, not instructions;
- it must have tests with a mocked model.

---

## 18. Tests

Prioritize tests where there's real risk:

- per-user isolation;
- entry creation/listing;
- toggling task status;
- the one-active-moment-at-a-time rule;
- linking an achievement to a moment;
- filters and search;
- authentication/authorization;
- quick-capture components;
- critical forms.

### Unit tests

Use for:

- pure rules;
- mappers;
- validators;
- formatters;
- weekly-counter calculation.

### Integration tests

Use for:

- service + repository;
- Drizzle with a test database;
- per-user authorization;
- creation/listing flows.

### Component tests

Use for:

- the design system;
- forms;
- dashboard cards;
- empty/loading/error states.

### E2E

Critical flows:

1. login;
2. open the dashboard;
3. record an Entry;
4. see the Entry in the listing;
5. complete a today task;
6. create a professional moment;
7. record an achievement;
8. open the brag document.

### Regression rule

A fixed bug should become a test whenever possible.

---

## 19. Expected commands

Before assuming a command, check `package.json`.

Desired commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Database:

```bash
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:seed
```

If a command doesn't exist and the issue asks for setup, create the script in the appropriate `package.json`.

Before finishing a change, run as much as possible:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If it doesn't run, explain why.

---

## 20. Agent workflow

When you receive a task:

1. Identify the sprint and the domain.
2. Read the full issue/request.
3. Read the relevant files.
4. Check the related ADRs.
5. Make a short plan before big changes.
6. Implement the smallest complete change.
7. Don't change files outside the scope without need.
8. Update tests and docs if the contract changed.
9. Run the checks.
10. Finish with an objective summary.

### Expected final response after implementation

```md
## What was done

- ...

## Files changed

- `path/file.ts` — reason

## Checks

- `pnpm lint` ✅
- `pnpm typecheck` ✅
- `pnpm test` didn't run because ...

## Notes

- Risk: ...
- Decision Needed: ...
- Future: ...
```

---

## 21. Git, branches and commits

### Branches

Suggested format:

```txt
sprint-0/setup-monorepo
sprint-0/docker-compose
sprint-0/auth-foundation
sprint-1/entry-core
sprint-2/today-work-log
```

### Commits

Use simple Conventional Commits:

```txt
feat: configure pnpm workspace
feat(api): add entries module
feat(web): add quick capture component
fix(api): enforce user filter on entries
chore: add lint workflow
docs: add ADR for entry model
test: cover active professional moment rule
```

### Don't mix in the same commit

- feature + big refactor;
- schema + redesign;
- auth + complex dashboard;
- mass lint + functional change;
- a new dependency + several features.

---

## 22. Issues and labels

Use small, traceable issues.

Expected labels:

- `sprint-0` through `sprint-12`;
- `domain:auth`, `domain:entry`, `domain:study`, `domain:achievement`, `domain:interview`;
- `stack:api`, `stack:web`, `stack:db`, `stack:infra`, `stack:ui`;
- `type:feature`, `type:bug`, `type:docs`, `type:adr`, `type:refactor`, `type:test`;
- `priority:critical`, `priority:high`, `priority:normal`, `priority:low`.

Template:

```md
## Context

Why this issue exists and what problem it solves.

## Scope

- [ ] Concrete item
- [ ] Concrete item

## Out of scope

- What doesn't enter now

## Acceptance criteria

- Given that...
- When...
- Then...

## Technical notes

- Endpoint:
- Components:
- Schema:
- Tests:
```

---

## 23. Code quality

### TypeScript

- `strict` on.
- Don't use `any` without justification.
- Prefer explicit types at the edges.
- Use inference inside functions when it's clear.
- Don't use `as unknown as` to force a type.

### Functions

- Small functions.
- A name that explains intent.
- Avoid the boolean trap with many booleans.
- Prefer a params object when a function grows.

### Components

- Small, cohesive components.
- Typed props.
- Avoid a 300-line component.
- Separate container/data fetching from presentation when it improves clarity.

### Errors

- Handle predictable errors.
- Don't swallow errors silently.
- Use useful messages.
- Structured logging on the backend with no sensitive data.

---

## 24. Performance

Don't optimize early, but avoid bad decisions.

- Don't fetch a giant list without pagination.
- Don't recompute heavy transformation on render without need.
- Don't put everything as a Client Component.
- Don't load a heavy library without justification.
- Don't render complex charts without a fallback.
- Don't do N+1 queries on the backend.

Use pagination/filters for:

- entries;
- work log;
- links;
- interviews;
- skills history.

---

## 25. Minimum observability

Even in a side project, record:

- API errors with a request id;
- authentication failures with no sensitive data;
- aggregated validation failures when useful;
- timing of critical endpoints if there's infra for it.

Don't implement advanced observability before the foundation, except for a specific issue.

---

## 26. Definition of done

An issue is only done when:

- it compiles;
- lint passes or the failure is documented;
- typecheck passes or the failure is documented;
- a relevant test was created/updated when applicable;
- the main flow was validated manually or by a test;
- the UI has loading/error/empty when it fetches data;
- data is filtered by the authenticated user;
- documentation/ADR was updated when the contract changed;
- there's no out-of-scope change;
- there's no `console.log`, unjustified `any` or vague TODO.

---

## 27. Current priority

At the start of the project, prioritize Sprint 0:

1. monorepo;
2. Docker Compose;
3. NestJS base;
4. Next.js base;
5. Drizzle base;
6. Auth;
7. CI;
8. minimal design system;
9. dashboard shell;
10. ADRs.

Don't jump to advanced features before this.

---

## 28. Senior mentorship mode

This project also serves the user's technical growth. The agent should act as a senior mentor.

Expected behaviors:

- explain trade-offs;
- point out risks;
- suggest alternatives;
- separate `Risk`, `Decision Needed` and `Future`;
- don't silently decide architecture;
- teach the pattern used;
- suggest relevant tests;
- help turn a technical decision into a PR/interview explanation.

Signaling:

- `Risk` — can break production, security, performance or create debt.
- `Decision Needed` — an architectural/product choice needs validation.
- `Future` — a valid improvement, but out of the current scope.

---

## 29. Final reminder

Waypoint should help the user gain clarity about career, studies, deliverables and professional growth.

Whenever in doubt between a flashy solution and a clear one, choose the clear one.

Whenever in doubt between a sophisticated abstraction and a simple implementation that works, choose the simple one.

Whenever a feature could become just more noise, stop and ask: "does this help the user know the next step?"
