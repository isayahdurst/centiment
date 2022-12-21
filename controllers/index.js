const { Router } = require("express");

const homeRouter = require('./home-routes');
const apiRouter = require('./apis');

const allRouter = new Router();

allRouter.use('/', homeRouter);
allRouter.use('/api', apiRouter);

module.exports = allRouter;