const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');
const { User } = require('../models');
const { Op } = require('sequelize');
const Ask = require('./Ask');

/* const Ask = require('./Ask'); */

class Bid extends Model {
    async cancelBid() {
        const user = await User.findByPk(this.user_id);
        const totalBidCost = this.price * this.shares;

        user.balance += totalBidCost;
        await user.save();
        await this.destroy();
    }
}

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
        shares_requested: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shares_remaining: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
            validate: {
                isDate: true,
            },
        },
        expiration_date: {
            type: DataTypes.DATE,
            validate: {
                isDate: true,
            }
        },
        //Object.expirationDate = Date.now() + 604800000 (7 days)
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['pending', 'complete', 'canceled'],
            defaultValue: 'pending',
        },
    },
    {
        hooks: {
            // Deducts funds from users account before placing bid. Also ensures user has a sufficient balance.
            async beforeCreate(bid) {
                console.log('Does this ever happen?');
                const user = await User.findByPk(bid.user_id);
                const totalBidCost = bid.price * bid.shares_requested;

                //TODO: remove test variable below
                const userBal = user.balance;
                await user.decreaseBalance(totalBidCost);
                console.log(
                    `Bidder Balance Pre: ${userBal} | Bidder Bal. Post: ${user.balance}`
                );
                bid.shares_remaining = bid.shares_requested;
                return bid;
            },

            async afterCreate(bid) {
                const asks = await Ask.findAll({
                    where: {
                        [Op.and]: [
                            {
                                topic_id: bid.topic_id,
                            },
                            {
                                price: {
                                    [Op.lte]: bid.price,
                                },
                            },
                            {
                                status: 'pending',
                            },
                        ],
                    },
                    // Order asks by lowest price, then by date created.
                    order: [
                        ['price', 'DESC'],
                        ['createdAt', 'ASC'],
                    ],
                });

                for (const ask of asks) {
                    if (!bid.shares_remaining > 0) {
                        break;
                    }

                    const maxOrders = Math.min(
                        ask.shares,
                        bid.shares_remaining
                    );
                    // ask.fulfil(user_id, maxOrders)
                    await ask.fulfil(bid, maxOrders);
                }
            },

            async afterUpdate(bid) {
                if (!bid.shares_remaining > 0) {
                    bid.status = 'complete';
                    console.log(`\nafterUpdate: \nBid status: ${bid.status}\n`);
                }
                return bid;
            },
        },
        sequelize,
        useIndividualHooks: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'bid',
    }
);

module.exports = Bid;
