# WenLock Test

Aplicação Full Stack para gerenciamento de usuários, desenvolvida como teste técnico.

O projeto possui uma API REST em NestJS, interface em React e persistência em MySQL. A interface foi construída com base no protótipo fornecido no Adobe XD.

## Funcionalidades

- Cadastro de usuários
- Listagem paginada
- Busca por nome
- Visualização dos dados
- Edição de usuário
- Alteração opcional de senha
- Exclusão com confirmação
- Validação de formulário no frontend e no backend
- Feedback visual de sucesso e cancelamento
- Estado vazio para base sem usuários
- Estado vazio para pesquisa sem resultados
- Documentação da API com Swagger

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Axios
- CSS Modules
- Lucide React

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL
- class-validator
- bcrypt
- Swagger
- Jest
- Supertest

## Estrutura do projeto

```text
WenLock-Test/
├── backend/
├── frontend/
├── database/
└── README.md
```

O frontend e o backend são independentes. Cada aplicação possui suas próprias dependências e arquivo de configuração de ambiente.

## Requisitos

Para executar o projeto localmente é necessário ter instalado:

- Node.js
- npm
- MySQL

## Banco de dados

O projeto utiliza MySQL.

Existe um script auxiliar em:

```text
database/bootstrap.sql
```

Ele cria o banco utilizado no ambiente de desenvolvimento.

Também é possível criar manualmente:

```sql
CREATE DATABASE IF NOT EXISTS wenlock
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

A estrutura das tabelas é criada através das migrations do TypeORM.

## Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com base no `.env.example`.

Exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=wenlock
```

Execute as migrations:

```bash
npm run migration:run
```

Inicie a API:

```bash
npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3000/api
```

## Swagger

Com o backend em execução, a documentação pode ser acessada em:

```text
http://localhost:3000/api/docs
```

A documentação permite consultar os endpoints, payloads e respostas da API.

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/users` | Cadastra um usuário |
| GET | `/api/users` | Lista os usuários |
| GET | `/api/users/:id` | Busca um usuário por ID |
| PATCH | `/api/users/:id` | Atualiza um usuário |
| DELETE | `/api/users/:id` | Exclui um usuário |

A listagem aceita paginação e busca por nome.

Exemplo:

```http
GET /api/users?page=1&limit=15&name=Maria
```

Exemplo de resposta:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria@email.com",
      "registration": "001245",
      "createdAt": "2026-09-01T12:00:00.000Z",
      "updatedAt": "2026-09-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 15,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

## Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com base no `.env.example`.

```env
VITE_API_URL=http://localhost:3000/api
```

Inicie o frontend:

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

## Validações

As regras principais são validadas tanto no frontend quanto no backend.

### Nome

- Obrigatório
- Aceita letras e espaços
- Suporta caracteres acentuados

### E-mail

- Obrigatório
- Deve possuir formato válido
- Não pode ser duplicado

### Matrícula

- Obrigatória
- Aceita apenas números
- Não pode ser duplicada

A matrícula é armazenada como texto para não perder zeros à esquerda, como em `001245`.

### Senha

- Obrigatória no cadastro
- Deve possuir exatamente 6 caracteres
- Aceita letras e números
- É armazenada com hash usando bcrypt

A senha e o hash nunca são retornados nas respostas da API.

Na edição, a senha é opcional. Se o campo ficar vazio, a senha atual é mantida.

## Pesquisa e paginação

A busca é feita pelo nome do usuário.

No frontend foi aplicado um debounce de 350 ms para evitar requisições a cada tecla pressionada.

A paginação é feita no backend. A interface mostra o total de registros, página atual, total de páginas e controles de navegação.

## Estados vazios

A tela diferencia dois cenários.

Quando não existe nenhum usuário cadastrado:

```text
Nenhum Usuário Registrado
Clique em “Cadastrar Usuário” para começar a cadastrar.
```

Quando existe uma pesquisa ativa, mas nenhum usuário foi encontrado:

```text
Nenhum Resultado Encontrado
Não foi possível achar nenhum resultado para sua busca.
```

## Testes

Os testes automatizados estão no backend.

Para executar os testes unitários:

```bash
cd backend
npm test
```

Para os testes end-to-end é utilizado um banco separado.

Crie um `.env.test`:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=wenlock_test
```

Depois execute:

```bash
npm run test:e2e
```

Os testes cobrem o fluxo principal do CRUD, validações, conflitos de e-mail e matrícula, paginação, busca, usuário inexistente e garantia de que o hash da senha não seja exposto.

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Algumas decisões do projeto

A atualização utiliza `PATCH`, enviando apenas os campos que realmente foram alterados.

A confirmação de senha existe somente no frontend, já que ela serve para validar a digitação do usuário e não faz parte da entidade persistida.

As credenciais de banco não são versionadas. Os arquivos `.env.example` servem apenas como referência de configuração.

Os testes end-to-end utilizam um banco separado para não interferir nos dados do ambiente de desenvolvimento.

O layout segue a referência visual fornecida no Adobe XD, mantendo as regras funcionais do teste como prioridade em pontos onde havia alguma diferença entre o texto do requisito e o protótipo.
