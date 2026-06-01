const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

class Usuario extends Model {
  // Compara uma senha em texto puro com o hash salvo no banco.
  async validarSenha(senha) {
    return bcrypt.compare(senha, this.senha);
  }
}

Usuario.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'O nome e obrigatorio.' } },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Este e-mail ja esta cadastrado.' },
      validate: { isEmail: { msg: 'Informe um e-mail valido.' } },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6, 100], msg: 'A senha deve ter ao menos 6 caracteres.' },
      },
    },
    tipo: {
      type: DataTypes.ENUM('consumidor', 'produtor'),
      allowNull: false,
      defaultValue: 'consumidor',
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    hooks: {
      // Gera o hash da senha antes de gravar (a validacao de tamanho roda
      // antes deste hook, sobre a senha em texto puro).
      beforeSave: async (usuario) => {
        if (usuario.changed('senha')) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      },
    },
  }
);

module.exports = Usuario;
