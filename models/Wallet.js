const { Model, DataTypes } = require('sequelize');

const sequelize = require('./../config/connection');

class Wallet extends Model {} 

Wallet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
            allowNull: false,
        },
        balance: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'wallet',
    },
);

module.exports = Wallet;