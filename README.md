# Camisa 7 - Catalogo de Roupas

Estrutura inicial de um catalogo online com compra via WhatsApp.

## Arquitetura proposta

- `frontend` (Next.js + TypeScript + Tailwind): camada de apresentacao.
- `backend` (Node.js + Express + TypeScript): API REST em camadas.
- `postgres` (Docker): persistencia de produtos, tamanhos e estoque.

Backend organizado em:

- `routes`: define endpoints HTTP
- `controllers`: trata request/response
- `services`: regras de negocio e validacao
- `repositories`: acesso ao banco via SQL

## Estrutura de pastas

```txt
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middlewares
|   |   |-- repositories
|   |   |-- routes
|   |   |-- services
|   |   |-- types
|-- frontend
|   |-- src
|   |   |-- app
|   |   |   |-- home
|   |   |   |-- produto/[id]
|   |   |   |-- admin
|   |   |-- components
|   |   |-- lib
|-- infra
|   |-- sql/init.sql
|-- docker-compose.yml
```

## Banco de dados

Tabelas principais:

- `produtos`: dados da camisa (nome, descricao, preco, imagem, ativo, categoria)
- `tamanhos`: P, M, G, GG
- `produto_tamanhos`: relacao produto x tamanho com estoque

Schema em: `infra/sql/init.sql`

## Fluxo do sistema

1. Cliente entra em `/home` e visualiza produtos.
2. Cliente aplica filtros por tamanho/categoria.
3. Cliente abre `/produto/[id]` para detalhes.
4. Cliente escolhe tamanho e clica em "Comprar no WhatsApp".
5. Frontend monta o link `wa.me` com mensagem automatica.
6. Admin usa endpoints `/api/admin/produtos` para CRUD e estoque.

## Configuracao local

1. Copie `.env.example` para `.env` na raiz.
2. Copie `backend/.env.example` para `backend/.env`.
3. Copie `frontend/.env.example` para `frontend/.env.local`.

Subir banco:

```bash
docker compose up -d
```

Rodar backend:

```bash
cd backend
npm install
npm run dev
```

Rodar frontend:

```bash
cd frontend
npm install
npm run dev
```

## Endpoints iniciais

- `GET /api/produtos`
- `GET /api/produtos/:id`
- `POST /api/admin/produtos`
- `PATCH /api/admin/produtos/:id`
- `DELETE /api/admin/produtos/:id`
