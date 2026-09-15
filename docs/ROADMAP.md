# ROADMAP.md — Fases e Ordem de Implementação

> Ordem de execução recomendada para a evolução do projeto. Cada fase só deve iniciar quando a fase anterior estiver com os itens obrigatórios em `CONCLUIDO` no [BACKLOG.md](BACKLOG.md).

## Fase 0 — Fundação da aplicação (concluída)

Escopo: MVP funcional do Painel de Projetos.

- Dashboard com indicadores.
- CRUD completo de projetos (criar, listar, editar, excluir).
- Cálculo automático de status "Atrasado".
- Persistência local via `localStorage`.
- Layout responsivo e tema claro/escuro.
- README com instruções de execução.

**Status**: concluída e validada manualmente no navegador (ver histórico de testes em [QA-REPORT.md](QA-REPORT.md)).

## Fase 1 — Governança de desenvolvimento (em andamento)

Escopo: estrutura de documentação e regras de processo para permitir evolução autônoma e rastreável do projeto.

- Criação de `/docs` (este conjunto de arquivos).
- Atualização de `CLAUDE.md` com fluxo obrigatório, estados de backlog e regras de governança.
- Nenhuma alteração de código de aplicação nesta fase.

**Status**: em andamento.

## Fase 2 — Consolidação de qualidade (planejada)

Escopo: aumentar a confiabilidade do que já existe, sem adicionar funcionalidade nova.

- Definir e (se aplicável) implementar testes automatizados para as regras críticas (ex.: cálculo de status "Atrasado", validação de formulário).
- Revisão de acessibilidade básica (labels, contraste, navegação por teclado).
- Revisão de segurança client-side (ver [SECURITY-REPORT.md](SECURITY-REPORT.md)).

**Status**: não iniciada.

## Fase 3 — Evolução funcional (planejada, sujeita a priorização do BACKLOG)

Escopo candidato, dependente de decisão explícita do usuário antes de entrar em desenvolvimento:

- Exportação de dados (CSV/Excel).
- Múltiplos quadros/visões (ex.: por responsável, por período).
- Persistência alternativa (arquivo local exportável/importável) para reduzir a limitação do `localStorage` por navegador.

**Status**: não iniciada — nenhum item desta fase deve ser desenvolvido sem antes existir como requisito em [PROJECT-SPEC.md](PROJECT-SPEC.md) e item correspondente no [BACKLOG.md](BACKLOG.md).

## Fase 4 — Infraestrutura e distribuição (planejada, requer autorização explícita)

Escopo candidato, somente com autorização explícita do usuário (ver regras 26 e 27 do `CLAUDE.md`):

- Deploy em ambiente público (ex.: GitHub Pages).
- Automação de CI (lint, testes, build) via GitHub Actions.

**Status**: não iniciada.
