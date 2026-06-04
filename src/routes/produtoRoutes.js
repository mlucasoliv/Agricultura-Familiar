const express = require('express');
const router = express.Router();
const produtos = require('../controllers/produtoController');
const { protegerRota, exigirProdutor } = require('../middleware/auth');

// Listagem publica de produtos.
router.get('/', produtos.listar);

// Area do produtor (rotas protegidas: exigem login).
router.get('/meus', protegerRota, exigirProdutor, produtos.meusProdutos);
router.get('/novo', protegerRota, exigirProdutor, produtos.mostrarNovo);
router.post('/', protegerRota, exigirProdutor, produtos.criar);
router.get('/:id/editar', protegerRota, exigirProdutor, produtos.mostrarEditar);

// Detalhe publico de um produto (rota com :id vem depois das rotas fixas).
router.get('/:id', produtos.detalhe);

router.post('/:id', protegerRota, exigirProdutor, produtos.atualizar);
router.post('/:id/excluir', protegerRota, exigirProdutor, produtos.remover);

module.exports = router;
