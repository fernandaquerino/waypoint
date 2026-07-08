# AGENTS.md — Waypoint

> Instruções persistentes para agentes de IA trabalhando neste repositório.
> Leia este arquivo antes de qualquer alteração. Ele é o contrato de produto, arquitetura, pastas, escopo e qualidade.

---

## 0. Como usar este arquivo

Este arquivo deve orientar qualquer agente de IA, como Codex, Claude Code ou Cursor Agent, ao trabalhar no projeto **Waypoint**.

Antes de agir:

1. Leia este `AGENTS.md`.
2. Leia a issue ou pedido atual.
3. Leia os arquivos relevantes do repositório antes de editar.
4. Faça a menor mudança completa possível.
5. Rode as validações disponíveis.
6. Explique no final o que mudou, onde mudou, o que foi validado e o que ficou pendente.

Este projeto é pessoal, mas deve ser tratado como produto real: **production-minded, portfolio-grade, incremental, testável e seguro**.

---

## 1. Visão do produto

**Nome do produto:** Waypoint  
**Repositório:** `fernandaquerino/waypoint`  
**Tipo:** app pessoal de organização profissional, estudos e evolução de carreira.  
**Usuária principal:** Fernanda, desenvolvedora em evolução profissional, usando o app para organizar onboarding, estudos, entregas, conquistas, dúvidas e próximos passos.

O Waypoint é um painel pessoal de carreira. Ele ajuda a responder:

- Em que momento profissional estou agora?
- O que preciso fazer hoje?
- O que estou estudando?
- Que dúvidas estão abertas?
- O que aprendi recentemente?
- Que decisões técnicas tomei?
- Que conquistas profissionais preciso lembrar?
- Que links, cursos, livros e recursos estou usando?
- Como estou evoluindo nas minhas skills?
- Quais próximos passos fazem sentido para minha carreira?

A dor central do produto:

> Nada importante da carreira deve ficar apenas na cabeça da usuária.

O app não é um todo list genérico. O app é uma memória profissional organizada.

---

## 2. Princípios de produto

1. **Clareza antes de quantidade.** O app deve reduzir ansiedade, não criar uma central infinita de pendências.
2. **Captura rápida é o coração.** Registrar aprendizado, dúvida, tarefa, link ou conquista deve exigir poucos cliques.
3. **Conquistas são feature central.** O produto deve ajudar a usuária a lembrar evidências profissionais para entrevistas, currículo, LinkedIn e avaliação de performance.
4. **Work log vira memória.** O diário de trabalho deve transformar dias confusos em progresso visível.
5. **Cada sprint entrega algo usável de ponta a ponta.** Evite “sprint só backend” ou “sprint só layout”.
6. **CRUD antes de IA.** IA está fora da v1. A estrutura de dados precisa provar valor antes de automação.
7. **Design system nasce em código.** Não criar mockups soltos que não viram componente real.
8. **Interface em português brasileiro.** Código pode usar inglês. UI deve usar PT-BR.
9. **Dados pessoais são privados.** Energia profissional, entrevistas, conquistas e anotações são dados sensíveis.
10. **Melhor uma feature simples funcionando do que uma feature ambiciosa pela metade.**

---

## 3. Escopo da v1

A v1 deve conter:

- autenticação e usuário;
- dashboard inicial;
- registro rápido / Entry core;
- tarefas de hoje;
- momento profissional;
- work log;
- estudos;
- dúvidas;
- conquistas / brag document;
- links úteis;
- projetos;
- skills;
- entrevistas;
- review semanal;
- foco da semana;
- energia profissional;
- busca, tags e filtros;
- empty states, loading, error, toasts, README e deploy.

### Fora da v1

Não implemente na v1 sem uma issue explícita e uma ADR aprovada:

- IA generativa;
- resumo semanal com IA;
- comparação automática de currículo × job description;
- embeddings / pgvector;
- exportação PDF;
- integração automática com GitHub;
- app mobile nativo;
- multiusuário para times;
- compartilhamento público de perfil;
- notificações push;
- gamificação complexa;
- marketplace, comunidade ou rede social.

Esses itens são `Future`.

---

## 4. Stack oficial

Não adicione bibliotecas fora desta stack sem justificar claramente o trade-off.

