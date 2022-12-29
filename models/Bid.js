const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Bid extends Model {}

Bid.init (
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        topic_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'topic',
                key: 'id',
            }
        },
        bid_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        expiration_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, //will need to be validated to make sure this is 7 days in the future
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'bid',
    },
);

module.exports = Bid;