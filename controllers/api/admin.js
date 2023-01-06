const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Shares = require('../../models/Shares');
const Ask = require('../../models/Ask');
const Bid = require('../../models/Bid');

const adminRouter = new Router();

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

module.exports = adminRouter;
