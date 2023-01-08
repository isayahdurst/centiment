const Ask = require('./Ask');
const Bid = require('./Bid');
const Comment = require('./Comment');
const Mtm = require('./MTM');
const Post = require('./Post');
const Shares = require('./Shares');
const Topic = require('./Topic');
const User = require('./User');

Topic.hasMany(Post, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
});

Post.belongsTo(Topic, {
    foreignKey: 'topic_id',
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

User.hasMany(Topic, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

//done using through reference

Topic.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

User.hasMany(Topic, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Shares.belongsTo(Topic, {
    foreignKey: 'topic_id',
});
Topic.hasMany(Shares);

Topic.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

module.exports = {
    Ask,
    Bid,
    Comment,
    Mtm,
    Post,
    Shares,
    Topic,
    User,
};
