const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');

// Pagina inicial publica.
router.get('/', (req, res) => {
  res.render('index', { title: 'Início', activePage: 'inicio' });
});

// Pagina privada — so acessivel com login (rota protegida pelo middleware).
router.get('/dashboard', protegerRota, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    activePage: 'dashboard',
    usuario: req.usuario,
  });
});

module.exports = router;
