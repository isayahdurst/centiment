const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Op } = require('sequelize');
const { User, Topic } = require('../../models');
const Ask = require('../../models/Ask');
const sequelize = require('../../config/connection');

const askRouter = new Router();

askRouter.post('/', auth, async (req, res) => {
    const user = req.user;
    const { topic_id, price, shares_requested } = req.body;
    const user_id = user.id;
    const transaction = await sequelize.transaction();
    try {
        const topic = await Topic.findOne({
            where: {
                id: topic_id,
            },
        });

        if (!topic) {
            throw new Error("Topic Doesn't Exist");
        }
        console.log('ASK ROUTER, POST, TXXXXXXXXXXXXX');

        const ask = await Ask.create(
            {
                price,
                shares_requested,
                user_id,
                topic_id,
            },
            { transaction: transaction }
        );

        console.log('Ask created');

        await transaction.commit();

        console.log(ask);
        res.json(ask);
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.json({ message: error.message });
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
