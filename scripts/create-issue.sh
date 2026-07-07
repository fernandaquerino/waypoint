#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# CareerOS — Criar labels, milestones e issues no GitHub
# Repositório: fernandaquerino/waypoint
# Project ID: 7
#
# Pré-requisitos:
#   gh auth login
#   gh extension install github/gh-projects (se necessário)
#
# Uso:
#   chmod +x create-issues.sh
#   ./create-issues.sh
# ============================================================

REPO="fernandaquerino/waypoint"
OWNER="fernandaquerino"
PROJECT_ID="7"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${YELLOW}→${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }

# Valida pré-requisitos antes de criar qualquer coisa
validate_environment() {
  command -v gh >/dev/null 2>&1 || {
    fail "GitHub CLI não encontrado. Instale com: brew install gh"
    exit 1
  }

  gh auth status >/dev/null 2>&1 || {
    fail "Você precisa autenticar com: gh auth login"
    exit 1
  }

  gh repo view "$REPO" >/dev/null 2>&1 || {
    fail "Repositório não encontrado ou sem permissão: $REPO"
    exit 1
  }
}

# Cria label de forma idempotente — se já existir, não falha
create_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  local existing
  existing=$(LABEL_NAME="$name" gh label list \
    --repo "$REPO" \
    --search "$name" \
    --json name \
    --jq '.[] | select(.name == env.LABEL_NAME) | .name' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Label já existe: $name"
    return
  fi

  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" \
    >/dev/null 2>&1

  log "Label criada: $name"
}

# Cria milestone de forma idempotente — se já existir, não duplica
create_milestone() {
  local title="$1"
  local description="${2:-}"

  local existing
  existing=$(MILESTONE_TITLE="$title" gh api "repos/$REPO/milestones?state=all" \
    --jq '.[] | select(.title == env.MILESTONE_TITLE) | .title' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing" ]; then
    info "Milestone já existe: $title"
    return
  fi

  if [ -n "$description" ]; then
    gh api "repos/$REPO/milestones" \
      --method POST \
      -f title="$title" \
      -f description="$description" \
      -f state="open" \
      >/dev/null 2>&1
  else
    gh api "repos/$REPO/milestones" \
      --method POST \
      -f title="$title" \
      -f state="open" \
      >/dev/null 2>&1
  fi

  log "Milestone criado: $title"
}

# Cria issue e adiciona ao projeto.
# Proteção contra duplicação: se já existir uma issue com o mesmo título, não cria de novo.
create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  local milestone="$4"

  local existing_issue_url
  existing_issue_url=$(TITLE="$title" gh issue list \
    --repo "$REPO" \
    --state all \
    --limit 300 \
    --json title,url \
    --jq '.[] | select(.title == env.TITLE) | .url' \
    2>/dev/null | head -n 1 || true)

  if [ -n "$existing_issue_url" ]; then
    info "Issue já existe, pulando → $existing_issue_url"
    return
  fi

  info "Criando: $title"

  local issue_url
  if issue_url=$(gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    --milestone "$milestone" \
    2>/dev/null); then
    log "Criada → $issue_url"

    # Adicionar ao project board. Se falhar, não interrompe a criação das issues.
    if ! gh project item-add "$PROJECT_ID" --owner "$OWNER" --url "$issue_url" >/dev/null 2>&1; then
      info "Não foi possível adicionar ao Project $PROJECT_ID automaticamente. Verifique permissões/extensão gh-projects."
    fi
  else
    fail "Erro ao criar: $title"
  fi

  sleep 0.4  # evitar rate limit
}

validate_environment

# ============================================================
# Criar labels
# ============================================================
info "Criando labels..."

# Stack / área técnica
create_label "frontend"      "0075ca" "Frontend / UI"
create_label "backend"       "e4e669" "Backend / API"
create_label "ai"            "7057ff" "Camada de IA"
create_label "database"      "0e8a16" "Banco de dados / Schema"
create_label "design-system" "d93f0b" "Design System / UI Foundation"
create_label "security"      "b60205" "Segurança / Privacidade"
create_label "testing"       "0075ca" "Testes"
create_label "docs"          "cfd3d7" "Documentação"
create_label "infra"         "e4e669" "Infraestrutura / CI/CD"
create_label "settings"      "5319e7" "Configurações / Conta"
create_label "integrations"  "1d76db" "Integrações externas / Webhooks"

