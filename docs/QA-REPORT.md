# QA-REPORT.md — Registro de Testes Executados

> Este relatório só contém testes **realmente executados**. Quando um teste não pôde ser executado, isso está registrado explicitamente como `NÃO EXECUTADO`, com o motivo (regras 14/15 do `CLAUDE.md`).

## Ambiente de teste

- Não havia Python, Node.js ou `gh` instalados na máquina no momento dos testes.
- Testes funcionais foram executados em navegador real, servindo os arquivos por um servidor HTTP local temporário (PowerShell `HttpListener`), pois o painel de pré-visualização interno trata arquivos `file://` fora do diretório reconhecido como projeto como "snapshot estático" (sem execução de JavaScript).
- Não existe suíte de testes automatizados neste momento (`BKL-101` — `PENDENTE`).

## Testes automatizados

**Status: EXECUTADO (a partir de 2026-09-14, Ciclo 4).** Ver detalhes abaixo. Antes deste ciclo, nenhuma suíte automatizada existia (`BKL-101` estava `PENDENTE`).

## Testes funcionais manuais — Ciclo 1 (build inicial da aplicação)

Data: 2026-09-14

| # | Cenário | Passos | Resultado esperado | Resultado obtido |
|---|---------|--------|---------------------|-------------------|
| 1 | Cadastro de projeto | Preencher todos os campos e salvar | Projeto aparece na lista e nos KPIs | ✅ Conforme esperado |
| 2 | Validação de formulário | Submeter formulário vazio | Mensagens de erro por campo, sem salvar | ✅ Conforme esperado |
| 3 | Validação de datas | Prazo anterior à data de início | Bloqueado com mensagem de erro | ✅ Conforme esperado |
| 4 | Edição de projeto | Editar projeto existente e salvar | Dados atualizados, sem duplicar registro | ✅ Conforme esperado |
| 5 | Exclusão — cancelar | Clicar em excluir, depois em cancelar no modal | Projeto não é removido | ❌ **Falhou na primeira execução** — modal aparecia sempre visível (bug de CSS), impedindo verificar o fluxo de cancelamento corretamente |
| 5b | Exclusão — cancelar (reteste) | Mesmo cenário, após correção do CSS (`.modal-overlay[hidden]`) | Projeto não é removido | ✅ Conforme esperado após correção |
| 6 | Exclusão — confirmar | Clicar em excluir e confirmar | Projeto removido da lista e dos KPIs | ✅ Conforme esperado |
| 7 | Cálculo de status "Atrasado" | Cadastrar projeto com prazo no passado e status "Em andamento" | Exibido como "Atrasado" na tabela e contabilizado no KPI | ✅ Conforme esperado |
| 8 | Busca por texto | Buscar por nome/responsável existente e inexistente | Filtra corretamente; mensagem de "nenhum resultado" quando aplicável | ✅ Conforme esperado |
| 9 | Filtro por status | Selecionar cada opção de status no filtro | Lista filtrada corretamente | ✅ Conforme esperado |
| 10 | Persistência | Recarregar a página (F5) após cadastro | Dados permanecem | ✅ Conforme esperado |
| 11 | Responsividade | Redimensionar para 375×812 (mobile) | Layout se adapta sem quebra/scroll horizontal indevido | ✅ Conforme esperado |
| 12 | Tema claro/escuro | Alternar tema pelo botão | Tema muda e preferência é salva em `localStorage` | ✅ Conforme esperado |
| 13 | Erros de console | Observar console do navegador durante o uso | Nenhum erro | ✅ Nenhum erro encontrado |

### Bug encontrado e corrigido — Ciclo 1

- **Descrição**: modal de confirmação de exclusão (`#confirm-overlay`) aparecia sempre visível, mesmo com o atributo `hidden`.
- **Causa raiz**: conflito de especificidade CSS entre `.modal-overlay{display:flex}` (autor) e `[hidden]{display:none}` (agente de usuário) — ver detalhes em [DECISIONS.md](DECISIONS.md).
- **Correção**: adicionada a regra `.modal-overlay[hidden]{display:none;}` em `css/styles.css`.
- **Regressão pós-correção**: reteste dos cenários 5, 5b e 6 confirmou funcionamento correto sem quebrar nenhum outro fluxo (cadastro, edição, KPIs).

