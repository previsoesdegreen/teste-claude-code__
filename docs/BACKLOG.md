# BACKLOG.md — Controle Granular de Tarefas

> Todo requisito de [PROJECT-SPEC.md](PROJECT-SPEC.md) deve existir aqui como um ou mais itens rastreáveis, com ID único. Nenhuma tarefa pode pular estados do fluxo obrigatório.

## Estados permitidos

```
PENDENTE
EM_DESENVOLVIMENTO
BLOQUEADO
IMPLEMENTADO
EM_TESTE
FALHOU_TESTE
VALIDADO
CONCLUIDO
```

**IMPORTANTE: `IMPLEMENTADO` não significa `CONCLUIDO`.**
`IMPLEMENTADO` indica apenas que o código foi escrito. Só se torna `CONCLUIDO` depois de passar por `EM_TESTE` e `VALIDADO`, com evidência real de validação registrada na coluna "Evidência".

## Fluxo obrigatório

```
PENDENTE → EM_DESENVOLVIMENTO → IMPLEMENTADO → EM_TESTE → VALIDADO → CONCLUIDO
```

Em caso de falha de teste:

```
EM_TESTE → FALHOU_TESTE → EM_DESENVOLVIMENTO → IMPLEMENTADO → EM_TESTE
```

`BLOQUEADO` pode ocorrer a partir de `PENDENTE` ou `EM_DESENVOLVIMENTO` quando uma dependência não está satisfeita; ao desbloquear, a tarefa retorna ao estado em que estava antes do bloqueio.

## Itens

| ID | Módulo | Descrição | Dependências | Prioridade | Status | Evidência de conclusão |
|----|--------|-----------|---------------|------------|--------|--------------------------|
| BKL-001 | Dashboard | Indicadores: total, em andamento, concluídos, atrasados | — | Alta | CONCLUIDO | Validado no navegador em 2026-09-14 (cadastro/edição/exclusão de projetos refletindo corretamente nos 4 KPIs) — ver [QA-REPORT.md](QA-REPORT.md) |
| BKL-002 | Cadastro | Formulário de cadastro de projeto (nome, responsável, início, prazo, status, progresso) com validação | — | Alta | CONCLUIDO | Validado no navegador: submissão vazia bloqueada com mensagens de erro; prazo anterior ao início rejeitado — ver QA-REPORT.md |
| BKL-003 | Listagem | Lista de projetos cadastrados em tabela | BKL-002 | Alta | CONCLUIDO | Validado no navegador — projeto cadastrado aparece na tabela imediatamente |
| BKL-004 | Edição | Edição de projeto existente sem duplicar registro | BKL-002, BKL-003 | Alta | CONCLUIDO | Validado no navegador: edição de status/progresso refletida sem duplicar linha |
| BKL-005 | Exclusão | Exclusão de projeto com modal de confirmação | BKL-003 | Alta | CONCLUIDO | Validado no navegador: "Cancelar" preserva o registro, "Excluir" remove; bug de modal sempre visível encontrado e corrigido nesta etapa |
| BKL-006 | Regras de negócio | Cálculo automático do status "Atrasado" (prazo vencido + status ≠ Concluído) | BKL-002 | Alta | CONCLUIDO | Validado no navegador: projeto com prazo vencido passou a contar como atrasado no KPI e na tabela sem alteração manual |
| BKL-007 | Persistência | Persistência dos dados em `localStorage` entre sessões | — | Alta | CONCLUIDO | Validado com reload de página (F5) mantendo os dados cadastrados |
| BKL-008 | UI/UX | Layout responsivo (desktop/tablet/mobile) | — | Média | CONCLUIDO | Validado em viewport 375×812 sem quebra de layout |
| BKL-009 | UI/UX | Tema claro/escuro com preferência persistida | — | Baixa | CONCLUIDO | Validado via toggle e leitura de `localStorage` |
| BKL-010 | Busca/Filtro | Busca por nome/responsável e filtro por status na listagem | BKL-003 | Média | CONCLUIDO | Validado via execução funcional (busca por termo existente/inexistente e filtro por status) |
| BKL-011 | Documentação | README.md com instruções de execução, testes e limitações | BKL-001..BKL-010 | Alta | CONCLUIDO | Arquivo presente e revisado no commit inicial |
| BKL-012 | Governança | Criação de CLAUDE.md com papéis, fluxo e regras obrigatórias | — | Alta | CONCLUIDO | Arquivo criado e versionado no commit inicial |
| BKL-013 | Versionamento | Inicialização do repositório Git local (branch `main`) e primeiro commit | BKL-001..BKL-012 | Alta | CONCLUIDO | Commit `85240ce` — "Initial commit: Painel de Projetos" |
| BKL-014 | Versionamento | Conexão com repositório remoto GitHub (`origin`) e push da branch `main` | BKL-013 | Alta | CONCLUIDO | `git push -u origin main` bem-sucedido; upstream `main` → `origin/main` confirmado |
| BKL-015 | Governança | Criação da estrutura `/docs` (PROJECT-SPEC, ROADMAP, BACKLOG, ARCHITECTURE, DECISIONS, QA-REPORT, SECURITY-REPORT, RELEASE-CHECKLIST) | BKL-012 | Alta | CONCLUIDO | Revisão de consistência entre documentos e ausência de segredos executada; commit `b47f2ea` ("chore: add autonomous development governance"); push confirmado com `main` e `origin/main` sincronizados no mesmo hash |
| BKL-016 | Governança | Atualização de CLAUDE.md com regras de governança de backlog/estados/gates | BKL-015 | Alta | CONCLUIDO | Mesma evidência de BKL-015 — commit `b47f2ea`, `git diff --stat` confirmou escopo restrito a `CLAUDE.md`/`docs/`, sem alteração de código de aplicação |

