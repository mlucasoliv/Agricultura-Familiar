# Plataforma de Agricultura Familiar e Venda Direta

Sistema web que conecta produtores da agricultura familiar a consumidores,
permitindo a venda direta de produtos, sem intermediarios.

## Tecnologias

- **Node.js + Express** — servidor web
- **EJS** — renderizacao das paginas (views)
- **Sequelize + SQLite** — ORM e banco de dados (arquivo local, sem servidor)
- **JWT (cookie httpOnly)** — autenticacao
- **bcryptjs** — hash de senhas

## Como rodar o projeto

1. Instale as dependencias:
   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo e defina um segredo proprio:
   ```bash
   cp .env.example .env
   # edite o .env e troque o JWT_SECRET (ex.: openssl rand -hex 32)
   ```

3. Suba o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   Ou em modo normal:
   ```bash
   npm start
   ```

4. Acesse: http://localhost:3000

O banco `database.sqlite` e criado automaticamente na primeira execucao.

## Estrutura

```
src/
  app.js               # configuracao do Express (EJS, middlewares, rotas)
  server.js            # ponto de entrada (conecta o banco e sobe o servidor)
  config/database.js   # instancia do Sequelize (SQLite)
  models/
    index.js           # registro dos models e associacoes
    Usuario.js         # model de usuario (autenticacao)
  middleware/auth.js   # identifica o usuario e protege rotas privadas
  controllers/         # logica de cadastro, login e logout
  routes/              # definicao das rotas
  views/               # paginas EJS
public/css/style.css   # estilos
```

## Autenticacao (ja implementado)

- Cadastro de usuario com senha protegida por hash (bcrypt)
- Login com geracao de token JWT, guardado em cookie httpOnly
- Rotas privadas protegidas por middleware (ex.: `/dashboard`)
- Logout que remove o token

## Proxima entidade (a fazer)

Para atender o requisito de **duas entidades relacionadas**, o model `Produto`
deve ser criado e associado ao `Usuario`. Ha um exemplo comentado pronto em
`src/models/index.js` mostrando a associacao (`Usuario hasMany Produto`).

## Variaveis de ambiente

Veja `.env.example`. O arquivo `.env` **nao** deve ser versionado (ja esta no
`.gitignore`), pois contem o segredo usado para assinar os tokens.
