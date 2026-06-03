const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Produto = require('./Produto');

// Registro central dos models da aplicacao.
const db = { sequelize, Usuario, Produto };

// -------------------------------------------------------------------
// ENTIDADE RELACIONADA: um produtor (Usuario) possui varios Produtos.
// Atende ao requisito de "duas entidades relacionadas" no banco.
// -------------------------------------------------------------------
Usuario.hasMany(Produto, { foreignKey: 'usuarioId', as: 'produtos' });
Produto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'dono' });

module.exports = db;
