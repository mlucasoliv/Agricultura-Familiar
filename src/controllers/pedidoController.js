const { Pedido, Produto, Usuario } = require('../models');

async function listarPedidosDoUsuario(usuario, limit) {
  const options = {
    include: [
      { model: Usuario, as: 'comprador', attributes: ['id', 'nome', 'email'] },
      { model: Produto, as: 'produto', attributes: ['id', 'nome', 'preco', 'unidade', 'usuarioId'] },
    ],
    order: [['createdAt', 'DESC']],
  };

  if (limit) {
    options.limit = limit;
  }

  if (usuario.tipo === 'produtor') {
    options.include[1].where = { usuarioId: usuario.id };
  } else {
    options.where = { compradorId: usuario.id };
  }

  return Pedido.findAll(options);
}

exports.criarPedido = async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;
    const compradorId = req.usuario.id;
    const quantidadeNormalizada = Math.max(parseInt(quantidade, 10) || 1, 1);
    const produto = await Produto.findByPk(produtoId);

    if (!produto || !produto.disponivel) {
      return res.status(404).render('404', { title: 'Produto indisponivel' });
    }

    if (produto.usuarioId === compradorId) {
      return res.redirect(`/produtos/${produto.id}`);
    }

    await Pedido.create({
      quantidade: quantidadeNormalizada,
      produtoId,
      compradorId,
    });

    res.redirect('/pedidos');
  } catch (error) {
    res.status(500).send('Erro ao processar o pedido.');
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await listarPedidosDoUsuario(req.usuario);
    const pedidosPendentes = pedidos.filter((pedido) => pedido.status === 'pendente').length;

    res.render('pedidos', {
      title: 'Pedidos',
      activePage: 'pedidos',
      usuario: req.usuario,
      isProdutor: req.usuario.tipo === 'produtor',
      pedidos,
      pedidosPendentes,
    });
  } catch (error) {
    res.status(500).send('Erro ao carregar a listagem de pedidos.');
  }
};

exports.listarPedidosDoUsuario = listarPedidosDoUsuario;
