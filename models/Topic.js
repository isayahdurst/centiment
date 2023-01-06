const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Topic extends Model {
    async decreaseIPOShares(quantity) {
        try {
            // Gatekeep Checks:
            if (this.initial_shares - quantity < 0) {
                throw new Error('Not enough IPO shares to fill this request.');
            }

            this.initial_shares -= quantity;
            await this.save();
        } catch (error) {
            console.error(error);
        }
    }
}

Topic.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        topic_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
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
        initial_shares: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 100000,
        },
    },
    {
        hooks: {
            async beforeCreate(topic) {
                if (topic.total_shares) {
                    topic.initial_shares = topic.total_shares;
                }

                return topic;
            },
        },
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'topic',
    }
);

module.exports = Topic;
