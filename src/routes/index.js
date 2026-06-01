const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');

// Rota de teste do layout base.
router.get('/', (req, res) => {
  res.render('pages/dashboard', { title: 'Início', body: '' });
});

// Pagina privada — so acessivel com login (rota protegida pelo middleware).
router.get('/dashboard', protegerRota, (req, res) => {
  res.render('dashboard', { usuario: req.usuario });
});

module.exports = router;
