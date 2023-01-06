const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Shares = require('../../models/Shares');
const Ask = require('../../models/Ask');
const Bid = require('../../models/Bid');
const sequelize = require('../../config/connection');

const adminRouter = new Router();

adminRouter.get('/user', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

adminRouter.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
});

adminRouter.post('/user', async (req, res) => {
    let { amount } = req.query;

    const users = [];

    if (!amount) {
        amount = 1;
    }

    for (let i = 0; i < amount; i++) {
        const randomNum = Number(
            String(Math.floor(Math.random() * 100)) +
                String(Math.floor(Math.random() * 100))
        );

        const user = await User.create({
            firstName: `test${randomNum}`,
            lastName: `test${randomNum}`,
            username: `test${randomNum}`,
            password: 'test',
            bio: 'this is a dummy account',
            email: `test${randomNum}@test.com`,
        });

        users.push(user);
    }

    res.json(users);
});

adminRouter.get('/topics', async (req, res) => {
    const topics = await Topic.findAll();
    res.json(topics);
});

adminRouter.get('/topics/:id', async (req, res) => {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    res.json(topic);
});

adminRouter.post('/topics', async (req, res) => {
    let { amount, user_id, price } = req.query;

    if (!amount) {
        amount = 1;
    }

    const topics = [];

    for (let i = 0; i < amount; i++) {
        const randomNum = Math.floor(Math.random() * 10000);
        const topic = await Topic.create({
            topic_name: `Test Topic (${randomNum})`,
            price: price,
            user_id: user_id,
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        });
        topics.push(topic);
    }

    res.json(topics);
});

adminRouter.get('/shares', async (req, res) => {
    const shares = await Shares.findAll();
    res.json(shares);
});

adminRouter.get('/shares/:id', async (req, res) => {
    const { id } = req.params;
    const shares = await Shares.findByPk(id);
    res.json(shares);
});

adminRouter.post('/shares', async (req, res) => {
    const { topic_id, quantity, user_id } = req.query;

    let shares = await Shares.findOne({
        where: {
            [Op.and]: [
                {
                    user_id: user_id,
                },
                {
                    topic_id: topic_id,
                },
            ],
        },
    });

    if (!shares) {
        shares = await Shares.create({
            user_id: user_id,
            topic_id: topic_id,
            quantity: quantity,
        });
    } else {
        await shares.update({
            quantity: quantity,
        });
    }

    res.json(shares);
});

adminRouter.get('/asks', async (req, res) => {
    const asks = await Ask.findAll();
    res.json(asks);
});

adminRouter.get('/asks/:id', async (req, res) => {
    const { id } = req.params;
    const ask = await Ask.findByPk(id);
    res.json(ask);
});

adminRouter.get('/bids', async (req, res) => {
    const bids = await Bid.findAll();
    res.json(bids);
});

adminRouter.get('/bids/:id', async (req, res) => {
    const { id } = req.params;
    const bid = await Bid.findByPk(id);
    res.json(bid);
});

adminRouter.get('/tests/transaction', async (req, res) => {
    const t = await sequelize.transaction();
    console.log(t);
    res.end();
});

adminRouter.put('/user/setBalance/', async (req, res) => {
    const { user_id, balance } = req.query;
    const user = await User.findByPk(user_id);
    await user.setBalance(balance);
    res.json(user);
});

adminRouter.post('/ask', async (req, res) => {
    const { user_id, topic_id, price, shares_requested } = req.query;
    const ask = await Ask.create({
        user_id,
        topic_id,
        price,
        shares_requested,
    });

    console.log(ask);
    res.json(ask);
});

adminRouter.post('/bid', async (req, res) => {
    const { user_id, topic_id, price, shares_requested } = req.query;
    const bid = await Bid.create({
        user_id,
        topic_id,
        price,
        shares_requested,
    });

    console.log(bid);
    res.json(bid);
});

module.exports = adminRouter;
