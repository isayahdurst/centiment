const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post } = require('./../../models');
const { Topic } = require('../../models');
const Shares = require('../../models/Shares');
const { Op } = require('sequelize');

const postRouter = new Router();

postRouter.get('/', auth, async (req, res) => {
    const posts = await Post.findAll();
    console.log(posts);
    if (!posts) {
        res.status(404).end('No such post');
        return;
    }
    const plainPosts = posts.map((post) => post.get({ plain: true }));

    console.log(plainPosts);
    res.render('post', {
        posts: plainPosts,
    });
});

postRouter.post('/upvote', auth, async (req, res) => {
    const { id } = req.body;
    const user = req.user;

    const post = await Post.findByPk(id);

    try {
        await post.upvote(user.id);
        res.json({ message: 'upvote successful' });
    } catch (error) {
        res.status(500).json({ message: 'unexpected error occured' });
    }
});

postRouter.post('/downvote', auth, async (req, res) => {
    const id = req.body;
    const user = req.user;

    const post = await Post.findByPk(id);

    try {
        await post.upvote(user.id);
        res.json({ message: 'downvote successful' });
    } catch (error) {
        res.status(500).json({ message: 'unexpected error occured' });
    }
});

postRouter.post('/', auth, async (req, res) => {
    const user = req.body;
    const { post_name, contents, topic_id } = req.body;

    try {
        const shares = await Shares.findAll({
            where: {
                [Op.and]: [
                    {
                        user_id: user.id,
                    },
                    {
                        topic_id: topic_id,
                    },
                ],
            },
        });

        const topic = await Topic.findByPk(topic_id);

        if (!shares) throw new Error('User not Authorized.');

        const post = await Post.create({
            post_name,
            contents,
            topic_id,
            user_id: user.id,
        });

        res.json({ message: 'Post Created Successfully' });
    } catch (error) {
        if (error.message === 'User not Authorized') {
            res.status(401).json({
                message: "Can't create post. User does not own topic",
            });
        }
    }
});
module.exports = postRouter;