# Domínios de produto
create_label "domain:auth"         "5319e7" "Domínio de autenticação e usuário"
create_label "domain:entry"        "7C6FF7" "Domínio principal de registros / entries"
create_label "domain:dashboard"    "1d76db" "Dashboard e visão geral"
create_label "domain:career"       "fbca04" "Momento profissional e carreira"
create_label "domain:work-log"     "0e8a16" "Diário profissional / work log"
create_label "domain:study"        "0969da" "Estudos, trilhas e recursos"
create_label "domain:questions"    "d4c5f9" "Dúvidas abertas e respostas"
create_label "domain:achievements" "f9d0c4" "Conquistas e brag document"
create_label "domain:links"        "bfdadc" "Links úteis e recursos salvos"
create_label "domain:projects"     "c5def5" "Projetos profissionais e pessoais"
create_label "domain:skills"       "c2e0c6" "Skills e evolução"
create_label "domain:interviews"   "fef2c0" "Processos seletivos e entrevistas"
create_label "domain:review"       "fef2c0" "Review semanal, foco e energia"

# Camada / localização da mudança
create_label "stack:web"     "0075ca" "Next.js / aplicação web"
create_label "stack:api"     "e4e669" "NestJS / API"
create_label "stack:db"      "0e8a16" "Banco, Prisma e migrations"
create_label "stack:infra"   "5319e7" "Infraestrutura, Docker, CI/CD"
create_label "stack:shared"  "bfdadc" "Pacotes compartilhados"
create_label "stack:ui"      "d93f0b" "Biblioteca de UI / design system"

# Tipo de trabalho
create_label "type:feature"  "0e8a16" "Nova funcionalidade"
create_label "type:chore"    "cfd3d7" "Configuração, manutenção ou tarefa técnica"
create_label "type:refactor" "fbca04" "Refatoração sem mudança funcional"
create_label "type:docs"     "cfd3d7" "Documentação"
create_label "type:adr"      "7057ff" "Architecture Decision Record"
create_label "type:test"     "0075ca" "Testes automatizados"

# Prioridade
create_label "priority:critical" "b60205" "Essencial para seguir o projeto"
create_label "priority:high"     "d93f0b" "Alta prioridade"
create_label "priority:normal"   "fbca04" "Prioridade normal"
create_label "priority:low"      "cfd3d7" "Baixa prioridade"

# Sprints
for sprint in {0..12}; do
  create_label "sprint-$sprint" "7C6FF7" "Issue planejada para a Sprint $sprint"
done

log "Labels criadas."

# ============================================================
# Criar milestones
# ============================================================
info "Criando milestones..."

create_milestone "Sprint 0 - Fundação" "Infraestrutura base, monorepo, Docker, apps iniciais, auth, CI, design system mínimo e ADRs."
create_milestone "Sprint 1 - Registro Core" "Captura rápida e CRUD base de registros/entries."
create_milestone "Sprint 2 - Hoje + Work Log" "Tarefas do dia e diário profissional."
create_milestone "Sprint 3 - Momento Atual" "Contexto profissional ativo e histórico de momentos."
create_milestone "Sprint 4 - Estudos" "Trilhas, recursos, progresso e estudos de hoje."
create_milestone "Sprint 5 - Dúvidas" "Dúvidas abertas, status, respostas e vínculos."
create_milestone "Sprint 6 - Conquistas + Links" "Brag document, conquistas e links úteis."
create_milestone "Sprint 7 - Projetos + Skills" "Projetos, skills e evolução."
create_milestone "Sprint 8 - Entrevistas parte 1" "Processos seletivos, etapas e feedbacks."
create_milestone "Sprint 9 - Entrevistas parte 2" "Currículos, requisitos de vaga e vínculos."
create_milestone "Sprint 10 - Review + Foco + Energia" "Review semanal, foco da semana e energia profissional."
create_milestone "Sprint 11 - Busca + Tags + Filtros" "Busca global, tags polimórficas e filtros salvos."
create_milestone "Sprint 12 - Polimento + Deploy" "Empty states, toasts, onboarding, README, documentação e deploy."

log "Milestones criados."

# ============================================================
# Criar issues da Sprint 0
# ============================================================
info "Criando issues da Sprint 0..."

SPRINT_0_MILESTONE="Sprint 0 - Fundação"

