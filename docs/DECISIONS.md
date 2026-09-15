# DECISIONS.md — Registro Cronológico de Decisões Técnicas

> Toda decisão técnica relevante deve ser registrada aqui, em ordem cronológica, com data, decisão e justificativa (regra 17 do `CLAUDE.md`). Decisões não são removidas retroativamente — se uma decisão é revertida, registra-se uma nova entrada explicando a mudança.

---

## 2026-09-14 — Arquitetura client-side sem build, sem framework

**Decisão**: implementar o Painel de Projetos como aplicação estática (HTML/CSS/JS puro), sem React/Vue/bundler.

**Justificativa**: o requisito explícito era "deve funcionar localmente" e "escolha uma arquitetura simples e adequada para este teste". Um framework com build exigiria Node/ferramentas de build, que não estavam disponíveis no ambiente de destino no momento da entrega (confirmado posteriormente: nem Python nem Node.js estavam instalados na máquina). Uma aplicação estática elimina esse risco.

---

## 2026-09-14 — Persistência via `localStorage`

**Decisão**: usar `window.localStorage` como único mecanismo de persistência, sem backend/banco de dados.

**Justificativa**: não havia requisito de backend nem de múltiplos usuários; o requisito era funcionamento local. `localStorage` atende à necessidade de persistir dados entre sessões no mesmo navegador com complexidade mínima. Limitação assumida conscientemente e documentada no README e em `PROJECT-SPEC.md`.

---

## 2026-09-14 — Status "Atrasado" como valor calculado, não armazenado

**Decisão**: o status "Atrasado" não é uma opção selecionável no formulário; é derivado automaticamente comparando `prazo` com a data atual, para qualquer projeto cujo status salvo não seja "Concluído".

**Justificativa**: armazenar "Atrasado" como status manual criaria uma segunda fonte de verdade que ficaria desatualizada assim que o tempo passasse. Calcular em tempo de renderização garante que o indicador do dashboard sempre reflita a realidade no momento da consulta.

---

## 2026-09-14 — Correção de bug: modal de exclusão sempre visível

**Decisão**: adicionar a regra CSS `.modal-overlay[hidden]{display:none;}`.

**Contexto/justificativa**: durante a validação funcional no navegador, foi identificado que o modal de confirmação de exclusão aparecia sempre visível, mesmo com o atributo HTML `hidden` presente. Causa raiz: a regra `.modal-overlay{display:flex;...}` (seletor de classe) tem a mesma especificidade que a regra do agente de usuário `[hidden]{display:none}` (seletor de atributo), e como CSS de autor sempre vence CSS de agente de usuário em empate de especificidade, o `display:flex` prevalecia. Corrigido com uma regra explícita de maior prioridade para o estado oculto. Bug encontrado e corrigido antes da entrega — nenhuma funcionalidade foi mascarada ou removida para "esconder" o problema.

---

## 2026-09-14 — Uso de servidor HTTP local temporário (PowerShell) apenas para validação

**Decisão**: como o ambiente não possui Python/Node/gh instalados, um script PowerShell temporário com `System.Net.HttpListener` foi usado exclusivamente para servir os arquivos durante a validação funcional no navegador (necessário porque `file://` não executa os scripts corretamente no painel de pré-visualização usado). O script foi removido após o uso e não faz parte do repositório.

**Justificativa**: garantir validação funcional real (não apenas leitura de código) sem alterar o produto entregue nem depender de instalação de ferramentas adicionais na máquina do usuário.

---

## 2026-09-14 — Inicialização do repositório Git com branch `main`

**Decisão**: inicializar o repositório com `git init -b main` (em vez do padrão `master`).

**Justificativa**: `main` é o padrão atual recomendado pelo GitHub e solicitado explicitamente pelo usuário.

---

## 2026-09-14 — Estrutura de governança `/docs` + regras formais em `CLAUDE.md`

**Decisão**: criar os oito documentos de governança (`PROJECT-SPEC.md`, `ROADMAP.md`, `BACKLOG.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `QA-REPORT.md`, `SECURITY-REPORT.md`, `RELEASE-CHECKLIST.md`) e ampliar `CLAUDE.md` com fluxo de estados de backlog, dependências e gates de release.

**Justificativa**: o usuário solicitou evoluir o repositório para validar um fluxo de desenvolvimento autônomo e rastreável, com fonte oficial de requisitos, backlog granular com estados explícitos, e gate final de release. Nenhuma funcionalidade de aplicação foi alterada nesta etapa — mudança é exclusivamente de processo/documentação.
