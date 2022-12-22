const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Topic extends Model {}

Topic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'id',
            },
        },
        description: {
            type: DataTypes.TEXT,
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        total_shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100000,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'topic',
    }
);

module.exports = Topic;