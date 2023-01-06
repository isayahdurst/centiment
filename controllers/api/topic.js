const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Topic } = require('./../../models');
const { Post, User } = require('./../../models');
const Shares = require('../../models/Shares');
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../../config/connection');
const e = require('express');
const { truncate } = require('../../models/Shares');

const topicRouter = new Router();

// create a new topic
topicRouter.post('/', auth, async (req, res) => {
    const { topic_name, description, price } = req.body;
    console.log(topic_name, description, price);
    try {
        const newTopic = await Topic.create({
            topic_name,
            description,
            price,
            user_id: req.user.id,
        });
        res.status(200).json({
            id: newTopic.id,
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Creates shares from inital offering.
topicRouter.post('/buyIPO', auth, async (req, res) => {
    const { topic_id, quantity } = req.body;
    const topic = await Topic.findByPk(topic_id);
    const user = await User.findByPk(req.user.id);
    console.log(user.id);

    try {
        let shares = await Shares.findOne({
            where: {
                [Op.and]: [
                    {
                        topic_id: topic.id,
                    },
                    {
                        user_id: user.id,
                    },
                ],
            },
        });

        if (!shares) {
            shares = await Shares.create({
                topic_id: topic_id,
                user_id: user.id,
                amount: quantity,
                ipo_shares: true,
            });
        } else {
            await shares.update({
                amount: shares.amount + Number(quantity),
                ipo_shares: true,
            });
        }

        /* await shares.update({
            amount: shares.amount + Number(quantity),
            ipo_shares: true,
        }); */

        await user.decreaseBalance(quantity * topic.price);

        res.json(shares);
    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
});

// edit a topic
topicRouter.put('/edit/:id', auth, async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const topic = await Topic.update(
            {
                name,
                description,
                price,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json(topic);
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete a topic
topicRouter.delete('/:id', auth, async (req, res) => {
    try {
        const topic = await Topic.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!topic) {
            res.status(404).json({ message: 'No topic found with this id!' });
            return;
        }
        res.status(200).json(topic);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = topicRouter;
