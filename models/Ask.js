const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Shares = require('./Shares');
const User = require('./User');
const { Op } = require('sequelize');

class Ask extends Model {
    async sayHello() {
        console.log('Hi, this works');
    }

    async fulfil(bid, quantity) {
        this.shares -= quantity;
        bid.shares_remaining -= quantity;
        await bid.save();
        const bidder = await User.findByPk(bid.user_id);
        await bidder.refund(bid.price, this.price);
        const asker = await User.findByPk(this.user_id);
        const creditAmount = quantity * this.price;
        console.log(creditAmount);
        console.log(`Asker Balance Pre-Fulfillment: ${asker.balance}`);

        await asker.increaseBalance(creditAmount);
        console.log(`Asker Balance Post-Fulfillment: ${asker.balance}`);
        console.log('Order Fulfilled.');
        this.save();
    }
}

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
        },
        shares: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shares_remaining: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        },
        expiration_date: {
            type: DataTypes.DATE,
            defaultValue: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ), //will need to be validated to make sure this is 7 days in the future
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['pending', 'complete', 'canceled'],
            defaultValue: 'pending',
        },
    },
    {
        hooks: {
            /* TODO: 
            1. Check that user owns enough shares to place ask.
            2. Deduct shares from Shares where topic is this ask.topic_id and user_id: is ask.user_id
            3. Set shares_remaining equal to shares_requested
            4. */
            async beforeCreate(ask) {
                const asker = await User.findByPk(ask.user_id);
                const shares = await Shares.findOne({
                    where: {
                        [Op.and]: [
                            {
                                user_id: asker.id,
                            },
                            {
                                topic_id: ask.topic_id,
                            },
                        ],
                    },
                });

                if (!shares)
                    throw new Error(
                        "User doesn't own any shares of this topic"
                    );
                if (shares.amount < ask.shares) {
                    console.log(shares.amount, ask.shares);
                    throw new Error(
                        `Insufficient shares to place ask.\nOwned: ${shares.amount} | Required: ${ask.shares}`
                    );
                }

                ask.shares_remaining = ask.shares;
                return ask;
            },
        },
        sequelize,
        useIndividualHooks: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'ask',
    }
);

module.exports = Ask;
