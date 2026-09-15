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

---

## 2026-09-14 — Correção de estado obsoleto no BACKLOG (BKL-015/BKL-016) e formalização do escopo da Fase 2

**Decisão**: durante o início da execução autônoma do backlog, identificou-se que `BKL-015` e `BKL-016` permaneciam registrados como `EM_DESENVOLVIMENTO` ("ainda não commitado"), embora o commit `b47f2ea` já os tivesse implementado, revisado e publicado em `origin/main` em etapa anterior. Os dois itens foram avançados para `CONCLUIDO` com evidência real (hash do commit + confirmação de sincronismo local/remoto), e `ROADMAP.md` (Fase 1) foi atualizado de "em andamento" para "concluída". Também foram criados `BKL-104` (revisão de acessibilidade básica) e `BKL-105` (revisão formal de segurança da Fase 2), convertendo formalmente o escopo textual já existente em `ROADMAP.md` (Fase 2) em itens rastreáveis com ID, conforme regra 3 da governança.

**Justificativa**: o `BACKLOG.md` é a fonte de verdade sobre o estado real do trabalho; mantê-lo desatualizado violaria a regra de consistência entre documentos e poderia levar a reexecutar ou pular trabalho já validado. Nenhum estado foi avançado sem evidência — a evidência já existia (commit e push confirmados na etapa anterior), apenas não havia sido refletida no arquivo.

---

## 2026-09-14 — Suíte de testes automatizados sem dependências externas (BKL-101)

**Decisão**: implementar os testes automatizados de `BKL-101` como um harness próprio em `tests/` (micro-framework de asserções + casos de teste + página HTML que carrega a aplicação real num iframe), em vez de usar um test runner de mercado (Jest, Vitest, Mocha, etc.).

**Justificativa**: o ambiente de desenvolvimento não possui Node.js/npm instalados (reconfirmado nesta etapa); instalar um runtime ou baixar dependências npm não estava disponível nem seria coerente com a decisão arquitetural vigente de "sem build/sem framework" (ver decisão de 2026-09-14 sobre arquitetura client-side). Um harness próprio, em JavaScript puro, mantém o projeto 100% executável apenas com um navegador, sem exigir instalação de ferramentas adicionais — o mesmo princípio já aplicado ao restante da aplicação.

**Trade-off assumido**: a suíte cobre lógica de negócio pura (`effectiveStatus`, `validateProjectData`) e persistência (`ProjectStorage`), mas não cobre renderização de DOM/interação de usuário — isso continua coberto por testes manuais no navegador a cada incremento, registrados em `QA-REPORT.md`. Documentado como restrição conhecida em `ARCHITECTURE.md`.

**Refatoração associada**: `js/app.js` teve a lógica de validação extraída para a função pura `validateProjectData(input)` (sem alterar nenhuma mensagem ou regra existente) e passou a expor `window.PainelProjetosCore = { effectiveStatus, validateProjectData }` somente para leitura pelos testes. Regressão completa executada após a mudança (ver `QA-REPORT.md`, Ciclo 4) confirmando comportamento idêntico ao anterior.

---

## 2026-09-14 — Correção de achado de segurança: datas sem escapeHtml() na tabela (BKL-105)

**Decisão**: aplicar `escapeHtml()` também a `fmtDate(p.dataInicio)` e `fmtDate(p.prazo)` em `js/app.js`, que antes eram interpolados em `innerHTML` sem escaping (diferente de `nome`/`responsavel`, que já eram escapados).

**Contexto/justificativa**: durante a revisão formal de segurança da Fase 2 (`BKL-105`), identificou-se que um valor malicioso de data — alcançável apenas adulterando o `localStorage` diretamente (fora da UI normal, que restringe o campo a `<input type="date">`) — seria renderizado sem escaping, permitindo um auto-XSS local. Comprovado com um payload `<img src=x onerror=...>` injetado via console: o `onerror` disparava antes da correção e deixou de disparar depois. Como o `escapeHtml()` é uma operação idempotente para os caracteres normais de uma data formatada (dígitos e `/`), a correção não altera a exibição em nenhum caso legítimo — confirmado por regressão manual e pela suíte automatizada (16/16).

**Justificativa da severidade e não bloqueio de release**: o vetor exige que o próprio usuário edite manualmente seu próprio `localStorage`; não há terceiros nem servidor envolvidos nesta arquitetura, então o "atacante" só afetaria a si mesmo. Ainda assim, a correção foi aplicada por ser trivial, segura e não disruptiva — não há razão para deixar um XSS conhecido, mesmo de baixo impacto, sem correção.

---

## 2026-09-14 — Correção de contraste WCAG AA via tokens dedicados, sem alterar `--accent` globalmente (BKL-104)

**Decisão**: ao corrigir os achados de contraste insuficiente (ver `QA-REPORT.md`, Ciclo 6), `--muted`, `--good` e `--bad` (tema claro) foram escurecidos diretamente, pois cada um é usado apenas em contextos compatíveis (texto sobre superfícies claras). Já `--accent` apresentava um conflito: é usado como texto sobre fundo escuro (`.eyebrow` sobre `--band`) **e** como texto sobre um fundo tingido claro (`.badge.andamento`) — dois contextos que exigiam ajustes opostos (mais claro vs. mais escuro) para o mesmo valor. Em vez de forçar um único valor de compromisso (que deixaria pelo menos um dos dois ainda abaixo de 4.5:1, como confirmado por cálculo), foram criadas duas variáveis dedicadas — `--eyebrow-ink` e `--accent-badge` — cada uma com o valor mínimo necessário para seu contexto específico, mantendo `--accent` em si praticamente inalterado (apenas um ajuste mínimo, de #2a78d6 para #2976d2, exigido separadamente pelo contraste do botão primário, `--accent-ink` sobre `--accent`).

**Justificativa**: alterar `--accent` diretamente para resolver o `.eyebrow` pioraria o `.badge.andamento` (e vice-versa), e ambos afetariam também bordas, foco de campo (`outline`) e a barra de progresso, que já tinham contraste adequado — um ajuste amplo desnecessário aumentaria o risco de regressão visual sem necessidade. Tokens dedicados por contexto isolam o impacto de cada correção ao elemento que realmente precisava dela.

**Validação**: todos os 9 pares de texto/fundo recalculados (fórmula oficial de contraste do WCAG) após a mudança, em ambos os temas — todos ≥ 4.5:1. Regressão visual (captura de tela com os 4 badges lado a lado) confirmou que a mudança de cor é imperceptível a olho nu, preservando a identidade visual do projeto.
