const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Shares = require('./Shares');
const User = require('./User');
const { Op } = require('sequelize');
const Bid = require('./Bid');

class Ask extends Model {
    async sayHello() {
        console.log('Hi, this works');
    }

    async fulfil(bid, transaction) {
        // Bidder gets shares
        // Asker gets money

        const quantity = Math.min(bid.shares_remaining, this.shares_remaining);

        this.shares_remaining -= quantity;
        bid.shares_remaining -= quantity;

        if (this.shares_remaining < 0 || bid.shares_remaining < 0)
            throw new Error(
                'Bid or Ask has fallen below minimun remaning value possible. Something went wrong.'
            );

        await bid.save({ transaction });

        const [bidder, asker] = await Promise.all([
            User.findByPk(bid.user_id),
            User.findByPk(this.user_id),
        ]);

        await bidder.refund(bid.price, this.price, transaction);
        await bidder.save({ transaction });

        const bidderShares =
            (await Shares.findShares(bidder.id, this.topic_id)) ||
            Shares.create(
                {
                    user_id: bidder.id,
                    topic_id: this.topic_id,
                    quantity: 0,
                    ipo_shares: false,
                },
                { transaction }
            );

        await bidderShares.addShares(quantity, transaction);

        await asker.increaseBalance(quantity * this.price, transaction);

        await Transaction.create(
            {
                topic_id: topic_id,
                volume: quantity * this.price,
            },
            { transaction: transaction }
        );

        await this.save({ transaction });
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
            validate: {
                isFloat: true,
            },
        },
        shares_requested: {
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
            validate: {
                isDate: true,
            },
        },
        expiration_date: {
            type: DataTypes.DATE,
            validate: {
                isDate: true,
            },
            defaultValue: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
            ),
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
            async beforeCreate(ask, { transaction }) {
                console.log('Ask.beforeCreate');
                const [shares, user] = await Promise.all([
                    Shares.findOne({
                        where: {
                            [Op.and]: [
                                {
                                    user_id: ask.user_id,
                                },
                                {
                                    topic_id: ask.topic_id,
                                },
                            ],
                        },
                    }),

                    User.findByPk(ask.user_id),
                ]);

                if (!shares) throw new Error("User doesn't own this topic.");
                if (!transaction)
                    throw new Error('Transaction object is undefined');

                await shares.escrow(ask.shares_requested, transaction);

                console.log('Shares are escrowed...');

                ask.shares_remaining = ask.shares_requested;
                return ask;
            },

            async afterCreate(ask, { transaction }) {
                // Returns all bids for a topic that are still pending.
                // Orders bids by highest price, then by date created.

                console.log('Ask.afterCreate()');

                const bids = await Bid.findAll({
                    where: {
                        [Op.and]: [
                            {
                                topic_id: ask.topic_id,
                            },
                            {
                                price: {
                                    [Op.gte]: ask.price,
                                },
                            },
                            {
                                status: 'pending',
                            },
                        ],
                    },
                    order: [
                        ['price', 'ASC'],
                        ['createdAt', 'ASC'],
                    ],
                });

                console.log('Bids found');

                for (const bid of bids) {
                    if (!ask.shares_remaining > 0) {
                        break;
                    }

                    await bid.fulfil(ask, transaction);
                    console.log('Ask.afterCreated: bids filled');
                }

                return ask;
            },

            async afterUpdate(ask) {
                if (!ask.shares_remaining > 0) {
                    ask.status = 'complete';
                    console.log('Ask - afterUpdate: Ask Status' + ask.status);
                }
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
