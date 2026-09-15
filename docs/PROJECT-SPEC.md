# PROJECT-SPEC.md — Especificação Oficial do Produto

> Este documento é a **fonte oficial de requisitos** do projeto Painel de Projetos.
> Nenhum requisito aqui descrito pode ser removido ou alterado silenciosamente — qualquer mudança de escopo deve ser registrada em [DECISIONS.md](DECISIONS.md) com justificativa, e refletida no [BACKLOG.md](BACKLOG.md).

## 1. Visão geral

Sistema visual para acompanhamento de projetos: cadastro, edição, exclusão e visualização de indicadores agregados, funcionando localmente no navegador, sem backend.

## 2. Requisitos funcionais

| ID | Requisito | Status atual |
|----|-----------|---------------|
| RF-01 | Dashboard inicial com indicadores agregados | Implementado |
| RF-02 | Cadastro de projeto com: nome, responsável, data de início, prazo, status, percentual de progresso | Implementado |
| RF-03 | Lista de projetos cadastrados | Implementado |
| RF-04 | Edição de projeto existente | Implementado |
| RF-05 | Exclusão de projeto existente, com confirmação | Implementado |
| RF-06 | Indicador: total de projetos | Implementado |
| RF-07 | Indicador: projetos em andamento | Implementado |
| RF-08 | Indicador: projetos concluídos | Implementado |
| RF-09 | Indicador: projetos atrasados (calculado automaticamente pelo prazo, não é um status manual) | Implementado |
| RF-10 | Busca por nome/responsável e filtro por status na lista | Implementado (evolução além do pedido original) |
| RF-11 | Alternância de tema claro/escuro | Implementado (evolução além do pedido original) |

## 3. Requisitos não funcionais

| ID | Requisito | Status atual |
|----|-----------|---------------|
| RNF-01 | Interface moderna e corporativa | Implementado |
| RNF-02 | Responsiva (desktop, tablet, mobile) | Implementado |
| RNF-03 | Deve funcionar localmente, sem servidor obrigatório (abrir `index.html` diretamente) | Implementado |
| RNF-04 | Persistência local dos dados entre sessões | Implementado via `localStorage` |
| RNF-05 | Arquitetura simples, sem dependências externas de build | Implementado |
| RNF-06 | Código organizado em arquivos e pastas coerentes | Implementado |
| RNF-07 | Documentação de uso (README) | Implementado |
| RNF-08 | Nenhuma credencial, senha ou token no código-fonte | Implementado (não aplicável nesta fase — sem integrações externas) |

## 4. Fora de escopo (nesta fase)

- Backend, API ou banco de dados externo.
- Autenticação e controle de acesso.
- Sincronização multiusuário/multi-dispositivo.
- Exportação de dados (CSV/Excel).

Qualquer um destes itens só entra em escopo se for formalmente adicionado a este documento e ao BACKLOG.md.

## 5. Critérios de aceite gerais

- Todas as funcionalidades descritas como "Implementado" devem permanecer funcionando (regra de não regressão) ao longo de toda evolução futura do projeto.
- Toda nova funcionalidade deve ser adicionada a este documento antes ou junto da sua implementação.
