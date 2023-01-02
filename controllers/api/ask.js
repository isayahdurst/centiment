const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Ask = require('../../models/Ask');

const askRouter = new Router();

askRouter.post('/', auth, async (req, res) => {
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

        const ask = await Ask.create({
            price,
            shares,
            user_id,
            topic_id,
        });

        console.log(ask);
        res.json(ask);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

// Will return all active asks made by a particular user.
askRouter.get('/:user_id', async (req, res) => {
    const user_id = req.param;

    const asks = await ask.findAll({
        where: {
            user_id: user_id,
        },
    });
    res.json(asks);
});

askRouter.get('/');

module.exports = askRouter;
