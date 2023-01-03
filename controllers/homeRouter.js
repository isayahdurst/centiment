const { Router } = require('express');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { Topic, Wallet } = require('../models');

const homeRouter = new Router();

homeRouter.get('/', auth, async (req, res) => {
    const plainUser = req.user.get({ plain: true });
    res.render('home', {
        user: plainUser,
    });
});

homeRouter.get('/login', async (req, res) => {
    res.render('login');
});

// router to display profile page
homeRouter.get('/user/:username', auth, async (req, res) => {
    const user = req.user.get({ plain: true });

    const Buffer = require('buffer').Buffer;

    const imageData = Buffer.from(user.avatar).toString('base64');
    const imageURI = `data:image/jpeg;base64,${imageData}`;
    res.render('profile', { user, imageURI });
});

// Topic routes
homeRouter.get('/topic', auth, async (req, res) => {
    const plainUser = req.user.get({ plain: true });

    const topics = await Topic.findAll({
        where: {
            user_id: req.user.id,
        },
    });

    const plainTopics = topics.map((topic) => topic.get({ plain: true }));

    res.render('topic', {
        user: plainUser,
        topics: plainTopics,
    });
});

homeRouter.get('/about', optionalAuth, async (req, res) => {
    if (req.user) {
        const user = req.user.get({ plain: true });
        res.render('about', {
            user: user,
        });
    } else {
        res.render('about');
    }
});

// Get single topic
homeRouter.get('/topic/:id', auth, async (req, res) => {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);

    if (!topic) {
        res.status(404).end('No such topic');
        return;
    }

    const topicSimple = topic.get({ simple: true });

    res.render('single-topic', {
        topic: topicSimple,
    });
});
// Edit single topic
homeRouter.get('/topic/edit/:id', async (req, res) => {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    if (!topic) {
        res.status(404).end('No such topic');
        return;
    }
    const topicSimple = topic.get({ simple: true });
    res.render('edit-topic', {
        topic: topicSimple,
    });
});

// Post routes
homeRouter.get('topic/:id/post/new', async (req, res) => {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    if (!topic) {
        res.status(404).end('No such topic');
        return;
    }
    const topicSimple = topic.get({ simple: true });
    res.render('new-post', {
        topic: topicSimple,
    });
});

module.exports = homeRouter;
