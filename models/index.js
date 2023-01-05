const Comment = require('./Comment');
const Listing = require('./Listing');
const Mtm = require('./MTM');
const Post = require('./Post');
const Topic = require('./Topic');
const Transaction = require('./Transaction');
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

User.hasMany(Listing, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Listing.belongsTo(User, {
    foreignKey: 'user_id',
});

Listing.hasOne(Topic, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
});

Topic.belongsTo(Listing, {
    foreignKey: 'topic_id',
});

Transaction.hasOne(Topic, {
    foreignKey: 'topic_id',
});

Topic.belongsTo(Transaction, {
    foreignKey: 'topic_id',
    onDelete: 'CASCADE',
});

Transaction.hasOne(Listing, {
    foreignKey: 'listing_id',
});

Listing.belongsTo(Transaction, {
    foreignKey: 'listing_id',
    onDelete: 'CASCADE',
});

User.hasMany(Transaction, {
    foreignKey: 'transaction_id',
});

User.hasMany(Topic, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

// Transaction.hasOne(User, {
//     foreignKey: 'buyer_id',
// });

// Transaction.hasOne(User, {
//     foreignKey: 'seller_id'
// });

//done using through reference

module.exports = {
    Comment,
    Listing,
    Mtm,
    Post,
    Topic,
    Transaction,
    User,
};
