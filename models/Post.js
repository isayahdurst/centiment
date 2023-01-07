const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        post_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contents: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        up_votes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        down_votes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
            },
        },
        topic_id: {
            type: DataTypes.INTEGER,
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
        // REMOVING FIELDS DUE TO COMPLEXITY
        /* pending_review: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }, */
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            validate: {
                isDate: true,
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post',
    }
);

module.exports = Post;