create_issue "[S0-01] Configurar monorepo com pnpm workspaces" "$(cat <<'EOF'
## Contexto
O CareerOS será desenvolvido como um monorepo para manter web, API, tipos compartilhados e UI no mesmo repositório.

Essa base precisa permitir evoluir o produto com organização desde o início, evitando duplicação de tipos e componentes.

## Escopo
- [ ] Criar estrutura de pastas `apps/api`
- [ ] Criar estrutura de pastas `apps/web`
- [ ] Criar estrutura de pastas `packages/types`
- [ ] Criar estrutura de pastas `packages/ui`
- [ ] Configurar `pnpm-workspace.yaml`
- [ ] Configurar `package.json` raiz com scripts úteis
- [ ] Garantir que `pnpm install` funcione na raiz
- [ ] Garantir que cada app/pacote tenha seu próprio `package.json`

## Fora do escopo
- Implementar features de produto
- Criar telas completas
- Configurar deploy

## Critério de aceite
- [ ] Dado que clonei o repositório, quando rodo `pnpm install`, então as dependências são instaladas corretamente
- [ ] Dado que estou na raiz do projeto, quando rodo scripts do monorepo, então consigo acionar web, API e pacotes compartilhados
- [ ] A estrutura final contém `apps/api`, `apps/web`, `packages/types` e `packages/ui`

## Notas técnicas
- Usar pnpm workspaces
- Manter nomes de pacotes claros, por exemplo:
  - `@career-os/api`
  - `@career-os/web`
  - `@career-os/types`
  - `@career-os/ui`
EOF
)" "sprint-0,type:chore,priority:critical,infra,stack:infra" "$SPRINT_0_MILESTONE"

create_issue "[S0-02] Configurar Docker Compose com Postgres 16, API e Web" "$(cat <<'EOF'
## Contexto
O projeto precisa rodar localmente de forma previsível, com banco PostgreSQL e serviços preparados para desenvolvimento fullstack.

## Escopo
- [ ] Criar `docker-compose.yml`
- [ ] Adicionar serviço `postgres` usando PostgreSQL 16
- [ ] Configurar volume persistente do banco
- [ ] Configurar variáveis de ambiente do banco
- [ ] Preparar serviço da API NestJS
- [ ] Preparar serviço da Web Next.js
- [ ] Documentar comandos básicos para subir e derrubar o ambiente

## Fora do escopo
- Deploy em produção
- Configuração avançada de rede
- Observabilidade

## Critério de aceite
- [ ] Dado que rodo `docker compose up`, então o Postgres sobe corretamente
- [ ] Dado que a API e a Web estão configuradas, então os serviços conseguem ser iniciados em ambiente local
- [ ] O banco mantém dados entre reinícios via volume

## Notas técnicas
- Postgres 16
- Portas sugeridas:
  - Web: `3000`
  - API: `3333`
  - Postgres: `5432`
- Criar `.env.example` com as variáveis necessárias
EOF
)" "sprint-0,type:chore,priority:critical,infra,database,stack:infra,stack:db" "$SPRINT_0_MILESTONE"

create_issue "[S0-03] Criar setup base do NestJS" "$(cat <<'EOF'
## Contexto
A API será responsável por regras de negócio, autenticação validada por JWT, acesso ao banco e endpoints do produto.

Antes das features, precisamos de uma base sólida do NestJS.

## Escopo
- [ ] Criar app NestJS em `apps/api`
- [ ] Configurar `ConfigModule`
- [ ] Criar endpoint `GET /health`
- [ ] Criar filtro global de erro
- [ ] Criar configuração base de CORS
- [ ] Criar estrutura inicial de módulos
- [ ] Configurar validação global, se aplicável

## Fora do escopo
- CRUD de entries
- Auth completa
- Prisma completo

## Critério de aceite
- [ ] Dado que a API está rodando, quando acesso `GET /health`, então recebo status de sucesso
- [ ] A API carrega variáveis de ambiente corretamente
- [ ] Erros têm formato minimamente padronizado

## Notas técnicas
- App em `apps/api`
- Porta local sugerida: `3333`
- Endpoint: `GET /health`
EOF
)" "sprint-0,type:chore,priority:critical,backend,stack:api" "$SPRINT_0_MILESTONE"

