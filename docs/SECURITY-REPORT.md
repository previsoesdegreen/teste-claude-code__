# SECURITY-REPORT.md — Checklist e Achados de Segurança

> Deve ser revisado antes de qualquer release (regra 19 do `CLAUDE.md`). Achados não devem ser ocultados; se um item não se aplica, isso é registrado explicitamente com o motivo.

## Data da última revisão
2026-09-14 (revisado novamente após a adição da suíte de testes em `tests/` — BKL-101)

## 1. Dependências

| Item | Situação |
|------|----------|
| Dependências de terceiros (npm/bibliotecas JS) | **Nenhuma.** O projeto não usa `package.json` nem bibliotecas JS de terceiros — apenas HTML/CSS/JS nativos. |
| Fontes externas carregadas | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) via `<link>`. Não executa script de terceiros, apenas CSS/fonte estática. |
| Auditoria de vulnerabilidade de dependências (`npm audit` ou similar) | **NÃO EXECUTADO** — não aplicável, pois não há dependências de pacote a auditar. |

## 2. Segredos e credenciais

| Item | Situação |
|------|----------|
| Senhas, tokens, chaves de API no código-fonte | Nenhum encontrado (verificação manual do conteúdo de `index.html`, `css/styles.css`, `js/*.js`). |
| Arquivo `.env` ou similar | Não existe no projeto. `.gitignore` já bloqueia `.env`, `.env.*`, `*.pem`, `*.key`, `*credentials*`, `*secret*` caso venham a ser criados. |
| Uso de variáveis de ambiente para dados sensíveis | Não aplicável nesta fase — o projeto não possui integrações que exijam segredos (sem backend, sem API própria, sem chaves de terceiros). Caso uma integração futura exija segredos, a regra 14 do `CLAUDE.md` exige uso de variáveis de ambiente, nunca hardcoded. |
| Credenciais Git/GitHub usadas neste projeto | Autenticação do `git push` é feita via Windows Credential Manager, fora do repositório e fora do controle do assistente. Nenhuma credencial foi manipulada, lida ou registrada em arquivo. |

## 3. Autenticação e autorização

| Item | Situação |
|------|----------|
| Autenticação de usuários | **Não existe.** A aplicação não distingue usuários — qualquer pessoa com acesso ao navegador/dispositivo acessa e edita todos os dados. Limitação conhecida e documentada em `PROJECT-SPEC.md`/README. |
| Autorização/controle de acesso | **Não existe**, pelo mesmo motivo acima. |
| Risco associado | Baixo para o escopo atual (uso local, single-user, sem dados de terceiros ou informação sensível/pessoal cadastrada por definição de escopo). Se o projeto evoluir para uso multiusuário ou dados sensíveis, autenticação/autorização passam a ser requisito obrigatório antes de qualquer release nesse novo escopo. |

## 4. Validação de entrada

| Item | Situação |
|------|----------|
| Validação de campos obrigatórios | Implementada em `js/app.js` (`validate()`): nome, responsável, datas, status e progresso (0–100) são obrigatórios. |
| Validação de coerência de datas | Implementada: prazo não pode ser anterior à data de início. |
| Sanitização contra XSS ao exibir dados na tabela | Implementada: função `escapeHtml()` usada ao renderizar nome e responsável na tabela, prevenindo injeção de HTML/script via esses campos. |
| Validação de tipo/faixa numérica (progresso) | Implementada: valor numérico entre 0 e 100. |
| Validação client-side vs. server-side | Como não há servidor, toda validação é client-side. Isso é aceitável apenas porque não há backend nem múltiplos usuários confiando nos mesmos dados — o próprio usuário só pode "atacar" seus próprios dados locais, sem impacto em terceiros. |

## 5. Exposição de dados

| Item | Situação |
|------|----------|
| Dados armazenados | Somente no `localStorage` do navegador do usuário (chave `painel-projetos:v1`). Não trafega para nenhum servidor. |
| Dados enviados para serviços externos | Nenhum. As únicas requisições de rede são para carregar fontes estáticas do Google Fonts — nenhum dado do usuário é enviado. |
| Dados sensíveis (PII) previstos no escopo atual | Os campos "nome do projeto" e "responsável" são de uso interno/corporativo; não há coleta de CPF, e-mail, senha ou outro dado pessoal sensível no escopo atual definido em `PROJECT-SPEC.md`. |

## 6. Outras verificações

| Item | Situação |
|------|----------|
| HTTPS/transporte | Não aplicável — aplicação estática local, sem chamadas de rede próprias (fontes carregadas via HTTPS pelo próprio navegador). |
| Content Security Policy (CSP) | Não configurada. Baixo risco no escopo atual (sem scripts de terceiros, sem entrada de dados executável), mas é uma melhoria recomendada caso o projeto evolua para aceitar conteúdo externo. |
| Verificação de segredos versionados no Git (`git log`/`git diff` antes de commit/push) | Executada manualmente antes do primeiro commit — nenhum arquivo sensível foi incluído (ver histórico de `git status` no commit inicial). |

## 7. Revisão da suíte de testes (`tests/`, BKL-101)

| Item | Situação |
|------|----------|
| Novas dependências de terceiros | Nenhuma — `tests/test-runner.js` é um micro-framework próprio, sem bibliotecas externas. |
| Uso de `eval`/`Function`/injeção de HTML não sanitizado | Nenhum encontrado — resultados são renderizados via `textContent`, nunca `innerHTML` com dado dinâmico. |
| Exposição de superfície nova na aplicação em produção | `window.PainelProjetosCore` é adicionado por `js/app.js` e fica acessível em qualquer página que carregue o script — expõe apenas funções puras de leitura (`effectiveStatus`, `validateProjectData`), sem acesso a dados privados adicionais além do que `ProjectStorage` já expunha publicamente. Risco considerado desprezível: não introduz novo vetor de leitura/escrita de dados. |
| Isolamento dos dados reais do usuário durante os testes | A suíte executa contra o `localStorage` real (mesma origem), mas faz backup do valor da chave `painel-projetos:v1` antes de rodar e o restaura no `finally`, independentemente de sucesso ou falha — mitigação intencional documentada em `DECISIONS.md`/`ARCHITECTURE.md`. |

## 8. Achados abertos / pendências de segurança

- Nenhum achado crítico ou de alta severidade identificado até o momento.
- Pendência de melhoria (baixa prioridade): considerar CSP básica caso o projeto passe a carregar conteúdo de fontes menos controladas.
- Este relatório deve ser revisitado sempre que uma nova integração externa, autenticação ou dado sensível for adicionado ao escopo (ver `PROJECT-SPEC.md`).
