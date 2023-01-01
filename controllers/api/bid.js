const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const fs = require('fs');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic, Bid } = require('../../models');

const bidRouter = new Router();

bidRouter.post('/', auth, async (req, res) => {
    const user = req.user;
    const { topic_id, price, shares, bid_date, expiration_date } = req.body;

    try {
        const topic = Topic.findOne({
            where: {
                id: topic_id,
            },
        });

        if (!topic) {
            throw new Error("Topic Doesn't Exist");
        }

        const bid = await Bid.create({
            topic_id,
            price,
            shares,
            bid_date,
            expiration_date,
        });
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

module.exports = bidRouter;
