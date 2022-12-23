const { Router } = require('express');
const auth = require('../../middleware/auth');
const { Topic } = require("./../../models");
const topicRouter = new Router();

topicRouter.post('/', auth, async (req, res) => {
  const { name, description, price } = req.body
  try {
  const newTopic = await Topic.create({
    name,
    description,
    price,
    user_id: req.user.id
    });
    res.status(200).json({
      id: newTopic.id,
    });
    } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = topicRouter