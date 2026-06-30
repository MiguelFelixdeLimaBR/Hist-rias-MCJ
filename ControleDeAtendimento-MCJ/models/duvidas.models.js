const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Duvidas = sequelize.define(
    'Duvidas',
    {
        nome: {
            type: DataTypes.STRING,
        },
        duvida: {
            type: DataTypes.STRING,
        },
        resposta: {
            type: DataTypes.STRING,
            defaultValue:'Pendente'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:'pendente'
        }
    },
    {
        tableName: 'Duvidas',
        timestamps: true
    }
);

module.exports = Duvidas;  