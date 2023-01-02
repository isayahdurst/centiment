const { Router } = require('express');

const categoryRouter = require('./category');
const commentRouter = require('./comment');
const listingRouter = require('./listing');
const postRouter = require('./post');
const topicRouter = require('./topic');
const transactionRouter = require('./transaction');
const userRouter = require('./user');
const askRouter = require('./ask');

const apiRouter = new Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/topic', topicRouter);
apiRouter.use('/ask', askRouter);

module.exports = apiRouter;
