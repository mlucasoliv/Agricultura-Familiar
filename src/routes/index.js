const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');

// Pagina inicial publica.
router.get('/', (req, res) => {
  res.render('index');
});

// Pagina privada — so acessivel com login (rota protegida pelo middleware).
router.get('/dashboard', protegerRota, (req, res) => {
  //  Criei a variável de pedidos aqui para alimentar a tabela do Commit 6
  const pedidos = []; 

  res.render('dashboard', { 
    usuario: req.usuario,
    pedidos: pedidos //  Enviei os pedidos para a tela junto com o usuário
  });
});

module.exports = router;
