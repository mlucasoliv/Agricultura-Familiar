const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente'
    },
    produtoId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    compradorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Pedido;
