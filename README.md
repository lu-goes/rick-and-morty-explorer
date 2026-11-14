# Rick & Morty Explorer

Projeto acadêmico de Front-End desenvolvido com HTML5, CSS3 e JavaScript puro. A aplicação consome a [Rick and Morty API](https://rickandmortyapi.com/documentation) e cria cards de personagens dinamicamente.

## Funcionalidades
- Consumo da API REST com `fetch()`.
- Cards criados com `document.createElement()` e inseridos com `appendChild()`.
- Exibição de nome, imagem, status, espécie, gênero e origem.
- Busca por nome e filtro por status.
- Paginação usando os links `info.next` e `info.prev` disponibilizados pela API.
- Estatísticas de personagens, localizações e episódios.
- Layout responsivo para desktop e dispositivos móveis.
- Estados de carregamento, lista vazia e erro de conexão.

## Estrutura
```text
rick-and-morty-explorer/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── docs/
│   └── parte-teorica.pdf
└── README.md
```

## Como executar
1. Extraia a pasta do projeto.
2. Abra a pasta no Visual Studio Code.
3. Execute `index.html` com a extensão Live Server (recomendado), ou abra o arquivo diretamente no navegador.
4. É necessário estar conectado à internet para consultar a API e carregar as imagens.

Não é necessário instalar dependências, configurar servidor ou obter token para as consultas REST públicas usadas neste projeto.

## API utilizada
- Base URL: `https://rickandmortyapi.com/api`
- Personagens: `/character`
- Localizações: `/location`
- Episódios: `/episode`
- Documentação: https://rickandmortyapi.com/documentation

A API retorna JSON. A listagem de personagens possui `info` (contagem e paginação) e `results` (personagens). A documentação informa que são retornados até 20 registros por página e permite filtros por `name`, `status`, `species`, `type` e `gender`.

## Observação acadêmica
Luiza Goes Araujo - Analise e Desenvolvimento de Sistemas - UNIFecaf
