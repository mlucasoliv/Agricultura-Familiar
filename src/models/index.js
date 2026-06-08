const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Produto = require('./Produto');
const Pedido = require('./Pedido');

// Registro central dos models da aplicacao.
const db = { sequelize, Usuario, Produto, Pedido };

// Entidades relacionadas:
// - um produtor (Usuario) possui varios Produtos;
// - um comprador (Usuario) possui varios Pedidos;
// - um Pedido pertence a um Produto.
Usuario.hasMany(Produto, { foreignKey: 'usuarioId', as: 'produtos' });
Produto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'dono' });
Usuario.hasMany(Pedido, { foreignKey: 'compradorId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'compradorId', as: 'comprador' });
Produto.hasMany(Pedido, { foreignKey: 'produtoId', as: 'pedidos' });
Pedido.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

module.exports = db;
