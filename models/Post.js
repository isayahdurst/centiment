const { Model, DataTypes } = require('sequelize');
const sequelize = require('./../config/connection');
const Topic = require('./Topic');

class Post extends Model {
    async parseVoters() {}

    async upvote(user_id) {
        const up_voters = this.up_voters.split(';');
        console.log(up_voters);
        console.log(user_id);
        const down_voters = this.down_voters.split(';');
        // checks if user has already upvoted

        if (up_voters.includes(user_id)) {
            await this.removeUpvote();
            return;
        }

        if (down_voters.includes(user_id)) {
            await this.removeDownvote();
        }

        up_voters.push(user_id);
        console.log(up_voters);
        console.log(up_voters.join(';'));

        this.up_voters = up_voters.join(';');
        this.up_votes += 1;
        await this.save();
    }

    async removeUpvote(user_id) {
        this.up_voters = this.up_voters
            .split(';')
            .filter((voterID) => voterID != user_id)
            .join(';');
        this.up_votes -= 1;
        await this.save();
    }

    async downvote(user_id) {
        const up_voters = this.up_voters.split(';');
        const down_voters = this.down_voters.split(';');

        if (down_voters.includes(user_id)) {
            await this.removeDownvote();
            return;
        }

        if (up_voters.includes(user_id)) {
            await this.removeUpvote();
        }

        this.down_voters = down_voters.push(user_id).join(';');
        this.down_votes += 1;
        await this.save();
    }

    async removeDownvote() {
        this.down_voters = this.down_voters
            .split(';')
            .filter((voterID) => voterID != user_i)
            .join(';');
        this.down_votes -= 1;
        await this.save();
    }
}

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
        up_voters: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        down_voters: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
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
    },
    {
        hooks: {
            async afterCreate(post) {
                const topic = await Topic.findByPk(post.topic_id);
                await topic.increaseNumPosts();
            },
        },
        sequelize,
        useIndividualHooks: true,
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        modelName: 'post',
    }
);

module.exports = Post;
