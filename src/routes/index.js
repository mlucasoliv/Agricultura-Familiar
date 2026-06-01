const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');

// Pagina inicial publica.
router.get('/', (req, res) => {
  res.render('index');
});

// Pagina privada — so acessivel com login (rota protegida pelo middleware).
router.get('/dashboard', protegerRota, (req, res) => {
  res.render('dashboard', { usuario: req.usuario });
});

module.exports = router;
