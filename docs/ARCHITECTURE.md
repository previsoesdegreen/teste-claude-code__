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

## 7. Restrições atuais conhecidas

- Sem autenticação/autorização (não há usuários distintos).
- Sem API HTTP própria — nada a versionar como contrato de API nesta fase.
- Sem testes automatizados ainda (ver `BKL-101` em [BACKLOG.md](BACKLOG.md)).
