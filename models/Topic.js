const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Topic extends Model {}

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
            defaultValue: 1.00,
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: [200, 5000],
                msg: "Description must be at least 200 characters long but no more than 5000 characters."
            }
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
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'topic',
    }
);

module.exports = Topic;
