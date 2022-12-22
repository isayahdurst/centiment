const { Router } = require("express");
const auth = require("../middleware/auth");

const homeRouter = new Router();

homeRouter.get("/", auth, async (req, res) => {
  const plainUser = req.user.get({ plain: true });
  res.render('home', {
    user: plainUser,
  });
});

homeRouter.get("/login", async (req, res) => {
  res.render("login");
});

module.exports = homeRouter;