create_issue "[S0-04] Criar setup base do Next.js com App Router, Tailwind e tema" "$(cat <<'EOF'
## Contexto
A aplicação web será a interface principal do CareerOS. A base precisa começar com App Router, Tailwind e suporte a tema para que o design system nasça em código.

## Escopo
- [ ] Criar app Next.js em `apps/web`
- [ ] Configurar App Router
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar CSS variables para tema
- [ ] Criar tema light inicial
- [ ] Preparar alternância light/dark de forma simples
- [ ] Criar layout raiz da aplicação

## Fora do escopo
- Dashboard completo
- Componentes finais de produto
- Autenticação completa

## Critério de aceite
- [ ] Dado que rodo o app web, quando acesso a home, então vejo uma página renderizada
- [ ] Tailwind funciona no projeto
- [ ] CSS variables estão disponíveis globalmente
- [ ] O projeto está pronto para receber componentes do `packages/ui`

## Notas técnicas
- App em `apps/web`
- Usar App Router
- Tema pode começar simples, sem polimento visual profundo
EOF
)" "sprint-0,type:chore,priority:critical,frontend,stack:web" "$SPRINT_0_MILESTONE"

create_issue "[S0-05] Configurar Prisma com schema base de usuário" "$(cat <<'EOF'
## Contexto
O CareerOS usará PostgreSQL como banco principal. A Sprint 0 precisa deixar o Prisma pronto para migrations futuras e para autenticação.

## Escopo
- [ ] Instalar e configurar Prisma
- [ ] Configurar conexão com PostgreSQL
- [ ] Criar `schema.prisma`
- [ ] Criar model `User`
- [ ] Criar migration inicial
- [ ] Criar script para rodar migrations
- [ ] Criar script para abrir Prisma Studio

## Fora do escopo
- Modelagem completa de entries
- Study trails
- Entrevistas
- Tags polimórficas

## Critério de aceite
- [ ] Dado que o Postgres está rodando, quando executo a migration, então a tabela de usuários é criada
- [ ] Prisma consegue conectar no banco local
- [ ] Prisma Studio abre sem erro

## Notas técnicas
- Banco: PostgreSQL 16
- ORM sugerido pelo mapa do produto: Prisma
- Model inicial pode conter:
  - `id`
  - `name`
  - `email`
  - `image`
  - `createdAt`
  - `updatedAt`
EOF
)" "sprint-0,type:chore,priority:critical,database,stack:db" "$SPRINT_0_MILESTONE"

create_issue "[S0-06] Implementar Auth.js no Next.js e JWT Guard no NestJS" "$(cat <<'EOF'
## Contexto
O app precisa ter login real desde o começo. A decisão sugerida é usar Auth.js no Next.js emitindo JWT, enquanto o NestJS valida esse token com um guard.

## Escopo
- [ ] Configurar Auth.js no Next.js
- [ ] Criar fluxo inicial de login
- [ ] Configurar estratégia JWT
- [ ] Criar provider inicial de autenticação
- [ ] Criar guard JWT no NestJS
- [ ] Proteger rota de teste na API
- [ ] Validar comunicação Web → API com token

## Fora do escopo
- Recuperação de senha
- OAuth completo se atrasar a Sprint 0
- RBAC avançado
- Perfil completo

## Critério de aceite
- [ ] Dado que estou logada, quando chamo uma rota protegida da API, então a API aceita o token
- [ ] Dado que não estou logada, quando chamo a rota protegida, então recebo erro de não autorizado
- [ ] Sessão persiste no app web

## Notas técnicas
- ADR-004 deve documentar essa decisão
- Se OAuth atrasar, começar com credenciais ou provider simples
- Evitar acoplar regra de produto nessa etapa
EOF
)" "sprint-0,type:feature,priority:critical,security,backend,frontend,domain:auth,stack:web,stack:api" "$SPRINT_0_MILESTONE"

create_issue "[S0-07] Configurar CI com lint, typecheck e test" "$(cat <<'EOF'
## Contexto
Como o objetivo é treinar fullstack com padrão profissional, o repositório precisa validar qualidade mínima automaticamente desde o início.

## Escopo
- [ ] Criar workflow do GitHub Actions
- [ ] Rodar instalação com pnpm
- [ ] Rodar lint
- [ ] Rodar typecheck
- [ ] Rodar testes
- [ ] Garantir cache básico do pnpm
- [ ] Fazer o workflow rodar em pull requests

