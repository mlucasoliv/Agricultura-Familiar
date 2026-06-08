require('dotenv').config();

const app = require('./app');
const { DataTypes } = require('sequelize');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    await garantirColunasProduto();
    await garantirColunasPedido();
    // Cria/atualiza as tabelas de acordo com os models.
    await sequelize.sync();
    console.log('Banco de dados conectado.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a aplicacao:', err);
    process.exit(1);
  }
}

iniciar();

async function garantirColunasProduto() {
  const queryInterface = sequelize.getQueryInterface();
  let produtos;

  try {
    produtos = await queryInterface.describeTable('produtos');
  } catch (err) {
    return;
  }

  if (!produtos.imagemUrl) {
    await queryInterface.addColumn('produtos', 'imagemUrl', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!produtos.usuarioId) {
    await queryInterface.addColumn('produtos', 'usuarioId', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
  }
}

async function garantirColunasPedido() {
  const queryInterface = sequelize.getQueryInterface();
  let pedidos;

  try {
    pedidos = await queryInterface.describeTable('pedidos');
  } catch (err) {
    return;
  }

  if (!pedidos.recebimentoConfirmado) {
    await queryInterface.addColumn('pedidos', 'recebimentoConfirmado', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  if (!pedidos.reportado) {
    await queryInterface.addColumn('pedidos', 'reportado', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  if (!pedidos.reportMotivo) {
    await queryInterface.addColumn('pedidos', 'reportMotivo', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!pedidos.reportadoEm) {
    await queryInterface.addColumn('pedidos', 'reportadoEm', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }
}
