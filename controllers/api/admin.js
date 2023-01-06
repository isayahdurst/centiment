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

adminRouter.post('/user/', async (req, res) => {
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

    res.json(user);
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

adminRouter.get('/shares', async (req, res) => {
    const shares = await Shares.findAll();
    res.json(shares);
});

adminRouter.get('/shares/:id', async (req, res) => {
    const { id } = req.params;
    const shares = await Shares.findByPk(id);
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
    const { user_id, topic_id, price, shares } = req.query;
    const ask = await Ask.create({
        user_id,
        topic_id,
        price,
        shares,
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
