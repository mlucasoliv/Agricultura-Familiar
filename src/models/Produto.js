const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

// Entidade Produto: item ofertado por um produtor (usuario do tipo "produtor").
// Relaciona-se com Usuario via usuarioId (ver associacoes em models/index.js).
class Produto extends Model {}

Produto.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'O nome do produto e obrigatorio.' } },
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'O preco e obrigatorio.' },
        min: { args: [0], msg: 'O preco nao pode ser negativo.' },
      },
    },
    unidade: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'un',
      validate: { notEmpty: { msg: 'Informe a unidade (ex.: kg, duzia, un).' } },
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Produto',
    tableName: 'produtos',
  }
);

module.exports = Produto;
