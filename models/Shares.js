const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Topic = require('./Topic');
const User = require('./User');
const { Op } = require('Sequelize');

class Shares extends Model {}

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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ipo_shares: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        hooks: {
            // This hook will check to make sure there are enough IPO shares to fill an order before placing it.
            async beforeCreate(shares) {
                if (shares.ipo_shares) {
                    const [topic, user] = await Promise.all([
                        Topic.findByPk(shares.topic_id),
                        User.findByPk(shares.user_id),
                    ]);

                    await topic.decreaseIPOShares(shares.amount);

                    /* if (user.balance < topic.price * shares.amount) {
                        throw new Error(
                            "User's balance insufficient to fill request"
                        );
                    } */

                    if (!topic.initial_shares >= shares.amount) {
                        throw new Error(
                            'Remaning shares insufficient to fill request.'
                        );
                    }
                }
                return shares;
            },

            async afterCreate(shares) {
                if (shares.ipo_shares) {
                    shares.ipo_shares = false;
                }
                return shares;
            },

            async beforeUpdate(shares) {
                const topic = await Topic.findByPk(shares.topic_id);
                const user = await User.findByPk(shares.user_id);

                if (user.balance < topic.price * shares.amount) {
                    throw new Error(
                        "User's balance insufficient to fill request"
                    );
                }

                if (!topic.initial_shares >= shares.amount) {
                    throw new Error(
                        'Remaning shares insufficient to fill request.'
                    );
                }
                return shares;
            },

            async afterUpdate(shares) {
                if (shares.ipo_shares) {
                    shares.ipo_shares = false;
                    console.log(
                        `Shares: ${shares.id}(id) changed to ${shares.ipo_shares}`
                    );

                    // Reduces available IPO Shares from topic
                    const topic = await Topic.findByPk(shares.topic_id);
                    topic.initial_shares -= shares.amount;
                    await topic.save();
                }
                return shares;
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
