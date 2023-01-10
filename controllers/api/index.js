const { Router } = require('express');

const commentRouter = require('./comment');
const listingRouter = require('./listing');
const postRouter = require('./post');
const topicRouter = require('./topic');
const userRouter = require('./user');
const askRouter = require('./ask');
const bidRouter = require('./bid');
const adminRouter = require('./admin');
const sharesRouter = require('./shares');

const apiRouter = new Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/topic', topicRouter);
apiRouter.use('/ask', askRouter);
apiRouter.use('/bid', bidRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/post', postRouter);
apiRouter.use('/comment', commentRouter);
apiRouter.use('/shares', sharesRouter);

module.exports = apiRouter;
