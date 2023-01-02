const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');
const { User } = require('../models');

class Bid extends Model {}

Bid.init(
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
            },
        },
        // NOTE: Sequalize logs the createdAt time by default. This field may be unnecessary.
        bid_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        expiration_date: {
            type: DataTypes.DATE,
            defaultValue: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ), // will need to be validated to make sure this is 7 days in the future
        },
    },
    {
        hooks: {
            // Deducts funds from users account before placing bid. Also ensures user has a sufficient balance.
            async beforeCreate(bid) {
                const user = await User.findByPk(bid.user_id);
                const totalBidCost = bid.price * bid.shares;

                await user.decreaseBalance(totalBidCost);
            },
        },
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'bid',
    }
);

module.exports = Bid;
