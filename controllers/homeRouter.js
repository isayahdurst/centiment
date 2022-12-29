const { Router } = require("express");
const auth = require("../middleware/auth");
const { Topic } = require('../models');

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

homeRouter.get("/topic", auth, async (req, res) => {
  const plainUser = req.user.get({ plain: true });

  const topics = await Topic.findAll({
    where: {
      user_id: req.user.id,
    },
  });
  
  const plainTopics = topics.map((topic) => topic.get({ plain: true }));

  res.render("topic", {
    user: plainUser,
    topics: plainTopics,
    });
});
// router to display profile page
homeRouter.get("/user", auth, async (req, res) => {

  const user = req.user.get({ plain: true });
  const Buffer = require('buffer').Buffer;

  const imageData = Buffer.from(user.avatar).toString('base64');
  const imageURI = `data:image/jpeg;base64,${imageData}`;
  res.render('profile', { user, imageURI });
});

module.exports = homeRouter;
