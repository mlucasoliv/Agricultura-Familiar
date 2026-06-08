const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Pedido extends Model {}

Pedido.init(
  {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [1], msg: 'A quantidade deve ser maior que zero.' },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente',
      validate: {
        isIn: {
          args: [['pendente', 'concluido', 'cancelado']],
          msg: 'Status de pedido invalido.',
        },
      },
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedidos',
  }
);

module.exports = Pedido;
