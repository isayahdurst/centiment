const { Router } = require('express');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { User, Topic, Post, Shares, Comment } = require('../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const Bid = require('../models/Bid');
const Ask = require('../models/Ask');

const homeRouter = new Router();

homeRouter.get('/', auth, async (req, res) => {
    const user = req.user;
    const plainUser = req.user.get({ plain: true });

    const topTopics = await Topic.findAll({
        order: [
            ['volume', 'DESC'],
            ['createdAt', 'ASC'],
        ],
        limit: 10,
    });

    // TODO: Only display topics that have at least 1 post.

    const newTopics = await Topic.findAll({
        where: {
            user_id: user.id,
        },
        order: [['updatedAt', 'DESC']],
        limit: 3,
    });

    let newComments = await Comment.findAll({
        where:{
            id: {
                [Op.in]: [sequelize.literal(`(select max(id) from comment group by post_id)`)]
            },
        },
        include:{ all: true, nested: true},
        order: [['date_created','DESC']],
        limit: 3
    });

    const plainComments = newComments.map((comment) => comment.get({plain: true}));
    const plainTopTopics = topTopics.map((topic) => topic.get({ plain: true }));

    res.render('home', {
        user: plainUser,
        topTopics: plainTopTopics,
        recentComments: plainComments
    });
});

homeRouter.get('/login', async (req, res) => {
    res.render('login');
});

// router to display profile page
homeRouter.get('/user/:username', auth, async (req, res) => {
    const user = req.user.get({ plain: true });
    if (user.avatar === null) {
        imageURI = '/images/avatar-default.jpg';
    } else {
        const Buffer = require('buffer').Buffer;
        const imageData = Buffer.from(user.avatar).toString('base64');
        imageURI = `data:image/jpeg;base64,${imageData}`;
    }

    const shares = await Shares.findAll({
        where: {
            user_id: user.id,
        },
    });

    const topics = [];

    for (const share of shares) {
        const topic = await Topic.findByPk(share.topic_id);
        const plainTopic = topic.get({ plain: true });
        plainTopic.shareDetails = { ...share.get({ plain: true }) };
        topics.push(plainTopic);
    }

    const posts = await Post.findAll({
        where: {
            user_id: user.id,
        },
        include: [Topic],
    });

    const comments = await Comment.findAll({
        where: {
            user_id: user.id,
        },
        include: [Post],
    });

    const plainPosts = posts.map((post) => post.get({ plain: true }));
    const plainComments = comments.map((comment) =>
        comment.get({ plain: true })
    );

    res.render('profile', {
        user: user,
        imageURI: imageURI,
        topics: topics,
        posts: plainPosts,
        comments: plainComments,
    });
});

// Topic routes
homeRouter.get('/topic', auth, async (req, res) => {
    const plainUser = req.user.get({ plain: true });

    const topics = await Topic.findAll();

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
    /* const topic = await Topic.findByPk(id);
    const posts = await Post.findAll({
        where: {
            topic_id: req.params.id,
        }
    }); */
    const [topic, posts, asks, bids, comments] = await Promise.all([
        Topic.findByPk(id),
        Post.findAll({
            where: {
                topic_id: req.params.id,
            },
            include: [User, Comment],
            order: [['createdAt', 'DESC']],
        }),
        Ask.findAll({
            where: {
                topic_id: id,
                status: 'pending',
            },
            limit: 10,
            order: [['price', 'ASC']],
        }),
        Bid.findAll({
            where: {
                topic_id: id,
                status: 'pending',
            },
            limit: 10,
            order: [['price', 'DESC']],
        }),
        Comment.findAll({
            include: [User, Post],
            limit: 5,
            order: [['id', 'DESC']],
        }),
    ]);

    const plainUser = req.user.get({ plain: true });

    if (!topic) {
        res.status(404).end("Topic doesn't exist.");
        return;
    }
    const topicSimple = topic.get({ simple: true });
    const plainPosts = posts.map((post) => post.get({ plain: true }));

    const asksPlain = asks.map((ask) => ask.get({ plain: true }));
    const bidsPlain = bids.map((bid) => bid.get({ plain: true }));

    res.render('single-topic', {
        user: plainUser,
        topic: topicSimple,
        posts: plainPosts,
        asks: asksPlain,
        bids: bidsPlain,
    });
});

// Edit single topic
homeRouter.get('/topic/edit/:id', auth, async (req, res) => {
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

// explore page route
homeRouter.get('/explore', auth, async (req, res) => {
    const limit = 20;
    const page = 1;

    // query onclude count of shares for each topic
    const topics = await Topic.findAll({
        attributes: [
            'id',
            'topic_name',
            'description',
            'price',
            'initial_shares',
            'updated_at',
            [sequelize.fn('COUNT', sequelize.col('shares.id')), 'sharesCount'],
        ],
        include: [
            {
                model: Shares,
                attributes: [],
            },
        ],
        group: ['Topic.id'],
        order: [['updated_at', 'DESC']],
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false

    });

    const topicsOnPage = topics.length;
    const topicsAll = await Topic.findAll();
    const topicsTotal = topicsAll.length;
    const plainUser = req.user.get({ plain: true });
    const plainTopics = topics.map((topic) => topic.get({ plain: true }));
    res.render('explore', {
        topics: plainTopics,
        user: plainUser,
        topicsOnPage: topicsOnPage,
        topicsTotal: topicsTotal,
    });
});

// Get a single post
homeRouter.get('/topic/:id/:id', auth, async (req, res) => {
    const post = await Post.findOne({
        where: {
            id: req.params.id,
        },
    });
    const postSimple = post.get({ simple: true });
    console.log(postSimple);
    res.render('post', {
        post: postSimple,
    });
});

module.exports = homeRouter;
