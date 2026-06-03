const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');
const { Produto, Usuario } = require('../models');

// Pagina inicial publica.
router.get('/', (req, res) => {
  res.render('index', { title: 'Início', activePage: 'inicio' });
});

// Pagina privada — so acessivel com login (rota protegida pelo middleware).
router.get('/dashboard', protegerRota, async (req, res, next) => {
  try {
    const isProdutor = req.usuario.tipo === 'produtor';
    const totalProdutos = await Produto.count();
    const totalDisponiveis = await Produto.count({ where: { disponivel: true } });
    const totalProdutores = await Usuario.count({ where: { tipo: 'produtor' } });

    let meusProdutos = 0;
    let meusDisponiveis = 0;
    let meusIndisponiveis = 0;
    let produtosRecentes;

    if (isProdutor) {
      meusProdutos = await Produto.count({ where: { usuarioId: req.usuario.id } });
      meusDisponiveis = await Produto.count({
        where: { usuarioId: req.usuario.id, disponivel: true },
      });
      meusIndisponiveis = await Produto.count({
        where: { usuarioId: req.usuario.id, disponivel: false },
      });
      produtosRecentes = await Produto.findAll({
        where: { usuarioId: req.usuario.id },
        include: [{ model: Usuario, as: 'dono', attributes: ['nome'] }],
        order: [['createdAt', 'DESC']],
        limit: 5,
      });
    } else {
      produtosRecentes = await Produto.findAll({
        where: { disponivel: true },
        include: [{ model: Usuario, as: 'dono', attributes: ['nome'] }],
        order: [['createdAt', 'DESC']],
        limit: 6,
      });
    }

    res.render('dashboard', {
      title: 'Dashboard',
      activePage: 'dashboard',
      usuario: req.usuario,
      isProdutor,
      totalProdutos,
      totalDisponiveis,
      totalProdutores,
      meusProdutos,
      meusDisponiveis,
      meusIndisponiveis,
      produtosRecentes,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
