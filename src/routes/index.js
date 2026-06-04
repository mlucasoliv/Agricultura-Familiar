const express = require('express');
const router = express.Router();
const { protegerRota } = require('../middleware/auth');
const { Produto, Usuario } = require('../models');

const mesesPtBr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const produtosDestaque = [
  { nome: 'Mel Silvestre 500g', produtor: 'João Silva', preco: 'R$ 85,00', emoji: '\u{1F36F}' },
  { nome: 'Queijo Artesanal 400g', produtor: 'Ana Lima', preco: 'R$ 120,00', emoji: '\u{1F9C0}' },
  { nome: 'Farinha de Mandioca 1kg', produtor: 'José Alves', preco: 'R$ 18,00', emoji: '\u{1F33E}' },
  { nome: 'Rapadura 500g', produtor: 'Maria Oliveira', preco: 'R$ 12,50', emoji: '\u{1F36C}' },
  { nome: 'Cachaça Artesanal 1L', produtor: 'Pedro Santos', preco: 'R$ 45,00', emoji: '\u{1F376}' },
  { nome: 'Feijão Verde 1kg', produtor: 'Rosa Mendes', preco: 'R$ 22,00', emoji: '\u{1FAD8}' },
];

const alertas = [
  { tipo: 'aviso', icone: '\u26A0\uFE0F', mensagem: '3 produtos com estoque baixo cadastrados esta semana.' },
  { tipo: 'info', icone: '\u2139\uFE0F', mensagem: '2 novos produtores aguardam aprovação de cadastro.' },
  { tipo: 'sucesso', icone: '\u2705', mensagem: 'Pedido #0042 foi concluído com sucesso.' },
];

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
      produtosDestaque,
      alertas,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/pedidos', protegerRota, (req, res) => {
  res.render('pedidos', {
    title: 'Pedidos',
    activePage: 'pedidos',
    pedidosPendentes: 7,
  });
});

module.exports = router;
