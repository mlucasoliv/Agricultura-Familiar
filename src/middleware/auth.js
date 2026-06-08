const { verificarToken } = require('../utils/token');
const { Pedido, Produto, Usuario } = require('../models');

const statusEmAberto = ['pendente', 'em_preparacao', 'a_caminho', 'entregue', 'reportado'];

// Le o token do cookie (se houver), valida e disponibiliza o usuario logado
// em req.usuario e res.locals.usuario (para uso nas views). Nao bloqueia o
// acesso — apenas identifica quem esta logado.
async function identificarUsuario(req, res, next) {
  res.locals.usuario = null;
  res.locals.pedidosPendentes = 0;
  req.usuario = null;

  const token = req.cookies && req.cookies.token;
  if (token) {
    try {
      const payload = verificarToken(token);
      const usuario = await Usuario.findByPk(payload.id);
      if (usuario) {
        req.usuario = usuario;
        res.locals.usuario = usuario;
        res.locals.pedidosPendentes = await contarPedidosPendentes(usuario);
      }
    } catch (err) {
      // Token invalido ou expirado: remove o cookie.
      res.clearCookie('token');
    }
  }
  next();
}

// Bloqueia rotas privadas: redireciona para /login se nao houver usuario.
function protegerRota(req, res, next) {
  if (!req.usuario) {
    return res.redirect('/login');
  }
  next();
}

async function contarPedidosPendentes(usuario) {
  if (usuario.tipo === 'produtor') {
    return Pedido.count({
      where: { status: statusEmAberto },
      include: [
        {
          model: Produto,
          as: 'produto',
          attributes: [],
          where: { usuarioId: usuario.id },
        },
      ],
    });
  }

  return Pedido.count({
    where: {
      compradorId: usuario.id,
      status: statusEmAberto,
    },
  });
}

function exigirProdutor(req, res, next) {
  if (!req.usuario) {
    return res.redirect('/login');
  }

  if (req.usuario.tipo !== 'produtor') {
    return res.status(403).render('403', {
      title: 'Acesso restrito',
      activePage: 'dashboard',
    });
  }

  next();
}

module.exports = { identificarUsuario, protegerRota, exigirProdutor };
