const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Listing extends Model {}

Listing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        transaction_type: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        topic_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'topic',
                key: 'id',
            },
        },
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        listed_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        sold_date: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'listing',
    },
);

module.exports = Listing;