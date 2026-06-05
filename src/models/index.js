const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Pedido = require('./Pedido');

const db = { sequelize, Usuario, Pedido };

Usuario.hasMany(Pedido, { foreignKey: 'compradorId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'compradorId', as: 'comprador' });

module.exports = db;
