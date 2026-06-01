require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
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
