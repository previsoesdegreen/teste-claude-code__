# QA-REPORT.md — Registro de Testes Executados

> Este relatório só contém testes **realmente executados**. Quando um teste não pôde ser executado, isso está registrado explicitamente como `NÃO EXECUTADO`, com o motivo (regras 14/15 do `CLAUDE.md`).

## Ambiente de teste

- Não havia Python, Node.js ou `gh` instalados na máquina no momento dos testes.
- Testes funcionais foram executados em navegador real, servindo os arquivos por um servidor HTTP local temporário (PowerShell `HttpListener`), pois o painel de pré-visualização interno trata arquivos `file://` fora do diretório reconhecido como projeto como "snapshot estático" (sem execução de JavaScript).
- Não existe suíte de testes automatizados neste momento (`BKL-101` — `PENDENTE`).

## Testes automatizados

**Status: NÃO EXECUTADO.**
**Motivo**: não existe suíte de testes automatizados implementada no projeto até o momento. Nenhum resultado de teste automatizado deve ser considerado existente até que `BKL-101` seja implementado.

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

## Regressões conhecidas

Nenhuma regressão identificada até o momento (2026-09-14). Este documento deve ser atualizado a cada novo ciclo de testes.