| Camada      | Tecnologia                                                         |
| ----------- | ------------------------------------------------------------------ |
| Monorepo    | pnpm workspaces                                                    |
| Frontend    | Next.js App Router                                                 |
| Backend/BFF | NestJS                                                             |
| Linguagem   | TypeScript strict                                                  |
| Banco       | PostgreSQL                                                         |
| ORM         | Prisma, salvo ADR contrária                                        |
| Auth        | Auth.js no Next.js + JWT validado no NestJS                        |
| UI          | Tailwind CSS + componentes próprios em `packages/ui`               |
| Validação   | Zod em `packages/types` quando fizer sentido compartilhar contrato |
| Testes      | Vitest / Testing Library / Playwright, conforme setup disponível   |
| Infra local | Docker Compose                                                     |
| CI          | GitHub Actions                                                     |

Antes de instalar qualquer pacote novo, responder:

```md
## Por que preciso deste pacote?

- Problema que resolve:
- Alternativas consideradas:
- Por que não dá para fazer com o que já existe:
- Impacto no bundle/manutenção:
```

Se não houver justificativa, não instale.

---

## 5. Estrutura de pastas esperada

A estrutura alvo do monorepo é:

```txt
.
├── apps/
│   ├── api/                         # NestJS API/BFF
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/              # config tipada/env validation
│   │   │   ├── common/              # pipes, filters, guards, interceptors genéricos
│   │   │   ├── database/            # PrismaService e infra de banco
│   │   │   └── modules/             # módulos por domínio
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
│       │   │   ├── (auth)/           # login, cadastro, callback
│       │   │   ├── (app)/            # rotas autenticadas
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
│       │   │   ├── api/              # apenas Auth.js ou endpoints muito específicos do Next
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   ├── components/           # componentes sem domínio forte, só do app web
│       │   │   ├── layout/           # AppShell, Sidebar, Topbar
│       │   │   ├── feedback/         # EmptyState, ErrorState, LoadingState
│       │   │   └── data-display/     # MetricCard, SectionHeader, Timeline
│       │   ├── features/             # features por domínio
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
│       │   ├── hooks/                # hooks reutilizáveis realmente globais
│       │   ├── lib/                  # api client, auth helpers, formatters puros
│       │   └── styles/               # tokens/css vars se não estiverem em globals
│       └── package.json
│
├── packages/
│   ├── types/                        # tipos, enums, Zod schemas e contratos compartilhados
│   │   └── src/
│   │       ├── entries/
│   │       ├── professional-moments/
│   │       ├── study/
│   │       ├── interviews/
│   │       └── shared/
│   │
│   └── ui/                           # design system reutilizável
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
├── prisma/                           # schema, migrations, seed
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
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
├── scripts/                          # scripts idempotentes do projeto
├── .github/workflows/                # CI
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── README.md
└── AGENTS.md
```

### Regra de ouro de pastas

Se algo tem domínio de produto, coloque dentro da feature/domínio correspondente.  
Se algo é primitivo visual genérico, coloque em `packages/ui`.  
Se algo é contrato compartilhado, coloque em `packages/types`.  
Se algo é regra de backend, coloque em `apps/api/src/modules/<domain>`.

---

## 6. O que vai em cada pasta

### `apps/api/src/modules/<domain>`

Cada domínio do NestJS deve seguir, sempre que fizer sentido:

```txt
modules/<domain>/
├── <domain>.module.ts
├── <domain>.controller.ts
├── <domain>.service.ts
├── <domain>.repository.ts
├── dto/
├── mappers/
├── entities/             # se necessário para tipos internos do domínio
└── tests/
```

Regras:

- controller é fino;
- service contém regra de negócio;
- repository contém acesso ao Prisma;
- DTO valida entrada/saída;
- mapper converte banco → resposta;
- módulo não deve acessar diretamente repository de outro domínio sem service público ou caso de uso claro.

### `apps/web/src/features/<domain>`

Cada feature do web deve seguir:

```txt
features/<domain>/
├── components/
├── hooks/
├── services/             # chamadas ao api client ou server actions finas
├── types/                # tipos locais da UI, não contratos globais
├── utils/                # util específico da feature
└── constants.ts
```

Regras:

- componente de feature pode conhecer o domínio;
- componente de feature não deve ser exportado como UI genérica sem motivo;
- hooks de query/mutation ficam na feature;
- transformação pesada de dados não deve ficar no JSX;
- não criar `features/shared` como lixeira.

### `packages/ui`

Use para componentes sem regra de negócio:

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
- `Toast` base, se existir

Não coloque em `packages/ui`:

- `AchievementCard`;
- `QuickCapture`;
- `ProfessionalMomentCard`;
- `StudyProgressCard`;
- `InterviewKanban`;
- qualquer componente que fale de Waypoint diretamente.

