# ARCHITECTURE.md — Arquitetura Atual

> Este documento deve ser atualizado sempre que a arquitetura mudar (regra 16 do `CLAUDE.md`). Se este arquivo divergir do código, o código é o fato e este arquivo deve ser corrigido no mesmo incremento.

## 1. Visão arquitetural

Aplicação **client-side pura** (SPA sem framework), sem backend, sem build step e sem dependências externas de runtime. Todo o processamento e persistência ocorrem no navegador do usuário.

```
Navegador
 ├── index.html            (estrutura/DOM)
 ├── css/styles.css         (apresentação)
 ├── js/storage.js          (persistência — localStorage)
 └── js/app.js              (lógica de aplicação/renderização/eventos)
```

Não há camada de rede, API própria ou banco de dados externo.

## 2. Tecnologias

| Camada | Tecnologia | Observação |
|--------|-----------|------------|
| Marcação | HTML5 | Um único ponto de entrada (`index.html`) |
| Estilo | CSS3 (variáveis CSS / custom properties) | Tema claro/escuro via `:root` e `[data-theme]` |
| Tipografia | Google Fonts (Archivo, IBM Plex Sans, IBM Plex Mono) | Carregado via `<link>` externo (CDN do Google Fonts) |
| Lógica | JavaScript (ES5/ES6 básico, sem transpilação) | Sem framework (React/Vue/etc.) |
| Persistência | `window.localStorage` | Chave `painel-projetos:v1` para dados; `painel-projetos:theme` para preferência de tema |
| Build | Nenhum | Executa diretamente via `file://` ou qualquer servidor estático |

## 3. Componentes

### `js/storage.js` — `ProjectStorage`
Módulo (IIFE) responsável exclusivamente pelo CRUD de projetos no `localStorage`:
- `list()`, `get(id)`, `create(data)`, `update(id, data)`, `remove(id)`.
- Gera IDs no formato `p_<timestamp36>_<random>`.
- Não conhece DOM nem regras de exibição.

### `js/app.js`
Camada de aplicação:
- Renderização do dashboard (KPIs) e da tabela de projetos.
- Validação de formulário (campos obrigatórios, prazo ≥ início, progresso 0–100).
- Regra de negócio: cálculo de status efetivo "Atrasado" (`effectiveStatus`), derivado de `status` + `prazo` + data atual — **não é um valor armazenado**, é sempre recalculado na renderização.
- Filtros (busca textual, filtro por status) aplicados apenas na camada de exibição, sem alterar os dados persistidos.
- Alternância de tema, com preferência salva separadamente do dado de negócio.
- Modal de confirmação de exclusão (sem dependência de `window.confirm`).

### `index.html`
Estrutura única contendo: cabeçalho (band), KPIs, formulário de cadastro/edição, toolbar de busca/filtro, tabela de projetos, modal de confirmação e toast de feedback.

### `tests/` — suíte de testes automatizados (`BKL-101`)
- `tests/test-runner.js` — micro-framework de asserções sem dependências externas (`test`, `assertEqual`, `assertTrue`, `assertFalse`, `summary`).
- `tests/test-cases.js` — casos de teste para `effectiveStatus`, `validateProjectData` e `ProjectStorage` (CRUD).
- `tests/tests.html` — página que carrega a aplicação real num `<iframe>` oculto (`../index.html`), executa a suíte contra `window.PainelProjetosCore`/`window.ProjectStorage` do iframe, faz backup/restauração do `localStorage` (para não afetar dados reais do usuário) e imprime um resumo estável no console (`TEST_SUMMARY total=N passed=N failed=N`) para leitura automatizada.
- `js/app.js` expõe `window.PainelProjetosCore = { effectiveStatus, validateProjectData }` apenas para leitura pelos testes — não altera nenhum comportamento da aplicação.

## 4. Integrações externas

| Integração | Finalidade | Dado enviado |
|------------|-----------|--------------|
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Carregar tipografia | Nenhum dado do usuário — apenas requisição de fonte estática |

Nenhuma outra integração externa (sem APIs de terceiros, sem analytics, sem telemetria).

## 5. Estrutura de diretórios

```
.
├── CLAUDE.md
├── README.md
├── .gitignore
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── storage.js
│   └── app.js
├── tests/
│   ├── test-runner.js
│   ├── test-cases.js
│   └── tests.html
└── docs/
    ├── PROJECT-SPEC.md
    ├── ROADMAP.md
    ├── BACKLOG.md
    ├── ARCHITECTURE.md
    ├── DECISIONS.md
    ├── QA-REPORT.md
    ├── SECURITY-REPORT.md
    └── RELEASE-CHECKLIST.md
```

## 6. Decisões arquiteturais vigentes

1. **Sem framework/build**: escolhido para manter o projeto executável apenas abrindo o `index.html`, atendendo ao requisito de funcionar localmente sem instalação de ferramentas. Ver justificativa completa em [DECISIONS.md](DECISIONS.md).
2. **`localStorage` como única persistência**: adequado ao escopo de teste/uso local single-user; limitação conhecida e documentada (dados não sincronizam entre navegadores/dispositivos).
3. **Status "Atrasado" como valor derivado, não armazenado**: evita inconsistência entre o campo salvo e a passagem do tempo — recalculado a cada renderização a partir da data do sistema.
4. **Separação `storage.js` / `app.js`**: mantém a camada de persistência isolada da camada de apresentação, facilitando uma futura troca de mecanismo de persistência sem reescrever a lógica de UI.
5. **Regras de negócio extraídas como funções puras (`validateProjectData`, `effectiveStatus`)**: permitem testar a lógica crítica isoladamente do DOM, sem exigir framework de testes ou build. Ver `DECISIONS.md`.
6. **Tokens de cor dedicados por contexto (`--accent-badge`, `--eyebrow-ink`) em vez de reaproveitar `--accent` em todo lugar**: quando um mesmo token era usado como texto sobre fundos opostos (claro/escuro) com necessidades de contraste conflitantes, optou-se por variáveis específicas por contexto em vez de um valor de compromisso único. Ver `DECISIONS.md` (BKL-104).

## 7. Restrições atuais conhecidas

- Sem autenticação/autorização (não há usuários distintos).
- Sem API HTTP própria — nada a versionar como contrato de API nesta fase.
- Testes automatizados cobrem as regras de negócio críticas (status "Atrasado", validação de formulário, CRUD de persistência) — ver `tests/` e `BKL-101` em [BACKLOG.md](BACKLOG.md). Não cobrem renderização de UI/DOM (KPIs, tabela) nem interações de usuário (cliques, digitação) — essas continuam validadas manualmente no navegador a cada incremento (ver [QA-REPORT.md](QA-REPORT.md)).
