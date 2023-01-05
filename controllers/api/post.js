const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Post } = require('./../../models');
const { Topic } = require('../../models');

const postRouter = new Router();

postRouter.get('/', auth, async (req, res) => {
    const posts = await Post.findAll()
    console.log(posts)
    if (!posts) {
        res.status(404).end('No such post');
        return;
    }
    const plainPosts = posts.map((post) => post.get({ plain: true }));

    console.log (plainPosts);
    res.render('post', {
        posts: plainPosts,
    });
})
module.exports = postRouter