const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');
const { Produto, Usuario } = require('../models');

const mesesPtBr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function montarGraficoProdutos(produtos) {
  const hoje = new Date();
  const meses = [];

  for (let i = 5; i >= 0; i -= 1) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push({
      chave: `${data.getFullYear()}-${data.getMonth()}`,
      mes: `${mesesPtBr[data.getMonth()]}/${String(data.getFullYear()).slice(-2)}`,
      total: 0,
    });
  }

  produtos.forEach((produto) => {
    if (!produto.createdAt) return;
    const data = new Date(produto.createdAt);
    const chave = `${data.getFullYear()}-${data.getMonth()}`;
    const item = meses.find((mes) => mes.chave === chave);
    if (item) item.total += 1;
  });

  const maiorTotal = Math.max(...meses.map((mes) => mes.total), 1);

  return meses.map((mes) => ({
    mes: mes.mes,
    total: mes.total,
    altura: Math.max(8, Math.round((mes.total / maiorTotal) * 100)),
  }));
}

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
    let produtosParaGrafico;

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
      produtosParaGrafico = await Produto.findAll({
        where: { usuarioId: req.usuario.id },
        attributes: ['createdAt'],
      });
    } else {
      produtosRecentes = await Produto.findAll({
        where: { disponivel: true },
        include: [{ model: Usuario, as: 'dono', attributes: ['nome'] }],
        order: [['createdAt', 'DESC']],
        limit: 6,
      });
      produtosParaGrafico = await Produto.findAll({
        attributes: ['createdAt'],
      });
    }

    const produtosPorMes = montarGraficoProdutos(produtosParaGrafico);

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
      produtosPorMes,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
