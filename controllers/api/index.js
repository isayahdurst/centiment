const { Router } = require('express');

const commentRouter = require('./comment');
const listingRouter = require('./listing');
const postRouter = require('./post');
const topicRouter = require('./topic');
const transactionRouter = require('./transaction');
const userRouter = require('./user');
const askRouter = require('./ask');
const bidRouter = require('./bid');
const adminRouter = require('./admin');

const apiRouter = new Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/topic', topicRouter);
apiRouter.use('/ask', askRouter);
apiRouter.use('/bid', bidRouter);
apiRouter.use('/admin', adminRouter);

module.exports = apiRouter;