Esses ficam em `apps/web/src/features/...`.

### `packages/types`

Use para contratos compartilhados:

- enums de domínio;
- Zod schemas de entrada/saída;
- DTOs compartilhados;
- tipos de API quando usados por web e api.

Não coloque lógica de banco, React, NestJS ou Prisma aqui.

### `prisma`

Use para:

- `schema.prisma`;
- migrations geradas;
- seed local;
- scripts de reset/dev.

Nunca edite migrations antigas manualmente depois de aplicadas. Crie nova migration.

### `docs/adr`

Use para decisões arquiteturais. ADR não é decoração. Se uma decisão muda, atualize a ADR.

---

## 7. Regras de “não fazer de jeito nenhum”

Estas regras são obrigatórias.

### Produto e escopo

- Não transformar o Waypoint em todo list genérico.
- Não implementar IA na v1 sem issue explícita e ADR.
- Não criar feature avançada antes da fundação e Entry core estarem estáveis.
- Não criar telas só com dados mockados e considerar pronto.
- Não criar dashboard cheio de métricas sem ação clara.
- Não adicionar gamificação, ranking, rede social ou compartilhamento público na v1.
- Não misturar saúde clínica/terapia com energia profissional. O termômetro é apenas profissional e leve.

### Arquitetura

- Não criar lógica de negócio dentro de componente React.
- Não criar lógica de negócio dentro de controller NestJS.
- Não acessar Prisma diretamente pelo frontend.
- Não duplicar regra de negócio no Next e no Nest.
- Não criar `utils.ts` gigante.
- Não criar store global monolítica para tudo.
- Não salvar dados de servidor em Zustand/localStorage como fonte de verdade.
- Não criar tipos duplicados quando eles podem vir de `packages/types` ou Prisma.
- Não criar abstração com apenas um uso real.
- Não refatorar arquitetura inteira durante uma issue pequena.

### Segurança e dados

- Não confiar em `userId` vindo do client.
- Não retornar dados de outra usuária.
- Não logar token, senha, JWT, cookies, e-mail completo ou dados pessoais sensíveis.
- Não salvar token em localStorage.
- Não commitar `.env`, secrets, chaves ou credenciais.
- Não expor stack trace em response de produção.
- Não ignorar autorização em rotas de update/delete.

### Banco

- Não editar migration aplicada manualmente.
- Não criar tabela de domínio sem `userId`, salvo tabela global justificada.
- Não fazer hard delete por padrão em dados de domínio, salvo fluxo explícito.
- Não usar JSONB como atalho para evitar modelagem sem ADR.
- Não remover campos/tabelas sem migration e sem ajustar consumers.

### Frontend

- Não usar `any` para calar TypeScript.
- Não usar `// @ts-ignore` sem explicação e issue de follow-up.
- Não criar Client Component se Server Component resolve.
- Não remover focus outline sem substituir por focus visível.
- Não deixar tela sem empty/loading/error quando busca dados.
- Não usar texto hardcoded em inglês na UI, exceto termos técnicos inevitáveis.
- Não usar cores arbitrárias sem token quando o token existe.
- Não usar componente de design system para regra de domínio.

### Testes e qualidade

- Não remover teste para passar build sem explicar.
- Não pular lint/typecheck se o comando existe.
- Não deixar `console.log` solto.
- Não engolir erro com `catch {}` vazio.
- Não finalizar issue dizendo que está pronto se não rodou validação ou não explicou por que não rodou.

---

## 8. Domínios do produto

### 8.1 Auth e usuário

Responsável por:

- login/cadastro;
- sessão persistente;
- perfil;
- timezone;
- preferências de tema;
- status profissional editável.

Regras:

- `userId` sempre vem da sessão.
- APIs protegidas exigem autenticação.
- Não retornar hash de senha.

### 8.2 Entry core

`Entry` é o core do produto.

Tipos previstos:

- `learning` — aprendizado;
- `achievement` — conquista;
- `question` — dúvida;
- `task` — tarefa;
- `link` — link útil;
- `study_log` — registro de estudo;
- `decision` — decisão técnica;
- `feedback` — feedback recebido.

Modelo sugerido:

- tabela base `entries`;
- tabelas específicas por subtipo;
- relação 1:1 entre `entries` e subtipo;
- tags por relação N:N;
- vínculo opcional com momento profissional, projeto, entrevista ou estudo.

