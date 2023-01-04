const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Shares extends Model {}

Shares.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topic',
                key: 'id',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
            }
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'shares',
    }
);

module.exports = Shares;
