const { verificarToken } = require('../utils/token');
const { Usuario } = require('../models');

// Le o token do cookie (se houver), valida e disponibiliza o usuario logado
// em req.usuario e res.locals.usuario (para uso nas views). Nao bloqueia o
// acesso — apenas identifica quem esta logado.
async function identificarUsuario(req, res, next) {
  res.locals.usuario = null;
  req.usuario = null;

  const token = req.cookies && req.cookies.token;
  if (token) {
    try {
      const payload = verificarToken(token);
      const usuario = await Usuario.findByPk(payload.id);
      if (usuario) {
        req.usuario = usuario;
        res.locals.usuario = usuario;
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

module.exports = { identificarUsuario, protegerRota };
