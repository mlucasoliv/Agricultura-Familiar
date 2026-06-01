const jwt = require('jsonwebtoken');

// Gera um JWT assinado a partir dos dados do usuario.
function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// Verifica e decodifica um JWT. Lanca erro se invalido/expirado.
function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { gerarToken, verificarToken };