## Fora do escopo
- Deploy automático
- Quality gates avançados
- Coverage obrigatório

## Critério de aceite
- [ ] Dado que abro um PR, quando o GitHub Actions roda, então lint, typecheck e tests são executados
- [ ] Workflow falha se houver erro de lint/typecheck/test
- [ ] Workflow passa no estado inicial do projeto

## Notas técnicas
- Arquivo sugerido: `.github/workflows/ci.yml`
- Scripts esperados na raiz:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
EOF
)" "sprint-0,type:chore,priority:critical,infra,testing,stack:infra" "$SPRINT_0_MILESTONE"

create_issue "[S0-08] Criar design system mínimo no packages/ui" "$(cat <<'EOF'
## Contexto
O design system deve nascer em componentes reais, não em mockup separado. A Sprint 0 precisa criar os blocos primitivos para as telas futuras.

## Escopo
- [ ] Criar package `packages/ui`
- [ ] Configurar build/exports do pacote
- [ ] Criar tokens básicos
- [ ] Criar componente `Button`
- [ ] Criar componente `Input`
- [ ] Criar componente `Card`
- [ ] Criar componente `Badge`
- [ ] Criar componente `Chip`
- [ ] Criar componente `Checkbox`
- [ ] Exportar componentes pelo index do pacote

## Fora do escopo
- Storybook
- Biblioteca completa de componentes
- Componentes complexos de produto

## Critério de aceite
- [ ] Dado que estou no app web, quando importo componentes de `packages/ui`, então eles renderizam corretamente
- [ ] Componentes aceitam `className`
- [ ] Componentes têm estilo limpo e consistente com o produto

## Notas técnicas
- Componentes devem funcionar com Tailwind
- Preferir API simples
- Pensar em acessibilidade desde o começo
EOF
)" "sprint-0,type:feature,priority:high,design-system,frontend,stack:ui,stack:shared" "$SPRINT_0_MILESTONE"

create_issue "[S0-09] Criar shell do dashboard com sidebar renderizando" "$(cat <<'EOF'
## Contexto
O entregável visual da Sprint 0 é conseguir logar e ver a estrutura inicial do app com sidebar. Ainda não é o dashboard funcional, mas já define a navegação base.

## Escopo
- [ ] Criar layout autenticado
- [ ] Criar sidebar fixa
- [ ] Listar itens principais de navegação
- [ ] Criar header simples
- [ ] Criar página vazia de dashboard
- [ ] Mostrar estado inicial/logado da usuária
- [ ] Garantir responsividade básica

## Fora do escopo
- Cards reais do dashboard
- Registro rápido
- CRUD de produto
- Gráficos

## Critério de aceite
- [ ] Dado que estou logada, quando acesso o app, então vejo a sidebar
- [ ] A sidebar contém os principais itens do produto
- [ ] O dashboard renderiza sem dados mockados complexos
- [ ] O layout não quebra em telas menores

## Notas técnicas
Itens de navegação iniciais:
- Visão geral
- Momento atual
- Hoje
- Work Log
- Estudos
- Conquistas
- Dúvidas
- Links úteis
- Projetos
- Skills
- Entrevistas
- Review semanal
- Configurações
EOF
)" "sprint-0,type:feature,priority:high,frontend,domain:dashboard,stack:web" "$SPRINT_0_MILESTONE"

create_issue "[S0-10] Escrever ADR-001: Modelo polimórfico de Entry" "$(cat <<'EOF'
## Contexto
Entry é o core do CareerOS. Ela representa qualquer coisa capturada rapidamente: aprendizado, conquista, dúvida, tarefa, link, estudo, decisão técnica e feedback.

Antes de implementar o schema real, precisamos decidir se usaremos table-per-type ou JSONB.

## Escopo
- [ ] Criar pasta de ADRs
- [ ] Escrever ADR-001
- [ ] Comparar table-per-type versus JSONB
- [ ] Explicar tradeoffs de tipagem, consultas, joins, evolução e complexidade
- [ ] Registrar decisão escolhida
- [ ] Registrar consequências da decisão

## Fora do escopo
- Implementar migration de entries
- Criar endpoints
- Criar UI de captura

## Critério de aceite
- [ ] ADR está commitado no repositório
- [ ] A decisão está clara
- [ ] O documento explica por que a alternativa rejeitada não foi escolhida agora