Não trocar para JSONB sem ADR.

### 8.3 Momento profissional

`ProfessionalMoment` é contexto, não Entry.

Campos esperados:

- empresa;
- projeto;
- papel;
- fase: onboarding, ramp-up, cruzeiro, transição;
- objetivo da semana;
- principal desafio;
- próxima ação recomendada;
- data início;
- data fim.

Regras:

- apenas um momento ativo por usuária;
- momento ativo tem `endedAt = null`;
- ao criar novo momento ativo, encerrar anterior ou impedir criação;
- entries podem se vincular ao momento ativo.

### 8.4 Hoje

Responsável por tarefas profissionais do dia.

Regras:

- listar tarefas com `dueDate` hoje;
- permitir concluir/desconcluir;
- prioridade discreta;
- categoria clara;
- não virar uma lista infinita sem foco.

### 8.5 Work Log

Timeline consultável de:

- aprendizados;
- decisões técnicas;
- estudos;
- problemas resolvidos;
- registros relevantes do dia.

Agrupar por data. Deve ser fácil responder: “o que eu fiz/aprendi essa semana?”.

### 8.6 Estudos

Entidades:

- `StudyTrail`;
- `StudyResource`;
- `StudyProgress`;
- `StudyLog`.

Regras:

- recurso pode ser curso, vídeo, livro, artigo, documentação ou exercício;
- progresso pode ser manual;
- timer é opcional;
- estudos de hoje devem priorizar recursos em andamento.

### 8.7 Dúvidas

Dúvida é subtipo de Entry, mas tem tela própria.

Status:

- `open` / Aberta;
- `needs_validation` / Precisa validar;
- `answered` / Respondida.

Ao responder uma dúvida, pode criar aprendizado vinculado.

### 8.8 Conquistas / Brag Document

Conquista é subtipo central.

Campos importantes:

- título;
- contexto;
- ação;
- resultado;
- tipo: onboarding, técnica, processo, liderança, comunicação;
- impacto: autonomia, clareza, performance, documentação, produtividade, qualidade;
- tecnologias;
- momento vinculado;
- flags: usar em entrevista, currículo, LinkedIn.

Não modelar conquista como simples nota. Ela precisa virar evidência profissional.

### 8.9 Links úteis

Campos:

- URL;
- título;
- categoria;
- tags;
- revisado/a revisar;
- vínculo opcional com trilha, projeto ou momento.

### 8.10 Projetos

Campos:

- nome;
- descrição;
- stack;
- status: ativo, pausado, arquivado;
- entries vinculadas;
- decisões técnicas vinculadas.

### 8.11 Skills

Campos:

- nome;
- categoria;
- nível atual 1–5;
- nível objetivo 1–5;
- notas;
- histórico de evolução.

Não usar skill como métrica para gerar culpa. A UX deve mostrar evolução.

### 8.12 Entrevistas

Entidades:

- processo;
- etapa;
- feedback;
- versão de currículo;
- requisitos da vaga.

Regras:

- feedback pode virar aprendizado;
- requisito pode ser `atendo`, `parcial`, `não atendo`;
- processo tem status claro.

### 8.13 Review semanal

Uma review por semana.

Deve consolidar:

- o que aconteceu;
- o que aprendi;
- o que ficou pendente;
- principais conquistas;
- foco da próxima semana;
- contadores automáticos de entries por tipo.

### 8.14 Foco da semana

Widget do dashboard com:

- título;
- descrição;
- checklist.

Ao final da semana, pode ser consolidado na review.

### 8.15 Energia profissional

Termômetro profissional, não clínico.

Níveis:

- confiante;
- neutra;
- perdida;
- sobrecarregada.

Permite nota curta, exemplo: “Perdida, mas avançando”.

### 8.16 Busca, tags e filtros

Deve permitir encontrar qualquer coisa em segundos.

- tags globais;
- filtros por tipo/status/data;
- busca full-text em Entries, Momentos e Processos;
- Cmd+K opcional.

---

## 9. Roadmap por sprint

### Sprint 0 — Fundação

Foco: infraestrutura, sem feature profunda de produto.

Entregável: app roda local, login funciona, sidebar aparece, tema alterna.

Issues:

- monorepo com pnpm workspaces;
- Docker Compose com Postgres 16, API e Web;
- setup base do NestJS;
- setup base do Next.js com App Router, Tailwind e tema;
- Prisma schema base;
- Auth.js no Next + JWT guard no NestJS;
- CI com lint, typecheck e test;
- design system mínimo em `packages/ui`;
- dashboard shell com sidebar;
- ADR-001, ADR-002, ADR-003, ADR-004.

