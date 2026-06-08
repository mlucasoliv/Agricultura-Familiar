const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { protegerRota } = require('../middleware/auth');

router.post('/', protegerRota, pedidoController.criarPedido);
router.get('/', protegerRota, pedidoController.listarPedidos);
router.post('/:id/status', protegerRota, pedidoController.atualizarStatus);
router.post('/:id/confirmar-recebimento', protegerRota, pedidoController.confirmarRecebimento);
router.post('/:id/reportar', protegerRota, pedidoController.reportarPedido);

module.exports = router;
