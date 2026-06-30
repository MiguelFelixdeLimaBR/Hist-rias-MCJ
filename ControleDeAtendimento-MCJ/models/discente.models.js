const {DataTypes} = require('sequelize');
const sequelize = require('../config/bd');

const Discente = sequelize.define(
    'Discente',
    {
        nome: {
            type: DataTypes.STRING,
        },
        idade: {
            type: DataTypes.INTEGER,
        },
        matricula: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
        },
        curso: {
            type: DataTypes.STRING,
        }
    },
    {
        tableName: 'Discentes',
        timestamps: true
    }
);

module.exports = Discente;  