### Sprint 1 — Registro / Entry core

Entregável: registrar aprendizado, dúvida, tarefa ou link pelo dashboard e visualizar na listagem.

### Sprint 2 — Hoje + Work Log

Entregável: dashboard mostra tarefas do dia e work log vira diário profissional.

### Sprint 3 — Momento Atual

Entregável: dashboard mostra contexto profissional real e editável.

### Sprint 4 — Estudos

Entregável: trilhas, recursos, progresso e estudos do dia.

### Sprint 5 — Dúvidas

Entregável: dúvidas abertas com status e vínculo ao momento atual.

### Sprint 6 — Conquistas + Links

Entregável: brag document inicial e links organizados.

### Sprint 7 — Projetos + Skills

Entregável: projetos, skills e evolução técnica.

### Sprint 8 — Entrevistas parte 1

Entregável: processos seletivos e etapas.

### Sprint 9 — Entrevistas parte 2

Entregável: currículos, requisitos da vaga e vínculo processo × currículo.

### Sprint 10 — Review semanal + Foco + Energia

Entregável: ritual semanal de revisão profissional.

### Sprint 11 — Busca, tags e filtros

Entregável: encontrar qualquer informação rapidamente.

### Sprint 12 — Polimento

Entregável: v1 em produção com empty states, toasts, tour inicial, README e deploy.

---

## 10. ADRs obrigatórias

Escreva ou atualize ADRs em `docs/adr`.

ADRs da Sprint 0:

- `ADR-001-entry-model.md`
- `ADR-002-orm.md`
- `ADR-003-monorepo.md`
- `ADR-004-auth.md`

Template:

```md
# ADR-000 — Título

## Status

Proposta | Aceita | Substituída

## Contexto

Explique o problema e as forças envolvidas.

## Opções consideradas

- Opção A
- Opção B

## Decisão

Explique a escolha.

## Consequências

- Positivas
- Negativas
- Trade-offs
```

Não implemente solução contrária à ADR aceita sem atualizar a ADR.

---

## 11. Backend guidelines — NestJS

### Controllers

Controllers devem:

- validar sessão/autorização;
- receber parâmetros;
- validar input;
- chamar service;
- retornar resposta.

Controllers não devem:

- conter regra de negócio;
- montar query Prisma complexa;
- decidir lógica de domínio;
- fazer transformação pesada.

### Services

Services devem:

- concentrar regra de negócio;
- orquestrar repositories;
- aplicar regras de autorização quando ligadas ao domínio;
- ser testáveis.

### Repositories

Repositories devem:

- ser a única camada que fala diretamente com Prisma;
- sempre filtrar por `userId` em dados de domínio;
- não retornar dados sensíveis desnecessários;
- não conter regra complexa de produto.

### DTOs e validação

- Valide input no backend sempre.
- Se schema for compartilhado com frontend, use `packages/types`.
- Rejeite input inválido com erro estruturado.

Envelope sugerido:

```ts
{
  data: T;
}
```

Erro sugerido:

```ts
{
  error: {
    code: string;
    message: string;
    details?: unknown;
  }
}
```

### Status HTTP

- `200` leitura/atualização OK;
- `201` criação OK;
- `204` delete sem body;
- `400` request malformada;
- `401` não autenticado;
- `403` sem permissão;
- `404` recurso não encontrado;
- `422` validação de input;
- `500` erro inesperado sem detalhes sensíveis.

### Rotas REST esperadas

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

### Server Components por padrão

Use Server Components quando:

- a tela apenas carrega dados;
- não há estado local interativo;
- não usa browser API;
- não usa eventos do usuário.

Use Client Components quando:

- há formulário interativo;
- há filtros client-side;
- há modal/dropdown controlado;
- há drag and drop;
- há estado local;
- há React Query ou mutation.

Marque `"use client"` no menor componente possível, nunca na página inteira sem necessidade.

### Organização de páginas

Páginas em `app/` devem ser finas. Elas podem:

- montar layout;
- buscar dados iniciais;
- chamar componentes de feature;
- definir metadata.

Páginas não devem:

- conter JSX gigante;
- conter regra de domínio;
- conter transformação complexa;
- fazer fetch espalhado sem camada.

### API client

Centralize chamadas HTTP em:

```txt
apps/web/src/lib/api/
```

ou em services por feature:

```txt
features/entries/services/entries-api.ts
```

