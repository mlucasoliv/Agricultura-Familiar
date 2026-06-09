# AgroFamilia

Plataforma web para venda direta entre produtores da agricultura familiar e consumidores locais. O sistema permite divulgar produtos, fazer pedidos e acompanhar o andamento das vendas sem intermediarios.

## Funcionalidades

- Cadastro e login de usuarios com dois perfis: produtor e consumidor.
- Autenticacao com JWT em cookie `httpOnly`.
- Catalogo publico de produtos com busca por nome.
- Area do produtor para cadastrar, editar, excluir e gerenciar produtos.
- Upload de imagem do produto, com fallback visual padrao quando nao houver foto.
- Dashboard exclusivo para produtores com indicadores, produtos recentes, pedidos recentes e grafico de evolucao do catalogo.
- Criacao de pedidos por consumidores.
- Acompanhamento de pedidos com status: pendente, em preparacao, a caminho, entregue, concluido, cancelado e reportado.
- Confirmacao de recebimento pelo consumidor.
- Reporte de problema pelo consumidor.
- Layout responsivo com navbar superior, cards, tabelas adaptadas para mobile e CTAs destacados.

## Tecnologias

- **Node.js + Express**: servidor web e rotas.
- **EJS**: templates renderizados no servidor.
- **Sequelize + SQLite**: ORM e banco local.
- **Bootstrap 5**: base de componentes e comportamento responsivo.
- **CSS customizado**: identidade visual e layout.
- **Multer**: upload de imagens de produtos.
- **JWT**: autenticacao por token.
- **bcryptjs**: hash de senhas.

## Como rodar

1. Instale as dependencias:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

3. Edite o `.env` e defina um valor proprio para `JWT_SECRET`.

4. Rode em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   Ou rode em modo normal:

   ```bash
   npm start
   ```

5. Acesse:

   ```text
   http://localhost:3000
   ```

O arquivo `database.sqlite` e criado automaticamente na primeira execucao.

## Estrutura principal

```text
src/
  app.js                    # Configuracao do Express, EJS, middlewares e rotas
  server.js                 # Conecta o banco, garante colunas e inicia o servidor
  config/
    database.js             # Configuracao do Sequelize com SQLite
  controllers/
    authController.js       # Cadastro, login e logout
    produtoController.js    # Catalogo e CRUD de produtos
    pedidoController.js     # Criacao, listagem e acompanhamento de pedidos
  middleware/
    auth.js                 # Identificacao do usuario, protecao de rotas e permissoes
  models/
    Usuario.js              # Usuarios produtores e consumidores
    Produto.js              # Produtos cadastrados pelos produtores
    Pedido.js               # Pedidos feitos pelos consumidores
    index.js                # Associacoes entre os models
  routes/
    authRoutes.js           # Rotas de autenticacao
    index.js                # Home, perfil e dashboard
    produtoRoutes.js        # Rotas de produtos
    pedidoRoutes.js         # Rotas de pedidos
  views/
    partials/               # Header, navbar, footer e helpers EJS
    produtos/               # Listagem, detalhe, formulario e gestao de produtos
    *.ejs                   # Paginas principais

public/
  css/style.css             # Estilos globais e responsividade
  js/main.js                # Comportamento da navbar mobile
  img/                      # Imagens estaticas e uploads de produtos
```

## Rotas principais

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `GET` | `/` | Home publica |
| `GET` | `/login` | Tela de login |
| `GET` | `/cadastro` | Tela de cadastro |
| `POST` | `/login` | Autentica usuario |
| `POST` | `/logout` | Encerra sessao |
| `GET` | `/produtos` | Catalogo publico |
| `GET` | `/produtos/:id` | Detalhe de produto |
| `GET` | `/dashboard` | Painel do produtor |
| `GET` | `/perfil` | Perfil do usuario logado |
| `GET` | `/pedidos` | Pedidos do usuario logado |
| `POST` | `/pedidos` | Cria pedido |
| `POST` | `/pedidos/:id/status` | Atualiza status do pedido |
| `POST` | `/pedidos/:id/confirmar-recebimento` | Confirma recebimento |
| `POST` | `/pedidos/:id/reportar` | Reporta problema no pedido |
| `GET` | `/produtos/meus` | Gestao de produtos do produtor |
| `GET` | `/produtos/novo` | Formulario de novo produto |
| `POST` | `/produtos` | Cria produto |
| `GET` | `/produtos/:id/editar` | Formulario de edicao |
| `POST` | `/produtos/:id` | Atualiza produto |
| `POST` | `/produtos/:id/excluir` | Remove produto |

## Regras de acesso

- Consumidores podem ver produtos, criar pedidos, acompanhar suas compras, confirmar recebimento e reportar problemas.
- Produtores podem acessar o dashboard, gerenciar seus produtos e atualizar o status de pedidos recebidos.
- Consumidores nao acessam o dashboard; quando tentam acessar `/dashboard`, sao redirecionados para `/produtos`.
- Rotas privadas exigem login.

## Banco de dados

O projeto usa SQLite local. O Sequelize cria as tabelas na primeira execucao e o `server.js` garante colunas adicionadas em evolucoes recentes, como:

- `produtos.imagemUrl`
- `produtos.usuarioId`
- `pedidos.recebimentoConfirmado`
- `pedidos.reportado`
- `pedidos.reportMotivo`
- `pedidos.reportadoEm`

## Uploads

As imagens enviadas pelos produtores ficam em:

```text
public/img/produtos/
```

O limite atual de upload e de 2 MB por imagem. Produtos sem imagem usam:

```text
public/img/produto-default.svg
```

## Variaveis de ambiente

Veja `.env.example`.

O arquivo `.env` nao deve ser versionado, pois contem o segredo usado para assinar tokens JWT.