## Testes funcionais manuais — Ciclo 2 (antes do primeiro commit Git)

Data: 2026-09-14

| # | Cenário | Resultado obtido |
|---|---------|-------------------|
| 1 | Servir a aplicação via servidor HTTP local temporário e carregar `index.html` | ✅ HTTP 200, arquivo servido corretamente |
| 2 | Verificar carregamento do módulo `ProjectStorage` e renderização dos 4 KPIs | ✅ `typeof ProjectStorage === "object"`; 4 blocos `.kpi` renderizados |
| 3 | Verificar data exibida no cabeçalho | ✅ Data do sistema exibida corretamente |
| 4 | Verificar erros no console do navegador | ✅ Nenhum erro |

**Objetivo deste ciclo**: confirmar que nenhuma funcionalidade foi quebrada antes de versionar o projeto (nenhum arquivo de aplicação foi alterado nesta etapa — apenas `.gitignore` foi adicionado).

## Testes funcionais manuais — Ciclo 3 (criação da estrutura `/docs` e atualização do `CLAUDE.md`)

Data: 2026-09-14

**Status: NÃO EXECUTADO.**
**Motivo**: esta etapa não alterou `index.html`, `css/styles.css`, `js/app.js` ou `js/storage.js` — apenas arquivos de documentação (`/docs/*.md`) e `CLAUDE.md` foram criados/alterados. Não há comportamento de aplicação novo a validar no navegador. Validação funcional completa (Ciclo 1/2) permanece válida, pois o código de aplicação não foi tocado.

## Testes funcionais e automatizados — Ciclo 4 (BKL-101: suíte de testes automatizados)

Data: 2026-09-14

### Contexto

Implementação de `BKL-101` (Fase 2 do roadmap). Como o ambiente não possui Node/npm (reconfirmado nesta etapa), não é viável usar um test runner de mercado (Jest/Vitest/etc.). Foi construído um harness próprio, sem dependências externas, coerente com a decisão arquitetural de "sem build/sem framework" (ver `DECISIONS.md`). Os testes rodam num navegador real, carregando a aplicação de verdade dentro de um iframe (`tests/tests.html` → `../index.html`) — nenhuma implementação foi mockada.

Para viabilizar os testes, `js/app.js` foi refatorado (sem alterar comportamento): a lógica de validação foi extraída para uma função pura `validateProjectData(input)`, e `effectiveStatus`/`validateProjectData` foram expostas em `window.PainelProjetosCore` somente para leitura pelos testes.

### Suíte automatizada — resultado real

Executada servindo o projeto via servidor HTTP local temporário e abrindo `tests/tests.html` num navegador real (Claude Browser pane).

```
TEST_SUMMARY total=16 passed=16 failed=0
```

| Grupo | Casos | Resultado |
|-------|-------|-----------|
| `effectiveStatus` (cálculo de "Atrasado") | 5 | ✅ 5/5 |
| `validateProjectData` (validação de formulário) | 6 | ✅ 6/6 |
| `ProjectStorage` (CRUD em `localStorage`) | 5 | ✅ 5/5 |

Nenhuma falha na primeira execução — não houve necessidade de ciclo de correção para este incremento.

### Regressão manual da aplicação real (pós-refatoração de `js/app.js`)

Executada na mesma sessão, contra `index.html` servido localmente, para confirmar que a refatoração de `validate()` não alterou o comportamento observável:

| # | Cenário | Resultado |
|---|---------|-----------|
| 1 | Submissão de formulário vazio | ✅ 4 mensagens de erro exibidas (nome, responsável, início, prazo); nenhum projeto criado |
| 2 | Cadastro com prazo anterior ao início | ✅ Bloqueado com a mensagem correta; nenhum projeto criado |
| 3 | Cadastro válido (prazo no passado, status "Em andamento") | ✅ Projeto criado; KPI "Atrasados" = 1; badge "Atrasado" exibido na tabela |
| 4 | Edição do projeto (status → "Concluído", progresso → 100) | ✅ Atualizado sem duplicar registro (`list().length` permaneceu 1) |
| 5 | Exclusão com modal de confirmação | ✅ Modal visível ao abrir; projeto removido após confirmar |
| 6 | Erros de console durante todo o ciclo | ✅ Nenhum erro |