Não espalhe `fetch()` bruto por vários componentes.

### Estado

Use estado local para UI simples.  
Use query/mutation library se o projeto já tiver uma.  
Não duplique dados do servidor em store global.

### Formulários

- Validação client-side melhora UX, mas backend é a fonte final.
- Erros devem aparecer perto do campo.
- Submit deve ter loading.
- Não limpar formulário se a request falhar.

### Listas e tabelas

- Toda lista com dados remotos precisa de loading, error e empty.
- Listas grandes devem ter paginação ou virtualização.
- Filtros importantes devem poder ficar na URL quando fizer sentido.

### Acessibilidade

Obrigatório:

- labels em inputs;
- botões com texto acessível;
- focus visível;
- navegação por teclado;
- contraste adequado;
- `aria-describedby` para erro de campo;
- modais com focus trap.

---

## 13. Design system e UI

O design deve ser:

- limpo;
- profissional;
- calmo;
- útil;
- com hierarquia visual clara;
- com poucos elementos decorativos;
- com cards funcionais, não cards aleatórios.

Referências visuais:

- Linear;
- Raycast;
- Notion;
- Cron Calendar;
- Height;
- Arc Browser;
- Superhuman.

Paleta base sugerida:

```txt
Background: #F8FAFC ou #FAFAFB
Surface: #FFFFFF
Text primary: #111827
Text secondary: #6B7280
Primary: #7C6FF7
Primary dark: #5B4FE8
Border: #E5E7EB
Success soft: verde suave
Warning soft: amarelo suave
Danger: vermelho apenas para alerta real
```

### Componentes mínimos da Sprint 0

Em `packages/ui`:

- `Button`
- `Input`
- `Textarea`
- `Card`
- `Badge`
- `Chip`
- `Checkbox`
- `Skeleton`
- tokens de cor;
- tokens de spacing;
- tokens de radius;
- tema light/dark com CSS variables.

### Regras de UI

- Não criar dashboard poluído.
- Não usar mais de uma cor chamativa por seção.
- Não criar componente visual sem função real.
- Não usar emoji como estrutura de interface.
- Não esconder ação principal.
- Não deixar a usuária sem próximo passo claro.

### Microcopy

Use frases como:

- “Nada importante precisa ficar só na sua cabeça.”
- “Registre agora, organize depois.”
- “O que você aprendeu hoje?”
- “Essa conquista pode virar um case de entrevista.”
- “Você não precisa entender tudo hoje. Só o próximo passo.”

Evite:

- tom infantil;
- frases motivacionais exageradas;
- linguagem clínica;
- excesso de emojis;
- inglês desnecessário na UI.

---

## 14. Banco de dados e Prisma

### Convenções

- Modelos Prisma em PascalCase.
- Campos TypeScript/Prisma em camelCase.
- Tabelas podem usar `@@map("snake_case")` se necessário.
- Toda entidade de domínio deve ter `id`, `userId`, `createdAt`, `updatedAt`.
- Use `deletedAt` em entidades principais quando fizer sentido preservar histórico.

### Regras obrigatórias

- Toda query de domínio deve filtrar por `userId`.
- Não aceitar `userId` do client.
- Não criar tabela de domínio sem FK para usuário, salvo exceção documentada.
- Não editar migration antiga aplicada.
- Não usar JSONB como desculpa para não modelar o domínio.
- Não remover dados em cascata sem entender impacto.

### Soft delete

Preferir `deletedAt` para:

- entries;
- momentos;
- projetos;
- processos seletivos;
- recursos de estudo.

Hard delete apenas em fluxo explícito de exclusão de conta ou reset local.

### Seeds

Seeds devem usar dados fictícios e realistas.  
Não colocar dados pessoais reais da usuária em seed público.

---

## 15. Autenticação e autorização

Arquitetura sugerida:

- Auth.js no Next.js;
- sessão/JWT emitido pelo Next;
- NestJS valida JWT via guard;
- `userId` extraído da sessão/token no servidor;
- frontend nunca escolhe o `userId`.

### Regras

- Toda rota privada exige autenticação.
- Toda mutação verifica propriedade do recurso.
- Nunca confiar em ids enviados pelo client para autorização.
- Ao buscar recurso por `id`, também filtrar por `userId`.

Exemplo conceitual:

```ts
findEntryById({ id, userId });
```

Nunca:

```ts
findEntryById(id);
```

---

## 16. Segurança e privacidade