## Itens futuros (fora de escopo até autorização explícita)

| ID | Módulo | Descrição | Dependências | Prioridade | Status | Evidência de conclusão |
|----|--------|-----------|---------------|------------|--------|--------------------------|
| BKL-100 | Exportação | Exportar lista de projetos em CSV/Excel | BKL-003 | Baixa | PENDENTE | — |
| BKL-101 | Testes | Suíte de testes automatizados para regras críticas (status atrasado, validação, CRUD de persistência) | BKL-006, BKL-002 | Média | CONCLUIDO | 16/16 testes passaram na primeira execução real no navegador (`TEST_SUMMARY total=16 passed=16 failed=0`); regressão manual da aplicação real (cadastro, atrasado automático, edição, exclusão, KPIs) sem falhas e sem erros de console — ver `QA-REPORT.md`, Ciclo 4 |
| BKL-102 | Infra | CI (lint/testes/build) via GitHub Actions | BKL-014 | Baixa | PENDENTE | — |
| BKL-103 | Deploy | Publicação em ambiente público (ex.: GitHub Pages) | BKL-014 | Baixa | PENDENTE | Requer autorização explícita do usuário (regra 26 do CLAUDE.md) |

## Itens da Fase 2 (Consolidação de qualidade — ver ROADMAP.md)

> Convertidos formalmente em itens rastreáveis conforme regra 3 da governança (todo escopo do ROADMAP deve virar item de BACKLOG antes de ser executado).

| ID | Módulo | Descrição | Dependências | Prioridade | Status | Evidência de conclusão |
|----|--------|-----------|---------------|------------|--------|--------------------------|
| BKL-104 | Qualidade | Revisão de acessibilidade básica (labels, contraste, navegação por teclado) em `index.html`/`css/styles.css` | BKL-001..BKL-011 | Média | PENDENTE | — |
| BKL-105 | Segurança | Revisão formal de segurança client-side da Fase 2 (reexecução do checklist de `SECURITY-REPORT.md` contra o estado atual do código) | BKL-001..BKL-011 | Média | PENDENTE | — |
