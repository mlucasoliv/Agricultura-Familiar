const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

// Cadastro
router.get('/cadastro', auth.mostrarCadastro);
router.post('/cadastro', auth.cadastrar);

// Login
router.get('/login', auth.mostrarLogin);
router.post('/login', auth.login);

// Logout (remove o token)
router.post('/logout', auth.logout);

module.exports = router;
