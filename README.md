# Painel de Projetos

Aplicação web para cadastro e acompanhamento de projetos, com dashboard de indicadores.

## Funcionalidades

- **Dashboard** com indicadores: total de projetos, em andamento, concluídos e atrasados.
- **Cadastro de projetos**: nome, responsável, data de início, prazo, status e percentual de progresso.
- **Lista de projetos** com busca por nome/responsável e filtro por status.
- **Edição** e **exclusão** (com confirmação) de projetos.
- Status **"Atrasado"** é calculado automaticamente: qualquer projeto não concluído cujo prazo já passou aparece como atrasado no dashboard e na lista, mesmo que o campo "status" salvo seja "Planejado" ou "Em andamento".
- Tema claro/escuro (botão no cabeçalho), com preferência salva no navegador.
- Layout responsivo (desktop, tablet e celular).

## Arquitetura

Aplicação client-side simples, sem build e sem dependências externas — basta abrir o `index.html` no navegador.

```
.
├── index.html        Estrutura da página (formulário, dashboard, tabela)
├── css/
│   └── styles.css    Estilos (tema claro/escuro, layout responsivo)
├── js/
│   ├── storage.js     Camada de persistência (CRUD em localStorage)
│   └── app.js          Lógica da aplicação (validação, renderização, eventos)
└── README.md
```

Os dados dos projetos são armazenados no **`localStorage`** do navegador (chave `painel-projetos:v1`). Isso significa que:
- Os dados persistem entre sessões, mas ficam vinculados ao navegador/perfil usado.
- Não há backend nem banco de dados — adequado para o escopo deste teste (uso local).

## Como executar

Não é necessário instalar nada. Duas formas de rodar:

**Opção 1 — abrir diretamente:**
Dê duplo clique no arquivo `index.html` (ou clique com o botão direito → Abrir com → seu navegador).

**Opção 2 — servidor local (recomendado, evita eventuais restrições do navegador a arquivos locais):**

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

Se preferir Node.js:

```bash
npx serve .
```

## Testes realizados

Testes manuais na aplicação em execução (via navegador):

1. **Cadastro de projeto** — criado projeto com todos os campos preenchidos; apareceu corretamente na lista e nos indicadores.
2. **Validação de formulário** — envio com campos vazios exibe mensagens de erro por campo e não salva; prazo anterior à data de início é bloqueado.
3. **Edição** — projeto existente carregado no formulário, alterado e salvo; lista e dashboard atualizados sem duplicar registro.
4. **Exclusão** — modal de confirmação exibido; ao confirmar, o projeto some da lista e dos indicadores; ao cancelar, nada é alterado.
5. **Cálculo de "Atrasado"** — projeto com prazo no passado e status diferente de "Concluído" passa a ser exibido/contado como "Atrasado" automaticamente.
6. **Busca e filtro** — busca por nome/responsável e filtro por status combinados corretamente; mensagem de "nenhum resultado" quando aplicável.
7. **Persistência** — dados permanecem após recarregar a página (F5), confirmando o uso do `localStorage`.
8. **Responsividade** — layout testado em larguras de desktop e mobile (~390px), sem rolagem horizontal indevida.
9. **Tema claro/escuro** — alternância via botão no cabeçalho, com preferência mantida ao recarregar.

## Limitações conhecidas

- Os dados ficam apenas no navegador local (sem sincronização entre dispositivos ou usuários, sem backend/API).
- Não há autenticação/controle de acesso — qualquer pessoa com acesso ao navegador vê e edita os projetos.
- Sem paginação: para volumes muito grandes de projetos, a tabela pode ficar longa (não é um problema para o uso local esperado neste teste).
- Sem exportação de dados (CSV/Excel) — poderia ser adicionado como evolução futura.
