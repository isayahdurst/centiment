const { Router } = require("express");

const homeRouter = require("./homeRouter");
const apiRouter = require("./api");

const allRouter = new Router();

allRouter.use("/", homeRouter);
allRouter.use("/api", apiRouter);

module.exports = allRouter;
