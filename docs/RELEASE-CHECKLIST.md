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

**AGUARDANDO** — estrutura de governança criada e validada como coerente, mas o commit não foi realizado nesta etapa por instrução explícita do usuário ("NÃO faça commit ainda"). Esta release só deve ser considerada `CONCLUIDO` no `BACKLOG.md` (BKL-015, BKL-016) após o commit correspondente.
