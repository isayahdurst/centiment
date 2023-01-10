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
        console.log(err);
    }
});

// Creates shares from inital offering.
topicRouter.post('/buyIPO', auth, async (req, res) => {
    const { topic_id, quantity } = req.body;
    console.log(topic_id, quantity);
    const [topic, user] = await Promise.all([
        Topic.findByPk(topic_id),
        User.findByPk(req.user.id),
    ]);

    const t = await sequelize.transaction();

    try {
        if (quantity < 0) {
            throw new Error('Quantity must be a postivive number.');
        }
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
            shares = await Shares.create(
                {
                    topic_id: topic_id,
                    user_id: user.id,
                    quantity: Number(quantity),
                    ipo_shares: true,
                },
                { transaction: t }
            );
        } else {
            await shares.update(
                {
                    quantity: shares.quantity + Number(quantity),
                    ipo_shares: true,
                },
                { transaction: t }
            );
        }

        await user.decreaseBalance(quantity * topic.price, t);
        await topic.decreaseIPOShares(quantity, t);
        await topic.increaseVolume(quantity * topic.price, t);

        t.commit();

        res.json(shares);
    } catch (error) {
        t.rollback();
        console.log(error);
        if (error.message === 'Quantity must be a postivive number.') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// add a post
topicRouter.post('/:id', auth, async (req, res) => {
    const { post_name, contents } = req.body;
    const user = await User.findByPk(req.user.id);
    const { id } = req.params;

    try {
        const newPost = await Post.create({
            post_name,
            contents,
            topic_id: id,
            user_id: user.id,
        });
        res.status(200).json({
            id: newPost.id,
        });
    } catch (err) {
        if (err.message === 'Unauthorized Request') {
            res.status(401).json({
                message:
                    'Insufficient shares owned to perform this action.\nYou must purchase shares first.',
            });
        } else {
            res.status(400).json({ message: err });
        }
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

topicRouter.get('/search', auth, async (req, res) => {
    try {
        // get the search query from the request query string
        const searchQuery = req.query.q;

        // use Sequelize to search for topics matching the search criteria by title and descrition
        // return results ordered by update_at and limit 20 records
        let topics = await Topic.findAll({
            where: {
                [Op.or]: [
                    {
                        topic_name: {
                            [Op.like]: '%' + searchQuery + '%',
                        },
                    },
                    {
                        description: {
                            [Op.like]: '%' + searchQuery + '%',
                        },
                    },
                ],
            },
            order: [['updated_at', 'DESC']],
            limit: 20,
        });
        if (!topics) {
            res.status(404).json({ message: 'No topic found' });
            return;
        }
        res.status(200).json(topics);
    } catch (error) {
        console.log(error);
    }
});

module.exports = topicRouter;
