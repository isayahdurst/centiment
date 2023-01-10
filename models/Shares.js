const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Topic = require('./Topic');
const User = require('./User');
const { Op } = require('sequelize');

class Shares extends Model {
    /**
     * Performs an escrow transaction for a specified quantity of shares.
     *
     * @param {number} askQuantity - The requested quantity of shares to sell in the ask.
     * @param {object} transaction - sequelize transaction object.
     *
     * @throws {Error} If there are not enough shares to support the ask.
     *
     */
    async escrow(askQuantity, transaction) {
        console.log(
            `Shares Owned: ${this.quantity}\nRequested Sell: ${askQuantity}`
        );
        if (this.quantity >= askQuantity) {
            this.quantity -= askQuantity;
        } else {
            throw new Error('Not enough shares to support transaction.');
        }
        await this.save({ transaction: transaction });
    }

    async addShares(amount, transaction) {
        this.shares += amount;
        await this.save({ transaction: transaction });
    }

    static async findShares(user_id, topic_id) {
        const shares = await Shares.findOne({
            where: {
                [Op.and]: [
                    {
                        user_id: user_id,
                    },
                    {
                        topic_id: topic_id,
                    },
                ],
            },
        });

        return shares;
    }
}

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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
            },
        },
        ipo_shares: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        hooks: {
            async beforeUpdate(shares) {
                console.log(shares.quantity);
            },
        },
        sequelize,
        useIndividualHooks: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'shares',
    }
);

module.exports = Shares;
