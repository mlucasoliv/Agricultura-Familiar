const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const { identificarUsuario } = require('./middleware/auth');
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/index');
const produtoRoutes = require('./routes/produtoRoutes');

const app = express();

// View engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estaticos (CSS, imagens) servidos da pasta /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Leitura de formularios, JSON e cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Identifica o usuario logado em todas as requisicoes (para as views)
app.use(identificarUsuario);

// Rotas
app.use('/', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/', indexRoutes);

// Pagina nao encontrada
app.use((req, res) => {
  res.status(404).render('404');
});

module.exports = app;
