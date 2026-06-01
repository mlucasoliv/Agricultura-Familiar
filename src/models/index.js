const sequelize = require('../config/database');
const Usuario = require('./Usuario');

// Registro central dos models da aplicacao.
const db = { sequelize, Usuario };

// -------------------------------------------------------------------
// ENTIDADE RELACIONADA (responsabilidade de quem cuida de Produtos).
// Quando o model Produto existir, registre-o aqui e defina a associacao
// com Usuario para atender o requisito de "duas entidades relacionadas":
//
//   const Produto = require('./Produto');
//   db.Produto = Produto;
//   Usuario.hasMany(Produto, { foreignKey: 'usuarioId', as: 'produtos' });
//   Produto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'dono' });
// -------------------------------------------------------------------

module.exports = db;
