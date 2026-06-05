const { Pedido } = require('../models');

const pedidoController = {
    criarPedido: async (req, res) => {
        try {
            const { produtoId, quantidade } = req.body;
            const compradorId = req.user.id;

            await Pedido.create({
                quantidade,
                produtoId,
                compradorId
            });

            res.redirect('/dashboard');
        } catch (error) {
            res.status(500).send('Erro ao processar o pedido.');
        }
    }
};

module.exports = pedidoController;