const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Topic = require('./Topic');
const User = require('./User');

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
                const topic = await Topic.findByPk(shares.topic_id);
                if (!topic.initial_shares >= amount) {
                    throw new Error(
                        'Remaning shares insufficient to fill request.'
                    );
                }
                return shares;
            },

            async beforeCreate(shares) {
                if (shares.ipo_shares) {
                    const topic = await Topic.findByPk(shares.topic_id);
                    const user = await User.findByPk(shares.user_id);

                    if (user.balance < topic.price * shares.amount) {
                        throw new Error(
                            "User's balance insufficient to fill request"
                        );
                    }
                }
                return shares;
            },

            async afterCreate(shares) {
                if (shares.ipo_shares) {
                    //reduce ipo shares
                }
            },
        },
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'shares',
    }
);

module.exports = Shares;
