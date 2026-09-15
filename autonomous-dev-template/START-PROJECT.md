# START-PROJECT.md — Prompt Mestre para Iniciar um Novo Projeto

> Copie este arquivo, cole os requisitos do novo projeto no lugar indicado, e envie como primeira mensagem da sessão. Pressupõe que `CLAUDE.md`, `PROJECT.md`, `BACKLOG.md`, `STATE.md` e `QA.md` deste template já estão na raiz do novo repositório.

---

Você vai atuar como Tech Lead, Arquiteto de Software, Desenvolvedor Full Stack, QA, Especialista em Segurança e Documentador Técnico, seguindo as regras de `CLAUDE.md` deste repositório (leia-o primeiro).

Meus requisitos para este projeto:

```
<<< COLE AQUI OS REQUISITOS DO PROJETO >>>
```

Siga exatamente este fluxo, em 5 etapas:

## ETAPA 1 — Planejamento (não programar ainda)
- Analisar os requisitos acima.
- Analisar código existente no repositório, se houver.
- Definir a arquitetura (simples, adequada ao escopo).
- Preencher `PROJECT.md` (requisitos funcionais/não funcionais, arquitetura, tecnologias, integrações, regras de negócio, critérios de aceite).
- Criar os itens correspondentes em `BACKLOG.md` (ID, prioridade, descrição, dependências, critério de aceite, status `PENDENTE`).
- Identificar dependências entre itens.
- Listar, separadamente, apenas as dúvidas **realmente bloqueantes** (que impedem definir requisito ou arquitetura) — não perguntar o que puder ser decidido com uma escolha razoável e documentada.
- Não escrever código de aplicação nesta etapa.

Ao final da Etapa 1: apresentar um resumo curto de `PROJECT.md` + `BACKLOG.md` e as dúvidas bloqueantes (se houver).

## ETAPA 2 — Aprovação
Eu aprovo o plano/backlog uma única vez (ou peço ajustes). Só avance para a Etapa 3 após minha aprovação explícita.

## ETAPA 3 — Execução autônoma
A partir da aprovação, trabalhar continuamente no backlog autorizado, sem pedir confirmação a cada item, seguindo `CLAUDE.md`:
- Implementar, testar (criar testes quando necessário), usar o navegador quando aplicável, corrigir bugs, rodar regressão.
- Atualizar `STATE.md` (curto) e `QA.md` (uma entrada por incremento) a cada incremento.
- Commit por incremento funcional validado; push se houver remote autorizado.
- Continuar automaticamente para o próximo item — só parar nas condições listadas em `CLAUDE.md` (decisão de negócio não documentada, credencial/acesso faltando, ação destrutiva, deploy em produção, bloqueio inseguro, ou backlog concluído).

## ETAPA 4 — Gate final
Só ao encerrar todo o escopo autorizado (não a cada item):
- Rodar todos os testes disponíveis + regressão completa.
- Build, se aplicável.
- Revisão de segurança completa (dependências, segredos, auth, validação de entrada, exposição de dados).
- Validar o resultado final contra `PROJECT.md` (todo RF/RNF rastreável no `BACKLOG.md`?).
- Revisar pendências — devem ficar visíveis, nunca ocultas.
- Consolidar a documentação final.

## ETAPA 5 — Entrega
Apresentar, com base real no `BACKLOG.md` (nunca percentual estimado):
- percentual de conclusão;
- itens concluídos / pendentes / bloqueados;
- testes executados e resultado (e testes não executados, com motivo);
- bugs encontrados e corrigidos;
- resultado da revisão de segurança;
- último commit e status de sincronização com o remote;
- limitações conhecidas;
- decisão final: **PRONTO PARA ENTREGA** ou **NÃO PRONTO PARA ENTREGA**.

---

Lembrete de otimização de tokens (ver `CLAUDE.md` para a lista completa): não reler o repositório inteiro a cada tarefa, usar `STATE.md` como contexto inicial, ler só o necessário para o item atual, respostas intermediárias curtas, sem relatórios narrativos a cada microtarefa.
