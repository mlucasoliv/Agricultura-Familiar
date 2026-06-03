const express = require('express');
const router = express.Router();
const produtos = require('../controllers/produtoController');
const { protegerRota } = require('../middleware/auth');

// Listagem publica de produtos.
router.get('/', produtos.listar);

// Area do produtor (rotas protegidas: exigem login).
router.get('/meus', protegerRota, produtos.meusProdutos);
router.get('/novo', protegerRota, produtos.mostrarNovo);
router.post('/', protegerRota, produtos.criar);
router.get('/:id/editar', protegerRota, produtos.mostrarEditar);

// Detalhe publico de um produto (rota com :id vem depois das rotas fixas).
router.get('/:id', produtos.detalhe);

router.post('/:id', protegerRota, produtos.atualizar);
router.post('/:id/excluir', protegerRota, produtos.remover);

module.exports = router;