## Notas técnicas
Sugestão do mapa de produto:
- Usar table-per-type:
  - tabela base `entries`
  - tabelas específicas `tasks`, `questions`, `achievements`, etc.

Motivo:
- Mais SQL para treinar
- Tipagem mais forte no NestJS
- Modelo mais explícito para produto v1
EOF
)" "sprint-0,type:adr,type:docs,priority:critical,docs,database,domain:entry,stack:db" "$SPRINT_0_MILESTONE"

create_issue "[S0-11] Escrever ADR-002: ORM no NestJS" "$(cat <<'EOF'
## Contexto
O projeto precisa escolher um ORM antes da modelagem começar. A decisão impacta migrations, acesso a dados, tipagem e velocidade de desenvolvimento.

## Escopo
- [ ] Escrever ADR-002
- [ ] Comparar Prisma, TypeORM e Drizzle
- [ ] Explicar prós e contras para este projeto
- [ ] Registrar decisão escolhida
- [ ] Registrar consequências da decisão

## Fora do escopo
- Implementar todos os schemas
- Criar repositories/services finais
- Otimização avançada de queries

## Critério de aceite
- [ ] ADR está commitado no repositório
- [ ] A escolha do ORM está justificada
- [ ] Está claro como o ORM será usado na API NestJS

## Notas técnicas
Sugestão do mapa de produto:
- Prisma, para reaproveitar conhecimento do FinSight AI e acelerar a v1
EOF
)" "sprint-0,type:adr,type:docs,priority:critical,docs,database,backend,stack:api,stack:db" "$SPRINT_0_MILESTONE"

create_issue "[S0-12] Escrever ADR-003: Monorepo ou repositórios separados" "$(cat <<'EOF'
## Contexto
O projeto precisa registrar oficialmente a decisão de arquitetura de repositório. Mesmo que a Sprint 0 já comece com monorepo, a decisão deve ficar documentada.

## Escopo
- [ ] Escrever ADR-003
- [ ] Comparar monorepo versus repositórios separados
- [ ] Justificar uso de pnpm workspaces
- [ ] Explicar papel de `apps/api`, `apps/web`, `packages/types` e `packages/ui`
- [ ] Registrar consequências da decisão

## Fora do escopo
- Migrar estrutura futura
- Configurar Nx/Turborepo, a menos que seja necessário

## Critério de aceite
- [ ] ADR está commitado no repositório
- [ ] A estrutura do monorepo está explicada
- [ ] Está claro por que monorepo faz sentido para este side project fullstack

## Notas técnicas
Sugestão:
- Monorepo com pnpm workspaces:
  - `apps/api`
  - `apps/web`
  - `packages/types`
  - `packages/ui`
EOF
)" "sprint-0,type:adr,type:docs,priority:normal,docs,infra,stack:infra,stack:shared" "$SPRINT_0_MILESTONE"

create_issue "[S0-13] Escrever ADR-004: Estratégia de autenticação" "$(cat <<'EOF'
## Contexto
A autenticação precisa ser pensada cedo, porque impacta Next.js, NestJS, sessão, segurança e DX.

A proposta inicial é Auth.js no Next.js emitindo JWT que o NestJS valida por guard.

## Escopo
- [ ] Escrever ADR-004
- [ ] Explicar por que usar Auth.js no Next.js
- [ ] Explicar como o NestJS validará o JWT
- [ ] Registrar responsabilidades de Web e API
- [ ] Documentar riscos e limitações da abordagem
- [ ] Registrar decisão escolhida

## Fora do escopo
- Implementar RBAC completo
- Implementar recuperação de senha
- Implementar múltiplos providers se não for necessário agora

## Critério de aceite
- [ ] ADR está commitado no repositório
- [ ] Fluxo de autenticação está claro
- [ ] A implementação da issue de auth consegue seguir esse documento

## Notas técnicas
Decisão sugerida:
- Auth.js no Next.js
- JWT usado em chamadas para NestJS
- Guard no NestJS para proteger rotas privadas
EOF
)" "sprint-0,type:adr,type:docs,priority:critical,docs,security,domain:auth,stack:web,stack:api" "$SPRINT_0_MILESTONE"

log "Issues da Sprint 0 criadas."

echo ""
log "Processo finalizado."
info "Próximo passo sugerido: abrir o Project $PROJECT_ID e conferir se as issues entraram na coluna correta."
