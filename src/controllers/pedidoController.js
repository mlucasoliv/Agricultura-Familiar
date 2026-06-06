const { Pedido, Usuario } = require('../models');

exports.criarPedido = async (req, res) => {
    try {
        const { produtoId, quantidade } = req.body;
        const compradorId = req.usuario.id; 

        await Pedido.create({
            quantidade,
            produtoId,
            compradorId
        });

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Erro ao processar o pedido.');
    }
};

exports.listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{ model: Usuario, as: 'comprador' }]
        });
        res.render('dashboard', { pedidos });
    } catch (error) {
        res.status(500).send('Erro ao carregar a listagem de pedidos.');
    }
};