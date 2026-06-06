const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { protegerRota } = require('../middleware/auth');

router.post('/', protegerRota, pedidoController.criarPedido);
router.get('/', protegerRota, pedidoController.listarPedidos);

module.exports = router;