const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Topic extends Model {
    async decreaseIPOShares(quantity, transaction) {
        // Gatekeep Checks:
        if (this.initial_shares - quantity < 0) {
            throw new Error('Not enough IPO shares to fill this request.');
        }

        this.initial_shares -= quantity;
        await this.save({ transaction: transaction });
    }

    async increaseVolume(amount, transaction) {
        this.volume += Number(amount);
        await this.save({ transaction: transaction });
    }

    async updateLastTradePrice(price, transaction) {
        this.last_traded_price = price;
        await this.save({ transaction: transaction });
    }

    async increaseNumPosts() {
        this.number_posts += 1;
        await this.save();
    }

    async decreaseNumPosts() {
        this.number_posts -= 1;
        await this.save();
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
            validate: {
                len: {
                    args: [200, 5000],
                    msg: 'Description must be at least 200 characters long but no more than 5000 characters.',
                },
            },
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
            validate: {
                isInt: true,
            },
        },
        initial_shares: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 100000,
        },
        volume: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        last_traded_price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        number_posts: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        number_comments: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        indexes: [
            {
                indexType: 'FULLTEXT',
                fields: ['topic_name'],
            },
        ],
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'topic',
    }
);

module.exports = Topic;
