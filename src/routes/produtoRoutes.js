const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const produtos = require('../controllers/produtoController');
const { protegerRota, exigirProdutor } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'img', 'produtos');
fs.mkdirSync(uploadDir, { recursive: true });

const uploadProdutoImagem = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const nomeBase = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `produto-${nomeBase}${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Envie um arquivo de imagem valido.'));
    }
    cb(null, true);
  },
});

// Listagem publica de produtos.
router.get('/', produtos.listar);

// Area do produtor (rotas protegidas: exigem login).
router.get('/meus', protegerRota, exigirProdutor, produtos.meusProdutos);
router.get('/novo', protegerRota, exigirProdutor, produtos.mostrarNovo);
router.post('/', protegerRota, exigirProdutor, uploadProdutoImagem.single('imagemArquivo'), produtos.criar);
router.get('/:id/editar', protegerRota, exigirProdutor, produtos.mostrarEditar);

// Detalhe publico de um produto (rota com :id vem depois das rotas fixas).
router.get('/:id', produtos.detalhe);

router.post('/:id', protegerRota, exigirProdutor, uploadProdutoImagem.single('imagemArquivo'), produtos.atualizar);
router.post('/:id/excluir', protegerRota, exigirProdutor, produtos.remover);

module.exports = router;
