const User = require('./User');
const Category = require('./Category');
const Topic = require('./Topic');
const Post = require('./Post');
const Wallet = require('./Wallet');

// TODO: add MTM table in models
// User.belongsToMany(Topic, { through: MTM });
// Topic.belongsToMany(User, { through: MTM });

User.hasOne(Wallet);
Wallet.hasOne(User);

module.exports = {
    User,
    Category,
    Topic,
    Post,
};