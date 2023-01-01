const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post } = require('./../../models');
const { Topic } = require('../../models');

const postRouter = new Router();

postRouter.post('/topic/:id', auth, async (req, res) => {
    const { name, content } = req.body;
    try {
        const newPost = await Post.create({
            name,
            content,
            id: req.topic.id,
        });
        res.status(200).json({
            id: newPost.id,
        });
    } catch (err) {
        res.status(400).json(err);
    }
});
