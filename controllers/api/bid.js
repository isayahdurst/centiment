const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Bid = require('../../models/Bid');
const sequelize = require('../../config/connection');

const bidRouter = new Router();

bidRouter.post('/', auth, async (req, res) => {
    const user = req.user;
    const { topic_id, price, shares_requested } = req.body;
    const user_id = user.id;
    const t = await sequelize.transaction();

    try {
        const topic = await Topic.findOne({
            where: {
                id: topic_id,
            },
        });

        if (!topic) {
            throw new Error("Topic Doesn't Exist");
        }
        console.log(`Shares requested: ${shares_requested}`);

        const bid = await Bid.create(
            {
                price,
                shares_requested,
                user_id,
                topic_id,
            },
            { transaction: t }
        );

        await t.commit();

        res.json(bid);
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.json(error);
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
