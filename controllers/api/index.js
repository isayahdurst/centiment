const { Router } = require("express");

const categoryRouter = require('./category');
const commentRouter = require('./comment');
const listingRouter = require('./listing');
const postRouter = require('./post');
const topicRouter = require('./topic');
const transactionRouter = require('./transaction');
const userRouter = require('./user');
const walletRouter = require('./wallet');



const apiRouter = new Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/topic', topicRouter);


module.exports = apiRouter;