O Waypoint armazena dados profissionais e pessoais sensíveis.

Nunca logar:

- senha;
- hash de senha;
- JWT;
- cookies;
- refresh token;
- e-mail completo;
- texto integral de feedback sensível;
- notas privadas;
- dados de saúde/energia profissional;
- secrets.

### LocalStorage

Não use localStorage para:

- token;
- sessão;
- dados sensíveis;
- entries;
- conquistas;
- feedbacks;
- entrevistas;
- energia profissional.

LocalStorage pode ser usado apenas para UI efêmera não sensível, como preferência visual local, se não houver alternativa melhor.

### Env

- `.env` nunca deve ser commitado.
- `.env.example` deve conter nomes de variáveis sem valores reais.
- Validar envs na inicialização quando possível.

### Erros

- Em produção, respostas não devem vazar stack trace.
- Mensagens para usuário devem ser claras, mas não revelar detalhes internos.

---

## 17. IA — regra para v1

IA está fora da v1.

Não implemente:

- chat com IA;
- resumo automático;
- sugestão automática de estudos;
- classificação automática de entries;
- embeddings;
- comparação automática com vaga;
- geração automática de currículo.

Pode preparar o modelo de dados para export ou uso futuro, mas sem integrar LLM.

Quando IA entrar no futuro:

- precisará de ADR própria;
- precisará de consentimento explícito;
- não poderá alterar dados sem confirmação;
- deverá tratar conteúdo da usuária como dado, não instrução;
- deverá ter testes com modelo mockado.

---

## 18. Testes

Priorize testes onde há risco real:

- isolamento por usuário;
- criação/listagem de entries;
- troca de status de tarefa;
- regra de um momento ativo por vez;
- vínculo de conquista com momento;
- filtros e busca;
- autenticação/autorização;
- componentes de captura rápida;
- forms críticos.

### Unit tests

Use para:

- regras puras;
- mappers;
- validators;
- formatadores;
- cálculo de contadores semanais.

### Integration tests

Use para:

- service + repository;
- Prisma com banco de teste;
- autorização por usuário;
- fluxos de criação/listagem.

### Component tests

Use para:

- design system;
- forms;
- cards de dashboard;
- estados empty/loading/error.

### E2E

Fluxos críticos:

1. login;
2. abrir dashboard;
3. registrar uma Entry;
4. ver Entry na listagem;
5. concluir tarefa de hoje;
6. criar momento profissional;
7. registrar conquista;
8. abrir brag document.

### Regra de regressão

Bug corrigido deve virar teste quando possível.

---

## 19. Comandos esperados

Antes de assumir comando, verifique `package.json`.

Comandos desejados:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Banco:

```bash
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:seed
```

Se um comando não existir e a issue pedir setup, crie o script no `package.json` adequado.

Antes de finalizar uma alteração, rode o máximo possível:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se não rodar, explique o motivo.

---

## 20. Workflow do agente

Ao receber uma tarefa:

1. Identifique a sprint e o domínio.
2. Leia a issue/pedido completo.
3. Leia arquivos relevantes.
4. Verifique ADRs relacionadas.
5. Faça um plano curto antes de mudanças grandes.
6. Implemente a menor alteração completa.
7. Não altere arquivos fora de escopo sem necessidade.
8. Atualize testes e documentação se o contrato mudou.
9. Rode validações.
10. Finalize com resumo objetivo.

### Final response esperada após implementação

```md
## O que foi feito

- ...

## Arquivos alterados

- `path/file.ts` — motivo

## Validações

- `pnpm lint` ✅
- `pnpm typecheck` ✅
- `pnpm test` não rodei porque ...

## Observações

- Risk: ...
- Decision Needed: ...
- Future: ...
```

---

## 21. Git, branches e commits

### Branches

Formato sugerido:

```txt
sprint-0/setup-monorepo
sprint-0/docker-compose
sprint-0/auth-foundation
sprint-1/entry-core
sprint-2/today-work-log
```

### Commits

Use Conventional Commits simples:

```txt
feat: configure pnpm workspace
feat(api): add entries module
feat(web): add quick capture component
fix(api): enforce user filter on entries
chore: add lint workflow
docs: add ADR for entry model
test: cover active professional moment rule
```

### Não misturar no mesmo commit

- feature + refactor grande;
- schema + redesign;
- auth + dashboard complexo;
- lint massivo + alteração funcional;
- dependência nova + várias features.

---

## 22. Issues e labels

Use issues pequenas e rastreáveis.

Labels esperadas:

