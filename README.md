# ONG Semear

Aplicação web de uma ONG fictícia (projeto didático) que apresenta seus projetos sociais e permite cadastrar doadores e voluntários. Construída como SPA (Single Page Application) com HTML, CSS e JavaScript puros.

## Visão geral

- Páginas: Início, Projetos (Cozinha solidária, Reforço escolar, Capacitação profissional), Cadastro e Cadastros salvos.
- Navegação sem recarregar a página, por rotas com hash (`#/`, `#/projetos`, `#/cadastro`, `#/cadastros`).
- Formulário com máscaras, validação de CPF e dados salvos no navegador (localStorage).
- Gráfico de cadastros por tipo (doador/voluntário).

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 semântico + ARIA | Estrutura e acessibilidade |
| CSS3 (variáveis, Grid de 12 colunas, Flexbox) | Design system e layout responsivo |
| JavaScript (módulos em IIFE, namespace `Semear`) | Rotas, templates, formulário, storage |
| Chart.js 4.5.1 (CDN com SRI) | Gráfico de cadastros |
| Git / GitHub | Versionamento (GitFlow) |

## Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari recentes).
- Opcional: Python 3 ou Node.js para servir os arquivos localmente.
- Conexão com a internet para carregar o Chart.js (sem ela, o resumo em texto é exibido).

## Instalação e execução

```bash
git clone <url-do-repositorio>
cd ong-semear-spa
git checkout develop   # ou main para a versão estável
```

Não há dependências a instalar. Para executar:

```bash
# opção 1: abrir html/index.html direto no navegador
# opção 2: servidor local
python3 -m http.server 8000
# acessar http://localhost:8000/html/index.html
```

## Estrutura de diretórios

```
ong-semear-spa/
├── css/            reset.css e style.css (design system)
├── html/           index.html (shell da SPA)
├── imagens/        ilustrações SVG
└── js/
    ├── main.js     ponto de entrada
    └── modules/    dados, templates, router, formulario, mascaras,
                    storage, grafico, cadastros, menu, feedback
```

## Fluxo de trabalho

- GitFlow: `main` (versões estáveis com tag), `develop`, `feature/*`, `release/*` e `hotfix/*`.
- Commits semânticos (Conventional Commits): `feat:`, `fix:`, `docs:`, `chore:`.
- Versionamento semântico (SemVer): tags `vMAJOR.MINOR.PATCH`.

## Validação

- HTML validado com o Nu Html Checker (sem erros nem avisos em `html/index.html`).
- Testes manuais de rotas, formulário, localStorage e teclado.

## Autor

Fabio Machado, projeto da disciplina Desenvolvimento front-end. Dados e organização fictícios.
