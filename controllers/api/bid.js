const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Bid = require('../../models/Bid');

const bidRouter = new Router();

bidRouter.post('/', auth, async (req, res) => {
    const user = req.user;
    const { topic_id, price, shares } = req.body;
    const user_id = user.id;
    try {
        const topic = await Topic.findOne({
            where: {
                id: topic_id,
            },
        });

        console.log(topic);

        if (!topic) {
            throw new Error("Topic Doesn't Exist");
        }

        const bid = await Bid.create({
            price,
            shares,
            user_id,
            topic_id,
        });

        console.log(bid);
        await bid.cancelBid();
        console.log(bid);
        res.json(bid);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Will return all active bids made by a particular user.
bidRouter.get('/:user_id', async (req, res) => {
    const user_id = req.param;

    const bids = await Bid.findAll({
        where: {
            user_id: user_id,
        },
    });
    res.json(bids);
});

bidRouter.get('/');

module.exports = bidRouter;