- `sprint-0` até `sprint-12`;
- `domain:auth`, `domain:entry`, `domain:study`, `domain:achievement`, `domain:interview`;
- `stack:api`, `stack:web`, `stack:db`, `stack:infra`, `stack:ui`;
- `type:feature`, `type:bug`, `type:docs`, `type:adr`, `type:refactor`, `type:test`;
- `priority:critical`, `priority:high`, `priority:normal`, `priority:low`.

Template:

```md
## Contexto

Por que essa issue existe e qual problema resolve.

## Escopo

- [ ] Item concreto
- [ ] Item concreto

## Fora do escopo

- O que não entra agora

## Critérios de aceite

- Dado que...
- Quando...
- Então...

## Notas técnicas

- Endpoint:
- Componentes:
- Schema:
- Testes:
```

---

## 23. Qualidade de código

### TypeScript

- `strict` ligado.
- Não usar `any` sem justificativa.
- Preferir tipos explícitos nas bordas.
- Usar inferência dentro de funções quando claro.
- Não usar `as unknown as` para forçar tipo.

### Funções

- Funções pequenas.
- Nome que explica intenção.
- Evitar boolean trap com muitos booleans.
- Preferir objeto de parâmetros quando função cresce.

### Componentes

- Componentes pequenos e coesos.
- Props tipadas.
- Evitar componente com 300 linhas.
- Separar container/data fetching de apresentação quando melhorar clareza.

### Erros

- Tratar erros previsíveis.
- Não engolir erro silenciosamente.
- Usar mensagens úteis.
- Log estruturado no backend sem dados sensíveis.

---

## 24. Performance

Não otimizar cedo, mas evitar decisões ruins.

- Não buscar lista gigante sem paginação.
- Não recalcular transformação pesada no render sem necessidade.
- Não colocar tudo como Client Component.
- Não carregar biblioteca pesada sem justificar.
- Não renderizar gráficos complexos sem fallback.
- Não fazer N+1 queries no backend.

Use paginação/filtros para:

- entries;
- work log;
- links;
- entrevistas;
- skills history.

---

## 25. Observabilidade mínima

Mesmo em side project, registre:

- erro de API com request id;
- falhas de autenticação sem dados sensíveis;
- falhas de validação agregadas quando útil;
- tempo de endpoints críticos se houver infra para isso.

Não implementar observabilidade avançada antes da fundação, salvo issue específica.

---

## 26. Definição de pronto

Uma issue só está pronta quando:

- compila;
- lint passa ou falha está documentada;
- typecheck passa ou falha está documentada;
- teste relevante foi criado/atualizado quando aplicável;
- fluxo principal foi validado manualmente ou por teste;
- UI tem loading/error/empty quando busca dados;
- dados são filtrados por usuário autenticado;
- documentação/ADR foi atualizada quando contrato mudou;
- não há alteração fora de escopo;
- não há `console.log`, `any` injustificado ou TODO vago.

---

## 27. Prioridade atual

No começo do projeto, priorize a Sprint 0:

1. monorepo;
2. Docker Compose;
3. NestJS base;
4. Next.js base;
5. Prisma base;
6. Auth;
7. CI;
8. design system mínimo;
9. dashboard shell;
10. ADRs.

Não pule para features avançadas antes disso.

---

## 28. Modo mentoria sênior

Este projeto também serve para evolução técnica da usuária. O agente deve atuar como mentor sênior.

Comportamentos esperados:

- explicar trade-offs;
- apontar riscos;
- sugerir alternativas;
- separar `Risk`, `Decision Needed` e `Future`;
- não decidir arquitetura silenciosamente;
- ensinar o padrão usado;
- sugerir testes relevantes;
- ajudar a transformar decisão técnica em explicação de PR/entrevista.

Sinalização:

- `Risk` — pode quebrar produção, segurança, performance ou gerar dívida.
- `Decision Needed` — escolha arquitetural/produto precisa de validação.
- `Future` — melhoria válida, mas fora do escopo atual.

---

## 29. Lembrete final

O Waypoint deve ajudar a usuária a ganhar clareza sobre carreira, estudos, entregas e evolução profissional.

Sempre que houver dúvida entre uma solução chamativa e uma solução clara, escolha a solução clara.

Sempre que houver dúvida entre uma abstração sofisticada e uma implementação simples que funciona, escolha a simples.

Sempre que uma feature puder virar só mais ruído, pare e pergunte: “isso ajuda a usuária a saber o próximo passo?”
