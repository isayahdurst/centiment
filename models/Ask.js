const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ask extends Model {}

Ask.init(
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
            validate: {
                isFloat: true,
            }
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
            },
        },
        ask_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: true,
            },
        },
        expiration_date: {
            type: DataTypes.DATE,
            validate: {
                isDate: true,
            },
            validate: {
                expirationDateAfterAskDate() {
                  if (this.ask_date.isAfter(this.expiration_date)) {
                    throw new Error('Expiration date must be after the ask date.');
                  }
                }
            },
            //Object.expirationDate = Date.now() + 604800000 (7 days)
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'ask',
    }
);

module.exports = Ask;
