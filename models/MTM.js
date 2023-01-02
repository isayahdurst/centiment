const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class MTM extends Model {}

MTM.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
            allowNull: false,
            references: {
                model: 'topic',
                key: 'id',
            },
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        watching: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'mtm',
    }
);

module.exports = MTM;