**Conclusão da regressão**: nenhuma funcionalidade existente foi afetada pela refatoração.

## Testes de segurança — Ciclo 5 (BKL-105: revisão formal de segurança da Fase 2)

Data: 2026-09-14

### Bug de segurança encontrado e corrigido

- **Descrição**: `fmtDate(p.dataInicio)` e `fmtDate(p.prazo)` eram interpolados em `innerHTML` na renderização da tabela sem passar por `escapeHtml()`, ao contrário de `nome`/`responsavel`.
- **Severidade real**: baixa — os campos de data só são preenchíveis via `<input type="date">` na UI normal; explorar isso exige adulterar o `localStorage` diretamente (auto-XSS local, sem terceiros envolvidos nesta arquitetura single-user).
- **Prova de conceito**: injetado no `localStorage`, via console do navegador, um projeto com `dataInicio: "<img src=x onerror=window.__xss=true>"`. Antes da correção, o handler `onerror` executaria ao renderizar a tabela.
- **Correção**: `escapeHtml()` aplicado também às datas formatadas em `js/app.js`.
- **Reteste pós-correção**: mesmo payload injetado novamente — `window.__xss` permaneceu `undefined` e o conteúdo apareceu como texto literal na célula (`cellText` = a string literal do payload, não executado).
- **Regressão**: cadastro de projeto com datas normais (`01/01/2026`, `01/02/2026`) continuou exibindo corretamente formatado; suíte automatizada reexecutada com resultado `TEST_SUMMARY total=16 passed=16 failed=0`; nenhum erro de console.

## Revisão de acessibilidade — Ciclo 6 (BKL-104: acessibilidade básica)

Data: 2026-09-14

### Achados encontrados

1. **Contraste de cor abaixo do mínimo WCAG 2.1 AA (4.5:1 para texto normal)** — calculado programaticamente (fórmula de luminância relativa do WCAG), não estimado visualmente:

   | Elemento | Antes | Depois |
   |---|---|---|
   | Texto `--muted` sobre `--surface` (labels, notas, cabeçalho de tabela, rodapé) — tema claro | 3.50:1 ❌ | 5.78:1 ✅ |
   | Texto `--good` sobre `--surface` (KPI "Concluídos", mensagem de sucesso) — tema claro | 3.27:1 ❌ | 5.75:1 ✅ |
   | Texto `--bad` sobre `--surface` (erros, KPI "Atrasados") — tema claro | 4.68:1 ✅ (já passava) | 5.65:1 ✅ |
   | `.badge.planejado` (texto sobre fundo tingido) — ambos os temas | 2.90:1 (claro) / 4.12:1 (escuro) ❌ | 5.11:1 / 4.50:1 ✅ |
   | `.badge.concluido` (texto sobre fundo tingido) — ambos os temas | 2.75:1 (claro) / 4.32:1 (escuro) ❌ | 5.01:1 / 4.50:1 ✅ |
   | `.badge.andamento` (texto sobre fundo tingido) — ambos os temas | 3.56:1 (claro) / 4.10:1 (escuro) ❌ | 4.57:1 / 4.51:1 ✅ |
   | `.badge.atrasado` (texto sobre fundo tingido) — ambos os temas | 3.78:1 (claro) / 4.75:1 (escuro) — claro falhava | 4.56:1 / 4.75:1 ✅ |
   | `.eyebrow` sobre `--band` (tema claro) | 4.06:1 ❌ | 4.55:1 ✅ |
   | Botão primário (`--accent-ink` sobre `--accent`) — tema claro | 4.42:1 ❌ (bem próximo do limite) | 4.55:1 ✅ |

   Todos os pares no tema escuro que já passavam permaneceram inalterados e verificados novamente.

