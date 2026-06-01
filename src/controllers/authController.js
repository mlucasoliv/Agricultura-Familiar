const { Usuario } = require('../models');
const { gerarToken } = require('../utils/token');

// Opcoes do cookie httpOnly que guarda o JWT.
const cookieOptions = {
  httpOnly: true, // inacessivel via JavaScript no navegador
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000, // 1 dia
};

exports.mostrarCadastro = (req, res) => {
  res.render('cadastro', {
    title: 'Cadastro',
    activePage: 'cadastro',
    erro: null,
    dados: {},
  });
};

exports.cadastrar = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  try {
    const usuario = await Usuario.create({ nome, email, senha, tipo });
    res.cookie('token', gerarToken(usuario), cookieOptions);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(400).render('cadastro', {
      title: 'Cadastro',
      activePage: 'cadastro',
      erro: traduzErro(err),
      dados: { nome, email, tipo },
    });
  }
};

exports.mostrarLogin = (req, res) => {
  res.render('login', {
    title: 'Entrar',
    activePage: 'login',
    erro: null,
    dados: {},
  });
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await usuario.validarSenha(senha))) {
      return res.status(401).render('login', {
        title: 'Entrar',
        activePage: 'login',
        erro: 'E-mail ou senha invalidos.',
        dados: { email },
      });
    }
    res.cookie('token', gerarToken(usuario), cookieOptions);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('login', {
      title: 'Entrar',
      activePage: 'login',
      erro: 'Erro ao entrar. Tente novamente.',
      dados: { email },
    });
  }
};

// Logout: remove o cookie com o token e volta para a tela de login.
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// Converte erros de validacao do Sequelize em uma mensagem amigavel.
function traduzErro(err) {
  if (err.errors && err.errors.length) {
    return err.errors[0].message;
  }
  return 'Nao foi possivel concluir o cadastro.';
}
