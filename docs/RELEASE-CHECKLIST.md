# RELEASE-CHECKLIST.md — Gate Final de Release

> Nenhuma versão pode ser declarada **PRONTA** sem que todos os critérios obrigatórios abaixo estejam atendidos (regras 20 e 21 do `CLAUDE.md`). Pendências não bloqueantes devem ficar explicitamente listadas na seção 4, nunca ocultas.

## Como usar este documento

Antes de declarar qualquer versão/incremento como pronto para entrega, preencher esta checklist para o escopo daquela entrega específica. Manter o histórico de releases anteriores abaixo, não sobrescrever.

---

## Release: v0.1 — MVP Painel de Projetos (Fase 0)

Data de referência: 2026-09-14

### 1. Critérios obrigatórios

| Critério | Atendido? | Evidência |
|----------|-----------|-----------|
| Todos os requisitos de `PROJECT-SPEC.md` para esta fase estão `CONCLUIDO` no `BACKLOG.md` | ✅ Sim | BKL-001 a BKL-011 em `CONCLUIDO` |
| Testes funcionais executados nos fluxos principais | ✅ Sim | `QA-REPORT.md`, Ciclo 1 |
| Bugs encontrados foram corrigidos e retestados | ✅ Sim | Bug do modal de exclusão — corrigido e reteste registrado |
| Teste de regressão executado após correções | ✅ Sim | Cenários 5, 5b, 6 retestados sem quebrar cenários 1–4 |
| Nenhum segredo, token, senha ou `.env` versionado | ✅ Sim | `SECURITY-REPORT.md`, seção 2 |
| Verificação de segurança realizada | ✅ Sim | `SECURITY-REPORT.md` |
| README atualizado e coerente com o comportamento real | ✅ Sim | `README.md` revisado nesta fase |
| Projeto executável ao final do ciclo | ✅ Sim | Validado servindo os arquivos localmente e testando no navegador |

### 2. Critérios de build

| Critério | Atendido? | Observação |
|----------|-----------|-----------|
| Build executado | Não aplicável | Projeto não possui etapa de build (HTML/CSS/JS estático) |

### 3. Critérios de versionamento

| Critério | Atendido? | Evidência |
|----------|-----------|-----------|
| Commit criado com mensagem clara | ✅ Sim | `85240ce` — "Initial commit: Painel de Projetos" |
| Branch principal é `main` | ✅ Sim | Confirmado via `git branch --show-current` |
| Sem force push | ✅ Sim | Nenhum force push utilizado em nenhuma etapa |

### 4. Pendências conhecidas (não bloqueantes para este escopo)

- Sem testes automatizados (`BKL-101`, `PENDENTE`).
- Sem autenticação/autorização — aceitável apenas para uso local single-user (ver `SECURITY-REPORT.md`, seção 3).
- Sem exportação de dados (`BKL-100`, `PENDENTE`) — fora do escopo original.
- Sem CI configurado (`BKL-102`, `PENDENTE`).

### 5. Decisão

**PRONTA para o escopo definido em `PROJECT-SPEC.md` (Fase 0).** Pendências acima são conhecidas, documentadas e não bloqueiam o escopo entregue.

---

## Release: v0.2 — Governança de Desenvolvimento (Fase 1)

Data de referência: 2026-09-14

### 1. Critérios obrigatórios

| Critério | Atendido? | Evidência |
|----------|-----------|-----------|
| Estrutura `/docs` criada conforme solicitado | ✅ Sim | 8 arquivos criados em `/docs` |
| `CLAUDE.md` atualizado com regras de governança | ✅ Sim | Seção "Governança de Backlog e Ciclo de Vida" adicionada |
| Nenhuma funcionalidade de aplicação alterada | ✅ Sim | `index.html`, `css/styles.css`, `js/app.js`, `js/storage.js` não foram tocados nesta etapa |
| Testes funcionais no navegador | NÃO EXECUTADO | Não aplicável — nenhuma mudança de comportamento de aplicação nesta etapa (ver `QA-REPORT.md`, Ciclo 3) |
| Build | Não aplicável | Sem etapa de build no projeto |
| Verificação de segurança | ✅ Sim | Nenhum segredo introduzido; apenas arquivos Markdown |
| Commit realizado | **Pendente** | Aguardando autorização explícita do usuário para commitar (conforme instrução recebida) |

### 2. Decisão

**CONCLUÍDA** — commitada em `b47f2ea` (chore: add autonomous development governance) e enviada a `origin/main`. `BKL-015`/`BKL-016` atualizados para `CONCLUIDO` em commit posterior (`cb1aa09`) assim que a evidência do commit/push foi confirmada.

