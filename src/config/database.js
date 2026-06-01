const path = require('path');
const { Sequelize } = require('sequelize');

// Instancia unica do Sequelize usando SQLite (banco em arquivo, sem servidor).
// O arquivo database.sqlite e criado automaticamente na raiz do projeto.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;
