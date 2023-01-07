const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');
const { Op } = require('sequelize');
const User = require('./User');
const Shares = require('./Shares');

class Bid extends Model {
    async cancelBid() {
        const user = await User.findByPk(this.user_id);
        const totalBidCost = this.price * this.shares;

        user.balance += totalBidCost;
        await user.save();
        await this.destroy();
    }

    async fulfil(ask, transaction) {
        // Bidder gets shares
        // Asker gets money

        const quantity = Math.min(ask.shares_remaining, this.shares_remaining);

        this.shares_remaining -= quantity;
        ask.shares_remaining -= quantity;

        if (this.shares_remaining < 0 || ask.shares_remaining < 0)
            throw new Error(
                'Bid or Ask has fallen below minimun remaning value possible. Something went wrong.'
            );

        await ask.save({ transaction });
        console.log('Shares reduced from ask');

        const [asker, bidder] = await Promise.all([
            User.findByPk(ask.user_id),
            User.findByPk(this.user_id),
        ]);

        await bidder.refund(this.price, ask.price, transaction);
        await bidder.save({ transaction });

        console.log('Bidder refunded and saved');

        const bidderShares =
            (await Shares.findShares(bidder.id, this.topic_id)) ||
            (await Shares.create(
                {
                    user_id: bidder.id,
                    topic_id: this.topic_id,
                    quantity: 0,
                    ipo_shares: false,
                },
                { transaction }
            ));

        console.log('bidder shares located/created');

        await bidderShares.addShares(quantity, transaction);
        console.log('Shares added');

        await asker.increaseBalance(quantity * this.price, transaction);
        await this.save({ transaction });
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
            },
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
            async beforeCreate(bid, transaction) {
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

            async afterCreate(bid, { transaction }) {
                const Ask = require('./Ask');
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

                    await ask.fulfil(bid, transaction);
                }

                return bid;
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
