const { Op } = require('sequelize');
const { Produto, Usuario } = require('../models');

// Lista publica de produtos, com o nome do produtor.
// Aceita busca por nome via query string (?q=...).
exports.listar = async (req, res) => {
  const busca = (req.query.q || '').trim();
  const where = busca ? { nome: { [Op.like]: `%${busca}%` } } : {};
  const produtos = await Produto.findAll({
    where,
    include: [{ model: Usuario, as: 'dono', attributes: ['nome'] }],
    order: [['createdAt', 'DESC']],
  });
  res.render('produtos/lista', { produtos, busca });
};

// Formulario de novo produto.
exports.mostrarNovo = (req, res) => {
  res.render('produtos/form', {
    titulo: 'Novo produto',
    acao: '/produtos',
    produto: {},
    erro: null,
  });
};

// Cria um produto vinculado ao produtor logado.
exports.criar = async (req, res) => {
  const { nome, descricao, preco, unidade, disponivel } = req.body;
  try {
    await Produto.create({
      nome,
      descricao,
      preco,
      unidade,
      disponivel: disponivel === 'on' || disponivel === 'true',
      usuarioId: req.usuario.id,
    });
    res.redirect('/produtos/meus');
  } catch (err) {
    res.status(400).render('produtos/form', {
      titulo: 'Novo produto',
      acao: '/produtos',
      produto: { nome, descricao, preco, unidade },
      erro: traduzErro(err),
    });
  }
};

// Lista apenas os produtos do produtor logado (area de gerenciamento).
exports.meusProdutos = async (req, res) => {
  const produtos = await Produto.findAll({
    where: { usuarioId: req.usuario.id },
    order: [['createdAt', 'DESC']],
  });
  res.render('produtos/meus', { produtos });
};

// Formulario de edicao (apenas do proprio produto).
exports.mostrarEditar = async (req, res) => {
  const produto = await buscarDoDono(req);
  if (!produto) return res.status(404).render('404');
  res.render('produtos/form', {
    titulo: 'Editar produto',
    acao: `/produtos/${produto.id}`,
    produto,
    erro: null,
  });
};

// Atualiza um produto do proprio produtor.
exports.atualizar = async (req, res) => {
  const produto = await buscarDoDono(req);
  if (!produto) return res.status(404).render('404');

  const { nome, descricao, preco, unidade, disponivel } = req.body;
  try {
    await produto.update({
      nome,
      descricao,
      preco,
      unidade,
      disponivel: disponivel === 'on' || disponivel === 'true',
    });
    res.redirect('/produtos/meus');
  } catch (err) {
    res.status(400).render('produtos/form', {
      titulo: 'Editar produto',
      acao: `/produtos/${produto.id}`,
      produto: { id: produto.id, nome, descricao, preco, unidade },
      erro: traduzErro(err),
    });
  }
};

// Remove um produto do proprio produtor.
exports.remover = async (req, res) => {
  const produto = await buscarDoDono(req);
  if (produto) await produto.destroy();
  res.redirect('/produtos/meus');
};

// Busca um produto pelo id garantindo que pertence ao usuario logado.
async function buscarDoDono(req) {
  return Produto.findOne({
    where: { id: req.params.id, usuarioId: req.usuario.id },
  });
}

// Converte erros de validacao do Sequelize em mensagem amigavel.
function traduzErro(err) {
  if (err.errors && err.errors.length) {
    return err.errors[0].message;
  }
  return 'Nao foi possivel salvar o produto.';
}
