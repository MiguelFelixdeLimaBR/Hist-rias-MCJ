const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Solicitacao = sequelize.define(
    'Solicitacoes',
     {
        discente: {
            type: DataTypes.STRING,
        },

        matricula: {
            type: DataTypes.STRING,
        },

        titulo: {
            type: DataTypes.STRING,
        },
        causa: {
            type: DataTypes.STRING,
        },
        resolvido: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pendente'
        }
    },
    {
        tableName: 'Solicitacoes',
        timestamps: true
    }
);
module.exports = Solicitacao;