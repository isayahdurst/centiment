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
        balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'user',
              key: 'id',
          },
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'wallet',
    }
);

module.exports = Wallet;