---

## Release: v0.3 — Consolidação de qualidade (Fase 2) e execução autônoma do backlog

Data de referência: 2026-09-14

### 1. Critérios obrigatórios

| Critério | Atendido? | Evidência |
|----------|-----------|-----------|
| Todo o backlog acionável (sem bloqueio de autorização externa) está `CONCLUIDO` | ✅ Sim | `BKL-001` a `BKL-016`, `BKL-101`, `BKL-104`, `BKL-105` — todos `CONCLUIDO` em `BACKLOG.md` |
| Suíte de testes automatizados criada e executada (`BKL-101`) | ✅ Sim | 16/16 testes passaram — `QA-REPORT.md`, Ciclo 4 |
| Revisão formal de segurança executada (`BKL-105`) | ✅ Sim | 1 achado (XSS de baixa severidade em datas) encontrado e corrigido — `QA-REPORT.md`, Ciclo 5; `SECURITY-REPORT.md` |
| Revisão de acessibilidade básica executada (`BKL-104`) | ✅ Sim | 9 pares de contraste corrigidos (WCAG AA ≥4.5:1), labels e semântica de diálogo adicionados — `QA-REPORT.md`, Ciclo 6 |
| Todos os bugs encontrados foram corrigidos e retestados | ✅ Sim | Bug de XSS (Ciclo 5) e todos os achados de contraste (Ciclo 6) corrigidos e revalidados |
| Teste de regressão executado após cada correção | ✅ Sim | Regressão manual + suíte automatizada reexecutada em cada incremento (Ciclos 4–7) |
| Gate final completo executado (testes, regressão, navegador, console, segurança) | ✅ Sim | `QA-REPORT.md`, Ciclo 7 |
| Nenhum segredo, token, senha ou `.env` versionado | ✅ Sim | Verificado em cada commit (`git diff` + grep de padrões de segredo) antes de cada push |
| README/documentação de governança atualizados | ✅ Sim | `BACKLOG.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `QA-REPORT.md`, `SECURITY-REPORT.md` atualizados a cada incremento |
| Projeto executável ao final do ciclo | ✅ Sim | Validado servindo os arquivos localmente e testando fluxo completo no navegador (Ciclo 7) |

### 2. Critérios de build

| Critério | Atendido? | Observação |
|----------|-----------|-----------|
| Build executado | Não aplicável | Projeto não possui etapa de build (HTML/CSS/JS estático); confirmado nesta revisão |

### 3. Critérios de versionamento

| Critério | Atendido? | Evidência |
|----------|-----------|-----------|
| Commits pequenos e coerentes por incremento validado | ✅ Sim | `bc4fc80` (BKL-101), `15cfa70` (BKL-105), `bece42f` (BKL-104), além dos commits de correção de governança |
| Branch principal é `main` | ✅ Sim | Confirmado via `git branch --show-current` |
| Sem force push | ✅ Sim | Nenhum force push utilizado |
| `main` local sincronizado com `origin/main` após cada push | ✅ Sim | Confirmado (`git rev-parse main` == `git rev-parse origin/main`) após cada um dos commits acima |

### 4. Escopo intencionalmente fora deste release (bloqueado por autorização, não por falha)

Estes itens permanecem `PENDENTE` no `BACKLOG.md` — não por incapacidade técnica, mas porque o próprio `PROJECT-SPEC.md` ("Fora de escopo nesta fase") e o `ROADMAP.md` (Fases 3 e 4) exigem decisão explícita do usuário antes de iniciar:

- `BKL-100` — Exportação de dados (CSV/Excel): fora de escopo do produto atual até ser formalmente adicionado ao `PROJECT-SPEC.md`.
- `BKL-102` — CI via GitHub Actions: Fase 4, requer autorização explícita (regra 26 do `CLAUDE.md` cobre deploy; a criação de CI em si não é destrutiva, mas o `ROADMAP.md` já classifica toda a Fase 4 como dependente de autorização).
- `BKL-103` — Deploy em ambiente público: requer autorização explícita (regra 26 do `CLAUDE.md`) — bloqueio de decisão do usuário, não de qualidade técnica.

### 5. Decisão

**PRONTA para o escopo definido em `PROJECT-SPEC.md`/`ROADMAP.md` (Fases 0, 1 e 2).** Todos os critérios obrigatórios foram atendidos com evidência real. As pendências da seção 4 são conhecidas, explicitamente visíveis e bloqueadas exclusivamente por exigirem uma decisão do usuário — não representam um critério de qualidade não atendido.