2. **Campos de busca e filtro sem `<label>` associado** (`#f-search`, `#f-filter-status`) — dependiam apenas de `placeholder`, que não é um substituto confiável de rótulo para leitores de tela.
3. **Modal de confirmação de exclusão sem semântica de diálogo** — faltavam `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby`, e não havia gerenciamento de foco (o foco não entrava no modal ao abrir, `Esc` não fechava, e o foco não retornava ao botão que abriu o modal ao fechar).
4. **Botões "Editar"/"Excluir" sem contexto para leitor de tela** — o nome acessível era apenas "Editar"/"Excluir", idêntico em todas as linhas da tabela, sem identificar a qual projeto se referiam.

### Correções aplicadas

- `css/styles.css`: valores de `--muted`, `--good`, `--bad` e `--accent` (tema claro) escurecidos ao mínimo necessário para 4.5:1; alpha de fundo de `.badge.planejado`/`.badge.concluido` reduzido de 0.18/0.15 para 0.12; novas variáveis dedicadas `--accent-badge` (texto do badge "Em andamento") e `--eyebrow-ink` (texto do `.eyebrow`) criadas — **sem alterar `--accent` usado em botões, bordas e foco fora do necessário** — para não haver conflito entre um mesmo token precisando de valores opostos em contextos diferentes (texto sobre fundo escuro vs. texto sobre fundo claro). Justificativa completa em `DECISIONS.md`.
- `index.html`: `<label class="sr-only">` adicionado para `#f-search` e `#f-filter-status`; `role="dialog"`, `aria-modal="true"`, `aria-labelledby="confirm-title"`, `aria-describedby="confirm-text"` adicionados ao `.modal`; `id="confirm-title"` adicionado ao `<h3>`.
- `css/styles.css`: utilitário `.sr-only` adicionado (padrão de rótulo visualmente oculto, mas acessível a leitores de tela).
- `js/app.js`: `openConfirmModal()`/`closeConfirmModal()` — foco move para o botão "Cancelar" ao abrir o modal; tecla `Esc` fecha o modal; foco retorna ao botão que abriu o modal ao fechar (cancelar, confirmar ou clique fora). Botões "Editar"/"Excluir" passaram a ter `aria-label` incluindo o nome do projeto.

### Validação real executada

- Recalculados todos os pares de contraste acima após a mudança (script de verificação com a fórmula oficial do WCAG) — todos ≥ 4.5:1 em ambos os temas.
- Testado no navegador: abrir modal move o foco para "Cancelar"; `Esc` fecha o modal e devolve o foco ao botão que o abriu; fluxo completo de exclusão (abrir → confirmar → item removido) continua funcionando.
- Rótulos confirmados via `label[for]`/`aria-label` lidos diretamente do DOM renderizado.
- Inspeção visual da tabela com os 4 status/badges simultaneamente — nenhuma mudança perceptível de layout, apenas leve escurecimento de cores já usadas.
- Suíte automatizada reexecutada: `TEST_SUMMARY total=16 passed=16 failed=0` (duas execuções, antes e depois da adição do foco/ARIA).
- Nenhum erro de console em nenhuma das verificações.

### Pendência declarada (não bloqueante)

- Não foi implementado *focus trap* completo (Tab/Shift+Tab ciclando somente dentro do modal enquanto aberto) — apenas movimentação de foco ao abrir/fechar e fechamento via `Esc`. Um usuário de teclado pode, em teoria, tabular para fora do modal enquanto ele está aberto. Registrado aqui para visibilidade; não bloqueia esta entrega por ser uma melhoria incremental sobre uma base já significativamente mais acessível que antes.
- Não foi conduzida uma auditoria completa com leitor de tela real (NVDA/VoiceOver) nem uma verificação de todos os critérios WCAG 2.1 AA — o escopo desta revisão foi "básico" (labels, contraste, navegação por teclado), conforme `BKL-104`.

## Regressões conhecidas

Nenhuma regressão identificada até o momento (2026-09-14, incluindo após os Ciclos 4, 5 e 6). Este documento deve ser atualizado a cada novo ciclo de testes.
