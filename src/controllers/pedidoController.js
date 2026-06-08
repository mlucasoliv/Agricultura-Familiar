const { Pedido, Produto, Usuario } = require('../models');

const statusProdutorPermitidos = ['pendente', 'em_preparacao', 'a_caminho', 'entregue', 'cancelado'];
const statusEmAberto = ['pendente', 'em_preparacao', 'a_caminho', 'entregue', 'reportado'];

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
    const pedidosPendentes = pedidos.filter((pedido) => statusEmAberto.includes(pedido.status)).length;

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

exports.atualizarStatus = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'produtor') {
      return res.status(403).render('403', {
        title: 'Acesso restrito',
        activePage: 'pedidos',
      });
    }

    const { status } = req.body;
    if (!statusProdutorPermitidos.includes(status)) {
      return res.redirect('/pedidos');
    }

    const pedido = await buscarPedidoDoProdutor(req.params.id, req.usuario.id);
    if (!pedido) return res.status(404).render('404');

    await pedido.update({
      status,
      reportado: status === 'cancelado' ? false : pedido.reportado,
    });

    res.redirect('/pedidos');
  } catch (error) {
    res.status(500).send('Erro ao atualizar o status do pedido.');
  }
};

exports.confirmarRecebimento = async (req, res) => {
  try {
    const pedido = await buscarPedidoDoCliente(req.params.id, req.usuario.id);
    if (!pedido) return res.status(404).render('404');

    if (!['a_caminho', 'entregue'].includes(pedido.status)) {
      return res.redirect('/pedidos');
    }

    await pedido.update({
      status: 'concluido',
      recebimentoConfirmado: true,
      reportado: false,
      reportMotivo: null,
      reportadoEm: null,
    });

    res.redirect('/pedidos');
  } catch (error) {
    res.status(500).send('Erro ao confirmar o recebimento.');
  }
};

exports.reportarPedido = async (req, res) => {
  try {
    const pedido = await buscarPedidoDoCliente(req.params.id, req.usuario.id);
    if (!pedido) return res.status(404).render('404');

    if (['concluido', 'cancelado'].includes(pedido.status)) {
      return res.redirect('/pedidos');
    }

    const motivo = (req.body.motivo || '').trim();
    await pedido.update({
      status: 'reportado',
      reportado: true,
      reportMotivo: motivo || 'Cliente informou problema no recebimento.',
      reportadoEm: new Date(),
    });

    res.redirect('/pedidos');
  } catch (error) {
    res.status(500).send('Erro ao reportar o pedido.');
  }
};

exports.listarPedidosDoUsuario = listarPedidosDoUsuario;

function buscarPedidoDoProdutor(id, produtorId) {
  return Pedido.findOne({
    where: { id },
    include: [
      { model: Usuario, as: 'comprador', attributes: ['id', 'nome', 'email'] },
      {
        model: Produto,
        as: 'produto',
        attributes: ['id', 'nome', 'usuarioId'],
        where: { usuarioId: produtorId },
      },
    ],
  });
}

function buscarPedidoDoCliente(id, compradorId) {
  return Pedido.findOne({
    where: { id, compradorId },
    include: [
      { model: Usuario, as: 'comprador', attributes: ['id', 'nome', 'email'] },
      { model: Produto, as: 'produto', attributes: ['id', 'nome', 'usuarioId'] },
    ],
  });
}
